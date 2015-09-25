var directives = angular.module('mexicoxport.directives', []);

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
