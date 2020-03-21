/* eslint-disable max-len */
'use strict';

module.exports = function(Tbreserva) {
  // Cierre de caja POST
  Tbreserva.cierredecajaPost = function(data, cb) {
    const sede = data.sede;
    console.log(sede);
    const userId = data.user_id;
    console.log(userId);
    const usuario = data.usuario;
    console.log(usuario);
    const gastos = data.gastos;
    console.log(gastos);
    const itemsgastos = data.itemsgastos;
    console.log(itemsgastos);
    let fechat = null;
    console.log('Cerrando caja con parametros');
    // console.log(id);
    const ds = Tbreserva.dataSource;
    /*eslint-disable */
    const sql = `select created_at from tb_cierres where sede = ${sede} ORDER BY id DESC limit 1`;
    ds.connector.query(sql, function(err, data) {
      if (err) {
        console.log(err);
        console.log('Error');
      } else {
        try {
          console.log('Fecha para consultar Caja:');
          console.log(data[0]);
          console.log(data[0].created_at);
          var date = new Date(data[0].created_at);
          fechat = date.toISOString();
          console.log(fechat);
          cerrarCaja(fechat);
        } catch (e) {
          console.log('No se pudo obtener la fecha del ultimo cierre');
          cerrarCaja(0);
        }
      }
    });
    function cerrarCaja(arg) {
      const sql = `select * from tb_reserva where id_sede = '${sede}' and id_user = ${userId} and created_at >= '${arg}'`;
      console.log(sql);
      /*eslint-enable */
      ds.connector.query(sql, function(err, data) {
        let itemsprivado = [];
        let totalprivado = 0;
        let itemsmixtos = [];
        let totalmixtos = 0;
        let itemsmass = [];
        let totalmass = 0;
        let itemsproductos = [];
        let totalproductos = 0;
        // let itemsgastos = [];
        // let totalgastos = 0;
        let totalefectivo = 0;
        let totaltarjeta = 0;
        let totaltransferencia = 0;
        let cajaTotal = 0;
        if (err) console.error(err);
        const array = data;
        // console.log(array.length);
        const fin = array.length;
        let i = 0;
        array.forEach(function(element) {
          // console.log(element);
          privados(element);
          mixtos(element);
          mass(element);
          productos(element);
          efectivo(element);
          tarjeta(element);
          transferencia(element);
          // Cuando finalice el conteo se ejecuta la query de insert
          i = i + 1;
          if (fin === i) {
            /*eslint-disable */
            const items_mixtos = JSON.stringify(itemsmixtos);
            const items_privado = JSON.stringify(itemsprivado);
            const items_mass = JSON.stringify(itemsmass);
            const items_productos = JSON.stringify(itemsproductos);
            const items_gastos = JSON.stringify(itemsgastos);
            cajaTotal = totalprivado + totalmixtos + totalmass + totalproductos;
            console.log(`Caja totalo: ${cajaTotal }`);
            // cajaTotal = totalprivado + totalmixtos + totalmass + totalproductos + totalefectivo + totaltarjeta;
            // const sqlInsert = `INSERT INTO tb_cierres (sede, user_id, usuario, items_mixto, ventas_mixto, items_privado, ventas_privado, items_mass, ventas_mass, items_produc, ventas_produc, items_gastos, gastos, ventas_efectivo, ventas_tarjeta, total) VALUES ('${sede}', '${userId}', '${usuario}', '${items_mixtos}', '${totalmixtos}', '${items_privado}', '${totalprivado}', '${items_mass}', '${totalmass}', '${items_productos}', '${totalproductos}', '${items_gastos}', '${gastos}' ,'${totalefectivo}', '${totaltarjeta}', '${cajaTotal}')`;
            const sqlInsert = `INSERT INTO tb_cierres (sede, user_id, usuario, items_mixto, ventas_mixto, items_privado, ventas_privado, items_mass, ventas_mass, items_produc, ventas_produc, ventas_efectivo, ventas_tarjeta, ventas_transferencias, total) VALUES ('${sede}', '${userId}', '${usuario}', '${items_mixtos}', '${totalmixtos}', '${items_privado}', '${totalprivado}', '${items_mass}', '${totalmass}', '${items_productos}', '${totalproductos}', '${totalefectivo}', '${totaltarjeta}', '${totaltransferencia}', '${cajaTotal}')`;
            console.log('sqlInsert');
            console.log(sqlInsert);
            /*eslint-enable */
            ds.connector.query(sqlInsert, function(err, data) {
              if (err) console.error(err);
              console.log(data);
            });
          }
        });
        function privados(arg) {
          const privadosParse = JSON.parse(arg.privados);
          try {
            const priSubTotal =  parseFloat(privadosParse[0].subTotal);
            totalprivado = (totalprivado + priSubTotal);
            itemsprivado.push(privadosParse[0]);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function mixtos(arg) {
          const privadosParse = JSON.parse(arg.mixtos);
          // console.log(privadosParse[0]);
          try {
            const priSubTotal =  parseFloat(privadosParse[0].subTotal);
            totalmixtos = (totalmixtos + priSubTotal);
            itemsmixtos.push(privadosParse[0]);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas mixtos');
          }
        };
        function mass(arg) {
          const privadosParse = JSON.parse(arg.masajes);
          try {
            const priSubTotal =  parseFloat(privadosParse[0].subTotal);
            totalmass = (totalmass + priSubTotal);
            itemsmass.push(privadosParse[0]);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas mass');
          }
        };
        function productos(arg) {
          const privadosParse = JSON.parse(arg.productos);
          try {
            const priSubTotal =  parseFloat(privadosParse[0].subTotal);
            totalproductos = (totalproductos + priSubTotal);
            itemsproductos.push(privadosParse[0]);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas productos');
          }
        };
        function efectivo(arg) {
          // const privadosParse = JSON.parse(arg);
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.efectivo);
            totalefectivo = (totalefectivo + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas efectivo');
          }
        };
        function tarjeta(arg) {
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.tarjeta);
            totaltarjeta = (totaltarjeta + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas tarjeta');
          }
        };
        function transferencia(arg) {
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.transferencia);
            totaltransferencia = (totaltransferencia + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas tarjeta');
          }
        };
        const resut = {
          totalprivado: totalprivado,
          itemsprivado: itemsprivado,
          totalmixtos: totalmixtos,
          itemsmixtos: itemsmixtos,
          totalmass: totalmass,
          itemsmass: itemsmass,
          totalproductos: totalproductos,
          itemsproductos: itemsproductos,
          // totalgastos: gastos,
          // itemsgastos: itemsgastos,
          totalefectivo: totalefectivo,
          totaltarjeta: totaltarjeta,
          totaltransferencia: totaltransferencia,
          cajaTotal: cajaTotal,
        };
        cb(err, resut);
      });
    }
  };
  Tbreserva.remoteMethod(
    'cierredecajaPost',
    {
      description: 'Arreglo relacionada Tb_precio y nombre',
      accepts: [
        {arg: 'data', type: 'object', 'http': {'source': 'body'}, required: true},
      ],
      http: {path: '/cierredecaja', verb: 'post', 'source': 'body'},
      returns: {arg: 'cierredecaja', type: Object, root: true},
    }
  );

  // Consultar Caja sin parametros
  Tbreserva.consultacajaGet = function(data, cb) {
    const ds = Tbreserva.dataSource;
    /*eslint-disable */
    const sql = `select * from tb_cierres`;
    console.log(sql);
    /*eslint-enable */
    ds.connector.query(sql, function(err, data) {
      if (err) console.error(err);
      cb(err, data);
    });
  };
  Tbreserva.remoteMethod(
    'consultacajaGet',
    {
      description: 'Arreglo relacionada Tb_precio y consultacaja',
      accepts: {arg: 'filter', type: 'string'},
      http: {path: '/consultacaja', verb: 'get'},
      returns: {arg: 'consultacaja', type: Object, root: true},
    }
  );

  // Consultar Caja sin parametros
  Tbreserva.detallecajaGet = function(fecha, sede, cb) {
    let valor1 = null;
    let valor2 = null;
    const ds = Tbreserva.dataSource;
    /*eslint-disable */
    function ejecucion1() {
      const sql = `select * from tb_cierres where sede = ${sede} and created_at LIKE '%${fecha}%'`;
      console.log(sql);
      ds.connector.query(sql, function(err, data) {
        if (err) console.error(err);
        valor1 = data;
        ejecucion2();
      });
    }
    function ejecucion2() {
      const sql2 = `select * from tb_reserva where id_sede = ${sede} and created_at LIKE '%${fecha}%'`;
      console.log(sql2);
      ds.connector.query(sql2, function(err, data) {
        if (err) console.error(err);
        valor2 = data;
        imprimir();
      });
    }
    ejecucion1();
    function imprimir() {
      const print = {
        cierres: valor1,
        reservas: valor2,
      }
      cb(null, print);
    }
  };
  Tbreserva.remoteMethod(
    'detallecajaGet',
    {
      description: 'Arreglo relacionada Tb_precio y consultacaja',
      accepts: [
        {arg: 'fecha', type: 'string'},
        {arg: 'sede', type: 'string'},
      ],
      http: {path: '/detallecaja', verb: 'get'},
      returns: {arg: 'detallecaja', type: Object, root: true},
    }
  );

  // Consultar Caja - sede - user - fecha
  Tbreserva.consultacaja = function(sede, userId, fecha, cb) {
    const ds = Tbreserva.dataSource;
    /*eslint-disable */
    const sql = `select * from tb_cierres where sede = '${sede}' and user_id = '${userId}' and created_at LIKE '${fecha}%'`;
    console.log('sql');
    console.log(sql);
    /*eslint-enable */
    ds.connector.query(sql, function(err, data) {
      if (err) console.error(err);
      cb(err, data);
    });
  };
  Tbreserva.remoteMethod(
    'consultacaja',
    {
      description: 'Arreglo relacionada Tb_precio y consultacaja',
      accepts: [
        {arg: 'sede', type: 'number', required: true},
        {arg: 'userId', type: 'number', required: true},
        {arg: 'fecha', type: 'string', required: true},
      ],
      http: {path: '/consultacaja/:sede/:userId/', verb: 'get'},
      returns: {arg: 'consultacaja', type: Object, root: true},
    }
  );

  // Caja por fsede - user - fecha
  Tbreserva.cajaGet = function(sede, id, fecha, cb) {
    // console.log(id);
    const ds = Tbreserva.dataSource;
    /*eslint-disable */
    // const sql = `select created_at from tb_cierres ORDER BY id DESC limit 1`;
    // ds.connector.query(sql, function(err, data) {
    //   if (err) console.log(err);
    //   cerrarCaja(data)
    // });
    cerrarCaja(fecha);
    function cerrarCaja(fecha) {
      const sql = `select * from tb_reserva where id_sede = '${sede}' and id_user = ${id} and created_at >= '${fecha}'`;
      console.log(sql);
      /*eslint-enable */
      ds.connector.query(sql, function(err, data) {
        let totalprivado = 0;
        let totalmixtos = 0;
        let totalmass = 0;
        let totalproductos = 0;
        let totalefectivo = 0;
        let totaltarjeta = 0;
        let totaltransferencia = 0;
        let cajaTotal = 0;
        if (err) console.error(err);
        const array = data;
        // console.log(array.length);
        const fin = array.length;
        let i = 0;
        array.forEach(function(element) {
          // console.log(element);
          privados(element);
          mixtos(element);
          mass(element);
          productos(element);
          efectivo(element);
          tarjeta(element);
          transferencia(element);
          i = i + 1;
        });
        function privados(arg) {
          const privadosParse = JSON.parse(arg.privados);
          try {
            const priSubTotal =  parseFloat(privadosParse[0].subTotal);
            totalprivado = (totalprivado + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function mixtos(arg) {
          const privadosParse = JSON.parse(arg.mixtos);
          try {
            const priSubTotal =  parseFloat(privadosParse[0].subTotal);
            totalmixtos = (totalmixtos + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function mass(arg) {
          const privadosParse = JSON.parse(arg.masajes);
          try {
            const priSubTotal =  parseFloat(privadosParse[0].subTotal);
            totalmass = (totalmass + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function productos(arg) {
          const privadosParse = JSON.parse(arg.productos);
          try {
            const priSubTotal =  parseFloat(privadosParse[0].subTotal);
            totalproductos = (totalproductos + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function efectivo(arg) {
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.efectivo);
            totalefectivo = (totalefectivo + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function tarjeta(arg) {
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.tarjeta);
            totaltarjeta = (totaltarjeta + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function transferencia(arg) {
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.transferencia);
            totaltransferencia = (totaltransferencia + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas tarjeta');
          }
        };
        // console.log(totalprivado);
        // console.log(totalmixtos);
        // console.log(totalmass);
        // console.log(totalproductos);
        const resut = {
          totalprivado: totalprivado,
          totalmixtos: totalmixtos,
          totalmass: totalmass,
          totalproductos: totalproductos,
          totalefectivo: totalefectivo,
          totaltarjeta: totaltarjeta,
          totaltransferencia: totaltransferencia,
          // cajaTotal: totalprivado + totalmixtos + totalmass + totalproductos + totalefectivo + totaltarjeta,
          cajaTotal: totalprivado + totalmixtos + totalmass + totalproductos,
        };
        cb(err, resut);
      });
    }
  };
  Tbreserva.remoteMethod(
    'cajaGet',
    {
      description: 'Arreglo relacionada Tb_precio y nombreconsultarReservasSedes',
      accepts: [
        {arg: 'sede', type: 'number'},
        {arg: 'id',  type: 'number'},
        {arg: 'fecha',  type: 'string'},
      ],
      http: {path: '/caja/:sede/:id/', verb: 'get'},
      returns: {arg: 'caja', type: Object, root: true},
    }
  );

//  Caja por sede - userId
  Tbreserva.caja = function(sede, id, cb) {
    let fechat = null;
    let gastosToaltes = null;
    console.log(`SEDE: ${sede}`);
    console.log(`USER: ${id}`);
    // console.log(id);
    const ds = Tbreserva.dataSource;
    /*eslint-disable */
    const sql = `select * from tb_cierres where sede = ${sede} ORDER BY id DESC limit 1`;
    ds.connector.query(sql, function(err, data) {
      if (err) {
        console.log(err);
        console.log('Error');
      } else {
        try {
          console.log('Fecha para consultar Caja:');
          console.log(data[0]);
          // cerrarCaja(data[0]);
          console.log(data[0].created_at);
          var date = new Date(data[0].created_at);
          fechat = date.toISOString();
          console.log(fechat);
          cerrarCaja(fechat);
        } catch (e) {
          console.log('No se pudo obtener la fecha del ultimo cierre');
          cerrarCaja(0);
        }
      }
    });
    function cerrarCaja(arg) {
      const sql = `select * from tb_reserva where id_sede = '${sede}' and id_user = ${id} and created_at >= '${arg}'`;
      console.log(sql);
      /*eslint-enable */
      ds.connector.query(sql, function(err, data) {
        let totalprivado = 0;
        let totalmixtos = 0;
        let totalmass = 0;
        let totalproductos = 0;
        let totalgastos = 0;
        let totalefectivo = 0;
        let totaltarjeta = 0;
        let totaltransferencia = 0;
        let cajaTotal = 0;
        if (err) console.error(err);
        const array = data;
        // console.log(array.length);
        const fin = array.length;
        let i = 0;
        array.forEach(function(element) {
          // console.log(element);
          privados(element);
          mixtos(element);
          mass(element);
          productos(element);
          gastos(element);
          efectivo(element);
          tarjeta(element);
          transferencia(element);
          i = i + 1;
        });
        function privados(arg) {
          const privadosParse = JSON.parse(arg.privados);
          try {
            const priSubTotal =  parseFloat(privadosParse[0].subTotal);
            totalprivado = (totalprivado + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function mixtos(arg) {
          const privadosParse = JSON.parse(arg.mixtos);
          try {
            const priSubTotal =  parseFloat(privadosParse[0].subTotal);
            totalmixtos = (totalmixtos + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function mass(arg) {
          const privadosParse = JSON.parse(arg.masajes);
          try {
            const priSubTotal =  parseFloat(privadosParse[0].subTotal);
            totalmass = (totalmass + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function productos(arg) {
          const privadosParse = JSON.parse(arg.productos);
          try {
            const priSubTotal =  parseFloat(privadosParse[0].subTotal);
            totalproductos = (totalproductos + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function gastos(arg) {
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.gastos);
            totalgastos = (totalgastos + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function efectivo(arg) {
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.efectivo);
            totalefectivo = (totalefectivo + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function tarjeta(arg) {
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.tarjeta);
            totaltarjeta = (totaltarjeta + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function transferencia(arg) {
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.transferencia);
            totaltransferencia = (totaltransferencia + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas tarjeta');
          }
        };
        // console.log(totalprivado);
        // console.log(totalmixtos);
        // console.log(totalmass);
        // console.log(totalproductos);
        const resut = {
          totalprivado: totalprivado,
          totalmixtos: totalmixtos,
          totalmass: totalmass,
          totalproductos: totalproductos,
          totalgastos: totalgastos,
          totalefectivo: totalefectivo,
          totaltarjeta: totaltarjeta,
          totaltransferencia : totaltransferencia,
          // cajaTotal: totalprivado + totalmixtos + totalmass + totalproductos + totalefectivo + totaltarjeta,
          // cajaTotal: totalprivado + totalmixtos + totalmass + totalproductos,
          cajaTotal: totalefectivo + totaltarjeta + totaltransferencia,
        };
        cb(err, resut);
      });
    }
  };
  Tbreserva.remoteMethod(
    'caja',
    {
      description: 'Arreglo relacionada Tb_precio y nombre',
      accepts: [
        {arg: 'sede', type: 'number'},
        {arg: 'id',  type: 'number'},
      ],
      http: {path: '/caja/:sede/:id/', verb: 'get'},
      returns: {arg: 'caja', type: Object, root: true},
    }
  );

  // Registrar reserva procesada
  Tbreserva.procesarReserva = function(sede, user, estado, id, cb) {

    console.log(`sede : ${sede}`);
    console.log(`user : ${user}`);
    console.log(`estado : ${estado}`);
    console.log(`id : ${id}`);
    const ds = Tbreserva.dataSource;
    /*eslint-disable */
    const sql = `UPDATE tb_reserva SET finalizado = ${estado} where id_sede = ${sede} and id_user = ${user} and id = ${id}`;
    ds.connector.query(sql, function(err, data) {
      if (err) {
        console.log(err);
        const dataJson = {
          result : false,
          columnaActualizadas: data.affectedRows
        };
        cb(dataJson, null)
      } else {
        console.log(data);
        const dataJson = {
          result : true,
          columnaActualizadas: data.affectedRows
        };
        cb(null, dataJson)
      }
    });
  };
  Tbreserva.remoteMethod(
    'procesarReserva',
    {
      description: 'Registrar Reserva procesada',
      accepts: [
        {arg: 'sede', type: 'number'},
        {arg: 'user',  type: 'number'},
        {arg: 'estado',  type: 'number'},
        {arg: 'id',  type: 'number'},
      ],
      http: {path: '/procesarReserva/:sede/:user/:estado/:id', verb: 'get'},
      returns: {arg: 'procesarReserva', type: Object, root: true},
    }
  );

  Tbreserva.consultarReservas = function(sede, user, estado, fecha, cb) {
    let fechat = null;
    console.log(`sede : ${sede}`);
    console.log(`user : ${user}`);
    console.log(`estado : ${estado}`);
    console.log(`estado : ${fecha}`);

    const ds = Tbreserva.dataSource;
    /*eslint-disable */
    cerrarCaja();
    /*eslint-disable */
    function cerrarCaja() {
      // const sql = `select * from tb_reserva where id_sede = '${sede}' and id_user = ${userId} and created_at >= '${arg}'`;
      const sql = `SELECT * from tb_reserva where id_sede = ${sede} and id_user = ${user} and finalizado = ${estado} and created_at LIKE '%${fecha}%'`;
      console.log(sql);
      /*eslint-enable */
      ds.connector.query(sql, function(err, data) {
        let itemsprivado = [];
        let totalprivado = 0;
        let itemsmixtos = [];
        let totalmixtos = 0;
        let itemsmass = [];
        let totalmass = 0;
        let itemsproductos = [];
        let totalproductos = 0;
        let totalefectivo = 0;
        let totaltarjeta = 0;
        let totaltransferencia = 0;
        let cajaTotal = 0;
        if (err) console.error(err);
        const array = data;
        // console.log(array.length);
        const fin = array.length;
        let i = 0;
        array.forEach(function(element) {
          // console.log(element);
          privados(element);
          mixtos(element);
          mass(element);
          productos(element);
          efectivo(element);
          tarjeta(element);
          transferencia(element);
          // Cuando finalice el conteo se ejecuta la query de insert
          i = i + 1;
          if (fin === i) {
            /*eslint-disable */
            // cajaTotal = totalprivado + totalmixtos + totalmass + totalproductos + totalefectivo + totaltarjeta;
            // cajaTotal = totalprivado + totalmixtos + totalmass + totalproductos;
            cajaTotal = totalefectivo + totaltarjeta + totaltransferencia;

          }
        });
        function privados(arg) {
          const privadosParse = JSON.parse(arg.privados);
          try {
            privadosParse.forEach(function(element) {
              const priSubTotal =  parseFloat(element.subTotal);
              totalprivado = (totalprivado + priSubTotal);
              itemsprivado.push(element);
            });
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function mixtos(arg) {
          const privadosParse = JSON.parse(arg.mixtos);
          // console.log(privadosParse[0]);
          try {
            privadosParse.forEach(function(element) {
              const priSubTotal =  parseFloat(element.subTotal);
              totalmixtos = (totalmixtos + priSubTotal);
              itemsmixtos.push(element);
            });
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas mixtos');
          }
        };
        function mass(arg) {
          const privadosParse = JSON.parse(arg.masajes);
          try {
            privadosParse.forEach(function(element) {
              const priSubTotal =  parseFloat(element.subTotal);
              totalmass = (totalmass + priSubTotal);
              itemsmass.push(element);
            });
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas mass');
          }
        };
        function productos(arg) {
          const privadosParse = JSON.parse(arg.productos);
          try {
            privadosParse.forEach(function(element) {
              const priSubTotal =  parseFloat(element.subTotal);
              totalproductos = (totalproductos + priSubTotal);
              itemsproductos.push(element);
            });
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas productos');
          }
        };
        function efectivo(arg) {
          // const privadosParse = JSON.parse(arg);
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.efectivo);
            totalefectivo = (totalefectivo + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas efectivo');
          }
        };
        function tarjeta(arg) {
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.tarjeta);
            totaltarjeta = (totaltarjeta + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas tarjeta');
          }
        };
        function transferencia(arg) {
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.transferencia);
            totaltransferencia = (totaltransferencia + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas tarjeta');
          }
        };
        const resut = {
          totalprivado: totalprivado,
          itemsprivado: itemsprivado,
          totalmixtos: totalmixtos,
          itemsmixtos: itemsmixtos,
          totalmass: totalmass,
          itemsmass: itemsmass,
          totalproductos: totalproductos,
          itemsproductos: itemsproductos,
          totalefectivo: totalefectivo,
          totaltarjeta: totaltarjeta,
          totaltransferencia: totaltransferencia,
          cajaTotal: cajaTotal,
        };
        cb(err, resut);
      });
    }
  };
  Tbreserva.remoteMethod(
    'consultarReservas',
    {
      description: 'Consultar Reservas por Usuario',
      accepts: [
        {arg: 'sede', type: 'number'},
        {arg: 'user',  type: 'number'},
        {arg: 'estado',  type: 'number'},
        {arg: 'fecha',  type: 'string'}
      ],
      http: {path: '/consultarReservas/:sede/:user/:estado/:fecha', verb: 'get'},
      returns: {arg: 'consultarReservas', type: Object, root: true},
    }
  );


  Tbreserva.consultarReservasSedes = function(sede, estado, fecha, cb) {
    let fechat = null;
    console.log(`sede : ${sede}`);
    console.log(`estado : ${estado}`);
    console.log(`estado : ${fecha}`);

    const ds = Tbreserva.dataSource;
    /*eslint-disable */
    cerrarCaja();
    /*eslint-disable */
    function cerrarCaja() {
      let sql = '';
      if (estado == 1) {
        sql = `SELECT * from tb_reserva where id_sede = ${sede} and (finalizado = ${estado} or finalizado = 3) and created_at LIKE '%${fecha}%'`;
      } else {
        sql = `SELECT * from tb_reserva where id_sede = ${sede} and finalizado = ${estado} and created_at LIKE '%${fecha}%'`;
      }
      // const sql = `select * from tb_reserva where id_sede = '${sede}' and id_user = ${userId} and created_at >= '${arg}'`;

      console.log(sql);
      /*eslint-enable */
      ds.connector.query(sql, function(err, data) {
        let itemsprivado = [];
        let totalprivado = 0;
        let itemsmixtos = [];
        let totalmixtos = 0;
        let itemsmass = [];
        let totalmass = 0;
        let itemsproductos = [];
        let totalproductos = 0;
        let itemsgastos = [];
        let totalgastos = 0;
        let totalefectivo = 0;
        let totaltarjeta = 0;
        let totaltransferencia = 0;
        let cajaTotal = 0;
        if (err) console.error(err);
        const array = data;
        // console.log(array.length);
        const fin = array.length;
        let i = 0;
        array.forEach(function(element) {
          // console.log(element);
          privados(element);
          mixtos(element);
          mass(element);
          productos(element);
          gastos(element);
          gastositems(element);
          efectivo(element);
          tarjeta(element);
          transferencia(element);
          // Cuando finalice el conteo se ejecuta la query de insert
          i = i + 1;
          if (fin === i) {
            /*eslint-disable */
            // cajaTotal = totalprivado + totalmixtos + totalmass + totalproductos + totalefectivo + totaltarjeta;
            // cajaTotal = totalprivado + totalmixtos + totalmass + totalproductos + totaltarjeta;
            cajaTotal = totalefectivo + totaltarjeta + totaltransferencia;
          }
        });
        function privados(arg) {
          const privadosParse = JSON.parse(arg.privados);
          try {
            privadosParse.forEach(function(element) {
              // console.log(element);
              const priSubTotal =  parseFloat(element.subTotal);
              totalprivado = (totalprivado + priSubTotal);
              itemsprivado.push({...element, idTicket : arg.id});
            });
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas privadas');
          }
        };
        function mixtos(arg) {
          const privadosParse = JSON.parse(arg.mixtos);
          // console.log(privadosParse[0]);
          try {
            privadosParse.forEach(function(element) {
              // console.log(element);
              const priSubTotal =  parseFloat(element.subTotal);
              totalmixtos = (totalmixtos + priSubTotal);
              // itemsmixtos.push(element);
              itemsmixtos.push({
                ...element,
                idTicket : arg.id
              });
            });
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas mixtos');
          }
        };
        function mass(arg) {
          const massParse = JSON.parse(arg.masajes);
          try {
            massParse.forEach(function(element) {
              // console.log(element);
              const priSubTotal =  parseFloat(element.subTotal);
              totalmass = (totalmass + priSubTotal);
              itemsmass.push({...element, idTicket : arg.id});
            });
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas mass');
          }
        };
        function productos(arg) {
          const privadosParse = JSON.parse(arg.productos);
          try {
            privadosParse.forEach(function(element) {
              // console.log(element);
              const priSubTotal =  parseFloat(element.subTotal);
              totalproductos = (totalproductos + priSubTotal);
              itemsproductos.push({...element, idTicket : arg.id});
            });

          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas productos');
          }
        };
        function gastositems(arg) {
          const privadosParse = arg.itemsgastos;
          try {
            privadosParse.forEach(function(element) {
              itemsgastos.push({...element, idTicket : arg.id});
              // console.log(element);
            });
            // const priSubTotal =  parseFloat(privadosParse[0]);
            // totalproductos = (totalproductos + priSubTotal);

          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas productos');
          }
        };
        function gastos(arg) {
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.gastos);
            // totalproductos = (totalproductos + priSubTotal);
            totalgastos.push(priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas productos');
          }
        };
        function efectivo(arg) {
          // const privadosParse = JSON.parse(arg);
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.efectivo);
            totalefectivo = (totalefectivo + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas efectivo');
          }
        };
        function tarjeta(arg) {
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.tarjeta);
            totaltarjeta = (totaltarjeta + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas tarjeta');
          }
        };
        function transferencia(arg) {
          const privadosParse = arg;
          try {
            const priSubTotal =  parseFloat(privadosParse.transferencia);
            totaltransferencia = (totaltransferencia + priSubTotal);
          } catch (e) {
            // console.log(e);
            console.log('No tiene ventas tarjeta');
          }
        };
        const resut = {
          totalprivado: totalprivado,
          itemsprivado: itemsprivado,
          totalmixtos: totalmixtos,
          itemsmixtos: itemsmixtos,
          totalmass: totalmass,
          itemsmass: itemsmass,
          totalproductos: totalproductos,
          itemsproductos: itemsproductos,
          totalgastos: totalgastos,
          itemsgastos: itemsgastos,
          totalefectivo: totalefectivo,
          totaltarjeta: totaltarjeta,
          totaltransferencia: totaltransferencia,
          cajaTotal: cajaTotal,
        };
        console.log(resut);
        // del arreglo
      //   const delarreglo = (
      //       parseInt(totalprivado) +
      //       parseInt(totalmixtos) +
      //       parseInt(totalmass) +
      //       parseInt(totalproductos)
      // );
      //   console.log("############################## del arreglo ############################");
      //   console.log(itemsprivado);
        cb(err, resut);
      });
    }
  };
  Tbreserva.remoteMethod(
    'consultarReservasSedes',
    {
      description: 'Consultar Reservas por Usuario',
      accepts: [
        {arg: 'sede', type: 'number'},
        {arg: 'estado',  type: 'number'},
        {arg: 'fecha',  type: 'string'}
      ],
      http: {path: '/consultarReservasSedes/:sede/:estado/:fecha', verb: 'get'},
      returns: {arg: 'consultarReservasSedes', type: Object, root: true},
    }
  );

};
