var controllers = angular.module('mexicoxport.controllers', []);

controllers.controller('AppCtrl', function($scope, AlmacenCategorias, DescargarCategoriasService) {
  $scope.categorias = AlmacenCategorias.todas();

  if ($scope.categorias.length <= 0) {
    DescargarCategoriasService.obtenerCategorias(function(categorias) {
      for (var i = 0; i < categorias.length; AlmacenCategorias.agregar(categorias[i++]));
    });
  }
});

controllers.controller('NoticiasCtrl', function($scope, $ionicLoading, DescargarNoticiasService) {
  $scope.noticias = [];

  $scope.refrescar = function() {
    $scope.noticias = [];
    $scope.cargar();
  };

  $scope.cargar = function() {
    var ultimaNoticia = $scope.obtenerUltimaNoticia();
    DescargarNoticiasService.obtenerNoticias(ultimaNoticia, null, function(noticias) {
      $scope.noticias = $scope.noticias.concat(noticias);
      $scope.$broadcast('scroll.infiniteScrollComplete');
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

controllers.controller('NoticiaCtrl', function($scope, $stateParams, $ionicLoading, DescargarNoticiasService) {
  $ionicLoading.show();

  DescargarNoticiasService.obtenerNoticia($stateParams.id, function(noticia) {
    $scope.noticia = noticia;
    $ionicLoading.hide();
  });
});

controllers.controller('CategoriaCtrl', function($controller, $scope, $stateParams, AlmacenCategorias, DescargarNoticiasService) {
  $controller('NoticiasCtrl', {$scope: $scope});

  $scope.categoria = AlmacenCategorias.buscar($stateParams.id);

  $scope.cargar = function() {
    var ultimaNoticia = $scope.obtenerUltimaNoticia();

    DescargarNoticiasService.obtenerNoticias(ultimaNoticia, $stateParams.id, function(noticias) {
      $scope.noticias = $scope.noticias.concat(noticias);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
});

controllers.controller('AjustesCtrl', function($scope, $ionicActionSheet, $state) {
  $scope.airplaneMode = true;
  $scope.wifi = false;
  $scope.bluetooth = true;
  $scope.personalHotspot = true;

  $scope.checkOpt1 = true;
  $scope.checkOpt2 = true;
  $scope.checkOpt3 = false;

  $scope.radioChoice = 'B';
});
