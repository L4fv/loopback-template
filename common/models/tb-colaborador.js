'use strict';

module.exports = function(Tbcolaborador) {
  Tbcolaborador.roles = function(id, cb) {
    const ds = Tbcolaborador.dataSource;
    /*eslint-disable */
    const sql = `select id_sede, id_colaborador, nombres, apellidos, usuario, id_role, rol_nombre, cargo, id_documento, documento, password, ruc, fecha_nacimiento, user_sunat, clave_sunat, fecha_ingreso, celular, id_turno, sueldo, numero_banco, email, caja_open from tb_colaborador usua, tb_roles_usuarios roles where usua.id_role = roles.id and usua.id = ${id}`;
    /*eslint-enable */
    ds.connector.query(sql, function(err, data) {
      if (err) console.error(err);
      cb(err, data);
    });
  };
  Tbcolaborador.remoteMethod(
    'roles',
    {
      description: 'Arreglo rol colaboradores',
      accepts: {arg: 'id', type: 'number', required: true},
      http: {path: '/user/:id/', verb: 'get'},
      returns: {arg: 'roles', type: Object, root: true},
    }
  );
};
