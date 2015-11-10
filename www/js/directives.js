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

directives.directive('noticiaSmall', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/common/noticia-small.html'
  };
});

directives.directive('noticiaBig', function() {
  return {
    restrict: 'E',
    scope: {
      noticia: '='
    },
    templateUrl: 'views/common/noticia-big.html'
  };
});

directives.directive('noticiaDetails', function() {
  return {
    restrict: 'E',
    require: '^noticias',
    templateUrl: 'views/common/noticia-details.html'
  };
});

directives.directive('videoSmall', function() {
  return {
    restrict: 'E',
    require: '^tv',
    templateUrl: 'views/common/video-small.html'
  };
});

directives.directive('browseTo', function ($ionicGesture) {
  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      var handleTap = function (e) {
        // todo: capture Google Analytics here
        var inAppBrowser = window.open(encodeURI($attrs.browseTo), '_system');
      };

      var tapGesture = $ionicGesture.on('tap', handleTap, $element);

      $scope.$on('$destroy', function () {
        // Clean up - unbind drag gesture handler
        $ionicGesture.off(tapGesture, 'tap', handleTap);
      });
    }
  }
});
