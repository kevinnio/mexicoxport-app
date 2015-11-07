angular.module('underscore', []).factory('_', function() {
  return window._;
});

var app = angular.module('mexicoxport', [
  'ionic',
  'angularMoment',
  'mexicoxport.controllers',
  'mexicoxport.directives',
  'mexicoxport.filters',
  'mexicoxport.services',
  'mexicoxport.factories',
  'mexicoxport.config',
  'mexicoxport.views',
	'ngCordova'
]);

app.run(function($ionicPlatform, PushNotificationsService, amMoment, $ionicPopup, GOOGLE_API_KEY, $log) {
  amMoment.changeLocale('es');

  var setupCallback = function() {
    registrarOnDeviceReadyCallback(PushNotificationsService);

    gapi.client.setApiKey(GOOGLE_API_KEY);
    gapi.client.load('youtube-data', 'v3').then(function() {
      $log.debug('Youtube Data API cargada.');
    })
  };

  $ionicPlatform.ready(setupCallback);
  $ionicPlatform.on("deviceready", setupCallback);
});

function registrarOnDeviceReadyCallback(PushNotificationsService) {
  PushNotificationsService.register();
}

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider.state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'AppCtrl'
  });

  $stateProvider.state('app.noticias', {
    url: "/noticias",
    views: {
      'menuContent': {
        templateUrl: "views/app/noticias/index.html",
        controller: 'NoticiasCtrl'
      }
    }
  });

  $stateProvider.state('app.categorias', {
    url: "/categorias/:id",
    views: {
      'menuContent': {
        templateUrl: "views/app/noticias/index.html",
        controller: 'CategoriaCtrl'
      }
    }
  });

  $stateProvider.state('app.noticia', {
    url: '/noticias/:id',
    views: {
      menuContent: {
        templateUrl: 'views/app/noticias/show.html',
        controller: 'NoticiaCtrl'
      }
    }
  });

  $stateProvider.state('app.top', {
    url: '/noticias/top',
    views: {
      menuContent: {
        templateUrl: 'views/app/noticias/index.html',
        controller: 'TopCtrl'
      }
    }
  });

  $stateProvider.state('app.about', {
    url: '/about',
    views: {
      menuContent: {
        templateUrl: 'views/app/about.html'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/noticias');

  $ionicConfigProvider.backButton.text('Atrás');
});
