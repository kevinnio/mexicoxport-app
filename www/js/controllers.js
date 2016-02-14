var controllers = angular.module('mexicoxport.controllers', []);

controllers.controller('AppCtrl', function($scope, $location, AlmacenCategorias, DescargarCategoriasService) {
  $scope.version = '1.0';
  $scope.categorias = AlmacenCategorias.todas();
  $scope.$location = $location;

  if ($scope.categorias.length <= 0) {
    DescargarCategoriasService.categorias(function(categorias) {
      for (var i = 0; i < categorias.length; AlmacenCategorias.agregar(categorias[i++]));
    });
  }
});

controllers.controller('TvCtrl', function($scope, TvService, AlertaSinConexion) {
  $scope.infiniteScroll = true;
  $scope.videos = [];

  $scope.siguientePagina = function() {
    TvService.siguientePagina(
      function(videos) {
        $scope.videos = $scope.videos.concat(videos);
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      },
      function() {
        AlertaSinConexion.mostrar($scope);
      }
    );
  };

  $scope.recargar = function() {
    $scope.videos = [];
    TvService.reiniciar() && $scope.siguientePagina();
  };

  $scope.puedeCargarMas = function() {
    return $scope.infiniteScroll && ($scope.videos.length <= 0 ||
      $scope.videos.length < TvService.getTotal());
  };
});

controllers.controller('NoticiasCtrl', function($scope, $stateParams, DescargarNoticiasService, $ionicLoading, AlertaSinConexion) {
  $scope.noticias = [];
  $scope.total = 0;
  $scope.infiniteScroll = true;
  $scope.busqueda = {
    mostrar: false
  };

  $scope.refrescar = function() {
    $scope.noticias = [];
    $scope.errorCarga = false;
    $scope.cargar();
  };

  $scope.cargar = function(callback) {
    var categoriaId = $stateParams.categoriaId || null;
    DescargarNoticiasService.recientes($scope.noticias.length, categoriaId, $scope.busqueda.keywords,
      function(respuesta) {
        $scope.postCargar(respuesta);
        if (callback) callback();
      },
      function() {
        AlertaSinConexion.mostrar($scope);
      }
    );
  };

  $scope.postCargar = function(respuesta) {
    $scope.noticias = $scope.noticias.concat(respuesta.noticias);

    if (respuesta.total !== null) $scope.total = respuesta.total;
    $scope.infiniteScroll = $scope.noticias.length < $scope.total;

    $scope.$broadcast('scroll.refreshComplete');
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  $scope.buscar = function(event) {
    if ($scope.busqueda.keywords && event && event.keyCode != 13) return;

    $ionicLoading.show();
    $scope.noticias = [];
    $scope.cargar(function() {
      $ionicLoading.hide();
    });
  };

  $scope.obtenerUltimaNoticia = function() {
    var ultimaNoticia;

    if ($scope.noticias.length > 0) {
      ultimaNoticia = $scope.noticias[$scope.noticias.length - 1];
    } else {
      ultimaNoticia = null;
    }

    return ultimaNoticia;
  };

});

controllers.controller('TopCtrl', function($controller, $scope, DescargarNoticiasService, AlertaSinConexion) {
  $controller('NoticiasCtrl', { $scope: $scope });

  $scope.cargar = function() {
    DescargarNoticiasService.top(
      function(noticias) {
        $scope.infiniteScroll = false;
        $scope.postCargar({noticias: noticias});
      },
      function() {
        AlertaSinConexion.mostrar($scope);
      }
    );
  };
});

controllers.controller('NoticiaCtrl', function($scope, $stateParams, $ionicLoading, DescargarNoticiasService, $cordovaSocialSharing, ShareStats) {
  $ionicLoading.show({
    hideOnStateChange: true
  });

  DescargarNoticiasService.noticia($stateParams.id, function(noticia) {
    $scope.noticia = noticia;
    DescargarNoticiasService.relacionadas(noticia, function(noticia) {
      $ionicLoading.hide();
    });
  });

  $scope.compartirNoticia = function(noticia) {
    $cordovaSocialSharing.share(noticia.titulo,
                                noticia.resumen,
                                null,
                                "http://mexicoxport.com" + noticia.url)
      .then(function() {
        ShareStats.registerShareEvent();
        console.log('Exito al compartir');
      }, function(err) {
        console.log('Error al compartir');
        console.log(err);
      });
  };

});
