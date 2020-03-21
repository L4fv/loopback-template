'use strict';

module.exports = function(Reportes) {

  Reportes.porFechas = (data, cb) => {
    console.info('Incio Reportes');
    console.log(data);
    const ds = Reportes.dataSource;

    // TODO: Variables globale
    let tb_reservas_json = [];
    let tb_pre_reservas_json = [];
    let tb_product_json = [];
    let tb_gastos_sedes_json = [];

    // TODO: Formateando output
    const result_json = {
      tb_reservas_json,
      tb_pre_reservas_json,
      tb_product_json,
      tb_gastos_sedes_json
    }

    //TODO: Funcion generica para ejecutar la query async/await
    function sampleFunc(query) {
      return new Promise(function(resolve, reject) {
        ds.connector.query(query, function(err, units) {
          if (err) {
            return reject(err);
          }
          return resolve(units);
        });
      });
    }

    //TODO: Descomentar para prbar con promesas
    // sampleFunc(`select * from tb_gastos_sede where created_at LIKE '%${data.fecha}%' limit 1`).then(function(units) {
    //   // do something with units
    //   console.log(units);
    // })
    //   .catch(function(err) {
    //     // do something with err
    //   });

    const main = async (arg) => {
      try {
        const tb_gastos_sede = await sampleFunc(`select * from tb_gastos_sede where created_at LIKE '%${data.fecha}%'`)
        tb_reservas_json.push(tb_gastos_sede)
        const tb_product = await sampleFunc(`select * from tb_product where created_at LIKE '%${data.fecha}%' limit 1`)
        tb_pre_reservas_json.push(tb_product)
        const tb_pre_reserva = await sampleFunc(`select * from tb_pre_reserva where created_at LIKE '%${data.fecha}%' limit 1`)
        tb_product_json.push(tb_pre_reserva)
        const tb_reserva = await sampleFunc(`select * from tb_reserva where created_at LIKE '%${data.fecha}%' limit 1`)
        tb_gastos_sedes_json.push(tb_reserva)
        await cb(null, result_json)
        console.info('Fin Reportes');
      } catch (e) {
        console.warn(e)
        cb(e, null)
      }
    }

    //TODO: Funcion que inicia todo el proceso
    main(data.fecha)
  }
};
