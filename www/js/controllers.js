angular.module('mexicoxport.controllers', [])

.controller('AppCtrl', function($scope, $ionicConfig) {

})

.controller('NoticiasCtrl', function($scope, $http, $ionicLoading) {
  $scope.noticias = [];

  $scope.cargarMas = function() {
    $ionicLoading.show({
      template: 'Cargando noticias...'
    });

    var url = 'http://mexicoxport.com/api/noticias.php';
    var ultimaNoticia = $scope.noticias[$scope.noticias.length - 1];
    if (ultimaNoticia) url += '?noticia_id=' + ultimaNoticia.idNoticia;

    $http.get(url).success(function(noticias) {
      $scope.noticias = $scope.noticias.concat(noticias);

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
