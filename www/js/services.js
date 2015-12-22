var services = angular.module('mexicoxport.services', []);

services.service('DescargarNoticiasService', function($http, $log) {

  this.recientes = function(cantidadNoticias, categoriaId, keywords, callback) {
    $log.debug('Iniciando descarga de noticias.');

    $log.debug('Descargando noticias...');
    $http({
      url: 'http://mexicoxport.com/api/noticias/index.php',
      method: 'GET',
      params: {ultima: cantidadNoticias,
               categoria_id: categoriaId,
               buscar: keywords}
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

services.service('TvService', function($log, GOOGLE_API_KEY, MEXICOXPORT_TV_PLAYLIST_ID) {
  var nextPageToken = null;
  var total = 0;

  this.nextPage = function(exitoCallback, errorCallback) {
    gapi.client.setApiKey(GOOGLE_API_KEY);

    $log.debug('Descargando información de videos de MexicoxportTv.');

    gapi.client.request({
      path:'/youtube/v3/playlistItems',
      params: {
        part: 'snippet',
        playlistId: MEXICOXPORT_TV_PLAYLIST_ID,
        maxResults: 25,
        pageToken: nextPageToken
      }
    }).then(function(response) {
      nextPageToken = response.result.nextPageToken;
      total = response.result.pageInfo.totalResults;
      exitoCallback(response.result.items);
    }, errorCallback);
  };

  this.reset = function() {
    nextPageToken = null;
  };

  this.getTotal = function() {
    return total;
  };
});
