var services = angular.module('mexicoxport.services', []);

services.service('DescargarNoticiasService', function($http, $log) {

  this.recientes = function(cantidadNoticias, categoriaId, callback) {
    $log.debug('Iniciando descarga de noticias.');

    $log.debug('Descargando noticias...');
    $http({
      url: 'http://mexicoxport.com/api/noticias/index.php',
      method: 'GET',
      params: {ultima: cantidadNoticias,
               categoria_id: categoriaId}
    }).success(function(noticias) {
      $log.debug(noticias.length + ' noticias descargadas.');
      callback(noticias);
    });
  };

  this.top = function(callback) {
    $log.debug('Descargando top de noticias...');

    $http({url: 'http://mexicoxport.com/api/noticias/top.php',
           method: 'GET'})
      .success(function(noticias) {
        $log.debug('Top de noticias descargado.');
        callback(noticias);
      }
    );
  };

  this.noticia = function(id, callback) {
    $log.debug('Obteniendo noticia con id ' + id + '...');

    $http({
      url: 'http://mexicoxport.com/api/noticias/show.php',
      method: 'GET',
      params: {noticia_id: id}
    }).success(function(noticia) {
      $log.debug('Noticia obtenida.');
      callback(noticia);
    });
  };

});

services.service('DescargarCategoriasService', function($http, $log) {

  this.categorias = function(callback) {
    $log.debug('Iniciando descarga de categorías.');

    var url = 'http://mexicoxport.com/api/categorias/index.php';

    $log.debug('Descargando categorías de ' + url + '...');
    $http.get(url).success(function(categorias) {
      $log.debug(categorias.length + ' categorias descargadas.');
      if (callback !== null && callback !== undefined) callback(categorias);
    });
  };

});
