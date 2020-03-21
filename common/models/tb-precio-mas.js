'use strict';

module.exports = function(Tbpricemas) {
  Tbpricemas.nombre = function(id, cb) {
    const ds = Tbpricemas.dataSource;
    /*eslint-disable */
    const sql = `select id_user, id_mas_sede, massage, id_sede, id_sede_mas, description, hours, price from tb_price_mas price, tb_mas_sede mas where price.id_mas_sede = mas.id and mas.id = ${id}`;
    /*eslint-enable */
    ds.connector.query(sql, function(err, data) {
      if (err) console.error(err);
      cb(err, data);
    });
  };
  Tbpricemas.remoteMethod(
    'nombre',
    {
      description: 'Arreglo relacionada Tb_precio y nombre',
      accepts: {arg: 'id', type: 'number', required: true},
      http: {path: '/name/:id/', verb: 'get'},
      returns: {arg: 'nombre', type: Object, root: true},
    }
  );

  Tbpricemas.sede = function(id, cb) {
    const ds = Tbpricemas.dataSource;
    /*eslint-disable */
    const sql = `select id_user, id_mas_sede, massage, id_sede, id_sede_mas, description, hours, price from tb_price_mas price, tb_mas_sede mas where price.id_mas_sede = mas.id and price.id_sede = ${id}`;
    /*eslint-enable */
    ds.connector.query(sql, function(err, data) {
      if (err) console.error(err);
      cb(err, data);
    });
  };
  Tbpricemas.remoteMethod(
    'sede',
    {
      description: 'Arreglo relacionada Tb_precio y sede',
      accepts: {arg: 'id', type: 'number', required: true},
      http: {path: '/sede/:id/', verb: 'get'},
      returns: {arg: 'sede', type: Object, root: true},
    }
  );
};
