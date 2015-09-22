angular.module('mexicoxport.controllers', [])

.controller('AppCtrl', function($scope, $ionicConfig) {

})

.controller('NoticiasCtrl', function($scope, $http, $ionicLoading, AlmacenNoticias) {
  $scope.noticias = AlmacenNoticias.noticias;

  $scope.cargarMas = function() {
    $ionicLoading.show({
      template: 'Cargando noticias...'
    });

    var url = 'http://mexicoxport.com/api/noticias.php';
    var ultimaNoticia = AlmacenNoticias.ultimaNoticia();
    if (ultimaNoticia != undefined) url += '?noticia_id=' + ultimaNoticia.idNoticia;

    $http.get(url).success(function(noticias) {
      AlmacenNoticias.agregar(noticias);

      $ionicLoading.hide();
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
})

.controller('AjustesCtrl', function($scope, $ionicActionSheet, $state) {
  $scope.airplaneMode = true;
  $scope.wifi = false;
  $scope.bluetooth = true;
  $scope.personalHotspot = true;

  $scope.checkOpt1 = true;
  $scope.checkOpt2 = true;
  $scope.checkOpt3 = false;

  $scope.radioChoice = 'B';
})

;
