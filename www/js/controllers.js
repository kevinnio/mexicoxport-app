var controllers = angular.module('mexicoxport.controllers', [])

controllers.controller('AppCtrl', function($scope, $ionicConfig) {});

controllers.controller('NoticiasCtrl', function($scope, $http, $ionicLoading, AlmacenNoticias, DescargarNoticiasService) {
  $scope.noticias = AlmacenNoticias.noticias;

  $scope.refrescar = function() {
    AlmacenNoticias.vaciar();
    $scope.cargarMas();
  };

  $scope.cargarMas = function() {
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

controllers.controller('NoticiaCtrl', function($scope, $stateParams, AlmacenNoticias, $log) {
  $scope.noticia = AlmacenNoticias.buscar($stateParams.noticiaId);
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
