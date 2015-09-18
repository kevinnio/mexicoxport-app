angular.module('mexicoxport.controllers', [])

.controller('AppCtrl', function($scope, $ionicConfig) {

})

.controller('NoticiasCtrl', function($scope, $http, $ionicLoading) {
  $scope.noticias = [];

  $scope.refrescar = function() {
    $ionicLoading.show({
      template: 'Cargando noticias...'
    });

    $http.get('http://mexicoxport.com/api/noticias.php').success(function(response) {
      $scope.noticias = response;

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.refrescar();
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
