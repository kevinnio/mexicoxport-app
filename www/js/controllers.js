var controllers = angular.module('mexicoxport.controllers', []);

controllers.controller('AppCtrl', function($scope, AlmacenCategorias, DescargarCategoriasService) {
  $scope.categorias = AlmacenCategorias.todas();

  if ($scope.categorias.length <= 0) {
    DescargarCategoriasService.obtenerCategorias(function(categorias) {
      for (var i = 0; i < categorias.length; AlmacenCategorias.agregar(categorias[i++]));
    });
  }
});

controllers.controller('NoticiasCtrl', function($scope, $http, $ionicLoading, AlmacenNoticias, DescargarNoticiasService) {
  $scope.noticias = AlmacenNoticias.noticias;

  $scope.refrescar = function() {
    AlmacenNoticias.vaciar();
    $scope.cargar();
  };

  $scope.cargar = function() {
    $ionicLoading.show({
      template: 'Cargando noticias...'
    });

    DescargarNoticiasService.obtenerNoticias(AlmacenNoticias.ultimaNoticia(), function(noticias) {
      AlmacenNoticias.agregar(noticias);

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
});

controllers.controller('NoticiaCtrl', function($scope, $stateParams, $ionicLoading, AlmacenNoticias, DescargarNoticiasService) {
  if (AlmacenNoticias.noticias.length > 0) {
    $scope.noticia = AlmacenNoticias.buscar($stateParams.noticiaId);
  } else {
    $ionicLoading.show();

    DescargarNoticiasService.obtenerNoticias(AlmacenNoticias.ultimaNoticia(), function(noticias) {
      AlmacenNoticias.agregar(noticias);
      $scope.noticia = AlmacenNoticias.buscar($stateParams.noticiaId);

      $ionicLoading.hide();
    });
  }
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
