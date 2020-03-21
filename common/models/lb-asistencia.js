/* eslint-disable max-len */
'use strict';

module.exports = function(Lbasistencia) {
  Lbasistencia.asistencia = function(data, cb) {
    console.log(data.dni);
    const ds = Lbasistencia.dataSource;
    ds.connector.query(`select * from tb_colaborador where documento = ${data.dni}`, function(err, result) {
      if (err) {
        console.log(err);
        cb(err, null);
      } else {
        if (result != '') {
          console.log('Si encontro');
          insertar(result);
        } else {
          console.log('No se encontro');
          cb(null, false);
        }
      };
    });
    function insertar(arg) {
      console.log(arg[0]);
      const insertAsistencia = `INSERT INTO \`lb_asistencia\`(\`user_id\`, \`usuario\`, \`sede_id\`) VALUES ('${arg[0].id}','${arg[0].nombres} ${arg[0].apellidos}','${arg[0].id_sede}')`;
      ds.connector.query(insertAsistencia, function(err, result) {
        if (err) {
          console.log(err);
          cb(err, null);
        } else {
          console.log('Se guardo correctamente el suaurio');
          cb(null, arg[0]);
        }
      });
    };
    function traerRegistro() {

    }
  };

  Lbasistencia.consultarasistencia = function(sede, cb) {
    const ds = Lbasistencia.dataSource;
    ds.connector.query(`select * from lb_asistencia where sede_id = ${sede}`, function(err, result) {
      if (err) {
        console.log('No se pudo');
        cb(err, null);
      } else {
        console.log(result);
        cb(null, result);
      }
    });
  };

  Lbasistencia.consultarAsistenciaPorDia = function(sede, fecha, cb) {
    const ds = Lbasistencia.dataSource;
    ds.connector.query(`select * from lb_asistencia where sede_id = ${sede} and created_at LIKE '%${fecha}%'`, function(err, result) {
      if (err) {
        console.log('error en la consulta');
        cb(err, null);
      } else {
        // const fecha1 = new Date(result[0].updated_at);
        // const fecha2 = `${fecha1.toLocaleDateString()} ${fecha1.toLocaleTimeString()}`;
        // console.log(fecha2);
        // console.log(fecha1.toISOString());
        // console.log(fecha1.toString());
        // console.log(fecha1.toDateString());
        // console.log(fecha1.toUTCString());
        // console.log(fecha1.toLocaleDateString());
        // console.log(fecha1.toLocaleTimeString());
        // console.log(fecha1.toTimeString());
        cb(null, result);
      }
    });
  };
};
