'use strict';

module.exports = function(Tbpricehab) {
  Tbpricehab.nombre = function(id, cb) {
    const ds = Tbpricehab.dataSource;
    /*eslint-disable */
    const sql = `select id_user, id_hab_sede, room, id_sede, id_sede_room, description, hours, price from tb_price_hab price, tb_hab_sede hab where price.id_hab_sede = hab.id and hab.id = ${id}`;
    /*eslint-enable */
    ds.connector.query(sql, function(err, data) {
      if (err) console.error(err);
      cb(err, data);
    });
  };
  Tbpricehab.remoteMethod(
    'nombre',
    {
      description: 'Arreglo relacionada Tb_precio y nombre',
      accepts: {arg: 'id', type: 'number', required: true},
      http: {path: '/name/:id/', verb: 'get'},
      returns: {arg: 'nombre', type: Object, root: true},
    }
  );

  Tbpricehab.sede = function(id, cb) {
    const ds = Tbpricehab.dataSource;
    /*eslint-disable */
    const sql = `select *, id_user, id_hab_sede, room, id_sede, id_sede_room, description, hours, price from tb_price_hab price, tb_hab_sede hab where price.id_hab_sede = hab.id and hab.id_sede_room = ${id}`;
    console.log(sql);
    /*eslint-enable */
    ds.connector.query(sql, function(err, data) {
      if (err) console.error(err);
      cb(err, data);
    });
  };
  Tbpricehab.remoteMethod(
    'sede',
    {
      description: 'Arreglo relacionada Tb_precio y sede',
      accepts: {arg: 'id', type: 'number', required: true},
      http: {path: '/sede/:id/', verb: 'get'},
      returns: {arg: 'sede', type: Object, root: true},
    }
  );
};
