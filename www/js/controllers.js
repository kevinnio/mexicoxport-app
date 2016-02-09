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

controllers.controller('NoticiasCtrl', function($scope, DescargarNoticiasService, $ionicLoading) {
  $scope.noticias = [];
  $scope.total = 0;
  $scope.infiniteScroll = true;
  $scope.busqueda = {
    mostrar: false
  };

  $scope.refrescar = function() {
    $scope.noticias = [];
    $scope.cargar();
  };

  $scope.cargar = function(callback) {
    DescargarNoticiasService.recientes($scope.noticias.length, null, $scope.busqueda.keywords, function(respuesta) {
      $scope.postCargar(respuesta);
      if (callback) callback();
    });
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

controllers.controller('CategoriaCtrl', function($controller, $scope, $stateParams, DescargarNoticiasService) {
  $controller('NoticiasCtrl', { $scope: $scope });

  $scope.cargar = function(callback) {
    var categoriaId = $stateParams.id;
    DescargarNoticiasService.recientes($scope.noticias.length, categoriaId, $scope.busqueda.keywords, function(noticias) {
      $scope.postCargar(noticias);
      if (callback) callback();
    });
  };
});

controllers.controller('TopCtrl', function($controller, $scope, $ionicLoading, DescargarNoticiasService) {
  $controller('NoticiasCtrl', { $scope: $scope });

  $scope.infiniteScroll = false;

  $scope.cargar = function() {
    $ionicLoading.show({ hideOnStateChange: true });

    DescargarNoticiasService.top(function(noticias) {
      $scope.postCargar({noticias: noticias});
      $ionicLoading.hide();
    });
  };

  $scope.cargar();
});

controllers.controller('TvCtrl', function($scope, TvService) {
  $scope.videos = [];
  $scope.service = TvService;

  $scope.nextPage = function() {
    $scope.service.nextPage(function(videos) {
      $scope.videos = $scope.videos.concat(videos);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.refresh = function() {
    $scope.videos = [];
    $scope.service.reset();
    $scope.nextPage();
  };

  $scope.canLoad = function() {
    return $scope.videos.length <= 0 ||
           $scope.videos.length < $scope.service.getTotal();
  };
});
