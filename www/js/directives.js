var directives = angular.module('mexicoxport.directives', []);

directives.directive('preImg', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      ratio:'@',
      helperClass: '@'
    },

    controller: function($scope) {
      $scope.loaded = false;

      this.hideSpinner = function() {
        $scope.$apply(function () { $scope.loaded = true; });
      };
    },

    templateUrl: 'views/common/pre-img.html'
  };
});


directives.directive('spinnerOnLoad', function() {
  return {
    restrict: 'A',
    require: '^preImg',
    scope: {
      ngSrc: '@'
    },
    link: function(scope, element, attr, preImgController) {
      element.on('load', function() {
        preImgController.hideSpinner();
      });
    }
  };
});
