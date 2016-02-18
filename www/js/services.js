var services = angular.module('mexicoxport.services', []);

services.service('DescargarNoticiasService', function($http, $log, MEXICOXPORT_API_VERSION) {

  this.recientes = function(cantidadNoticias, categoriaId, keywords, exitoCallback, errorCallback) {
    $log.debug('Iniciando descarga de noticias.');

    $log.debug('Descargando noticias...');
    $http({
      url: 'http://mexicoxport.com/api/noticias/index.php',
      method: 'GET',
      params: {ultima: cantidadNoticias,
               categoria_id: categoriaId,
               buscar: keywords,
               v: MEXICOXPORT_API_VERSION}
    }).success(function(respuesta) {
      $log.debug(respuesta.noticias.length + ' noticias descargadas.');
      exitoCallback(respuesta);
    }).error(errorCallback);
  };

  this.top = function(exitoCallback, errorCallback) {
    $log.debug('Descargando top de noticias...');

    $http({
      url: 'http://mexicoxport.com/api/noticias/top.php',
      method: 'GET'
    }).success(function(noticias) {
      $log.debug('Top de noticias descargado.');
      exitoCallback(noticias);
    }).error(errorCallback);
  };

  this.noticia = function(id, exitoCallback, errorCallback) {
    $log.debug('Obteniendo noticia con id ' + id + '...');

    $http({
      url: 'http://mexicoxport.com/api/noticias/show.php',
      method: 'GET',
      params: {noticia_id: id}
    }).success(function(noticia) {
      $log.debug('Noticia obtenida.');
      exitoCallback(noticia);
    }).error(errorCallback);
  };

  this.relacionadas = function(noticia, exitoCallback, errorCallback) {
    $log.debug('Obteniendo relacionados de noticia con id ' + noticia.id + '...');

    $http({
      url: 'http://mexicoxport.com/api/noticias/related.php',
      method: 'GET',
      params: {
        keywords: noticia.titulo.replace(' ', ','),
        cantidad: 5,
      }
    }).success(function(relacionadas) {
      noticia.relacionadas = relacionadas;
      exitoCallback(noticia);
    }).error(errorCallback);
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

  this.siguientePagina = function(exitoCallback, errorCallback) {
    if (typeof gapi === 'undefined') {
      errorCallback();
      return;
    }

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

  this.reiniciar = function() {
    nextPageToken = null;
  };

  this.getTotal = function() {
    return total;
  };
});

services.service('ShareStats', function($http, $log) {
  this.registerShareEvent = function() {
    $log.debug('Registering share event within web API...');

    var date = new Date();

    var request = {
      method: 'GET',
      url: 'http://mexicoxport.com/api/noticias/share.php',
      params: {
        month: date.getMonth() + 1,
        year: date.getFullYear()
      }
    };

    $http(request).then(function(response) {
      $log.debug('Share event registered.');
    }, function(response) {
      $log.debug('An error ocurred while registering share event. Please debug it.');
      $log.debug(response.status);
      $log.debug(response.data);
    });
  };
});

services.service('Comments', function($http, $log) {
  this.get = function(noticia, successCallback, errorCallback) {
    $http({
      url: 'http://mexicoxport.com/api/noticias/comentarios/index.php',
      method: 'GET',
      params: {
        noticia_id: noticia.id
      }
    }).success(successCallback).error(errorCallback);
  };

  this.new = function(values, successCallback, errorCallback) {
    $http({
      url: 'http://mexicoxport.com/api/noticias/comentarios/store.php',
      method: 'POST',
      params: values
    }).success(successCallback).error(errorCallback);
  };
});
