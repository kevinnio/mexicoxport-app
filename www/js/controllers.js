var controllers = angular.module('mexicoxport.controllers', []);

controllers.controller('AppCtrl', function ($scope, $location, AlmacenCategorias, DescargarCategoriasService) {
  $scope.version = '1.0';
  $scope.categorias = AlmacenCategorias.todas();
  $scope.$location = $location;

  if ($scope.categorias.length <= 0) {
    DescargarCategoriasService.categorias(function (categorias) {
      for (var i = 0; i < categorias.length; AlmacenCategorias.agregar(categorias[i++]));
    });
  }
});

controllers.controller('NoticiasCtrl', function ($scope, DescargarNoticiasService) {
  $scope.noticias = [];
  $scope.infiniteScroll = true;

  $scope.refrescar = function () {
    $scope.noticias = [];
    $scope.cargar();
  };

  $scope.cargar = function () {
    DescargarNoticiasService.recientes($scope.noticias.length, null, function (noticias) {
      $scope.postCargar(noticias);
    });
  };

  $scope.postCargar = function (noticias) {
    $scope.noticias = $scope.noticias.concat(noticias);
    $scope.$broadcast('scroll.refreshComplete');
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  $scope.obtenerUltimaNoticia = function () {
    var ultimaNoticia;

    if ($scope.noticias.length > 0) {
      ultimaNoticia = $scope.noticias[$scope.noticias.length - 1];
    } else {
      ultimaNoticia = null;
    }

    return ultimaNoticia;
  };

});

controllers.controller('NoticiaCtrl', function ($scope, $stateParams, $ionicLoading, $cordovaSocialSharing, DescargarNoticiasService) {
  $ionicLoading.show({
    hideOnStateChange: true
  });

  DescargarNoticiasService.noticia($stateParams.id, function (noticia) {
    $scope.noticia = noticia;
    $ionicLoading.hide();
  });

  $scope.compartirNoticia = function(noticia) {
    $cordovaSocialSharing.share(noticia.titulo,
                                noticia.resumen,
                                null,
                                "http://mexicoxport.com" + noticia.url)
      .then(function(result) {
        console.log('Exito al compartir');
      }, function(err) {
        console.log('Error al compartir');
        console.log(err);
      });
  };
});

controllers.controller('CategoriaCtrl', function ($controller, $scope, $stateParams, DescargarNoticiasService) {
  $controller('NoticiasCtrl', {$scope: $scope});

  $scope.cargar = function () {
    var categoriaId = $stateParams.id;
    DescargarNoticiasService.recientes($scope.noticias.length, categoriaId, function (noticias) {
      $scope.postCargar(noticias);
    });
  };
});

controllers.controller('TopCtrl', function ($controller, $scope, $ionicLoading, DescargarNoticiasService) {
  $controller('NoticiasCtrl', {$scope: $scope});

  $scope.infiniteScroll = false;

  $scope.cargar = function () {
    $ionicLoading.show({
      hideOnStateChange: true
    });

    DescargarNoticiasService.top(function (noticias) {
      $scope.postCargar(noticias);
      $ionicLoading.hide();
    });
  };

  $scope.cargar();
});

controllers.controller('TvCtrl', function ($scope, TvService) {
  $scope.videos = [];
  $scope.service = TvService;

  $scope.nextPage = function () {
    $scope.service.nextPage(function (videos) {
      $scope.videos = $scope.videos.concat(videos);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.refresh = function () {
    $scope.videos = [];
    $scope.service.reset();
    $scope.nextPage();
  };

  $scope.canLoad = function () {
    return $scope.videos.length <= 0 ||
      $scope.videos.length < $scope.service.getTotal();
  };
});
