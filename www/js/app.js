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

app.run(function($ionicPlatform, PushNotificationsService, amMoment, $ionicPopup) {
  amMoment.changeLocale('es');

  $ionicPlatform.on("deviceready", function() {
    revisarConexionDeInternet($ionicPopup);
    registrarOnDeviceReadyCallback(PushNotificationsService);
  });

});

function revisarConexionDeInternet($ionicPopup) {
  /* Esto siempre devuelve TRUE en un navegador web */
  if (window.Connection && navigator.connection.type != Connection.NONE) return;

  $ionicPopup.confirm({
    title: "No hay conexión a Internet",
    content: "Esta aplicación requiere una conexión a Internet activa en tu dispositivo."
  }).then(function(result) {
    result || ionic.Platform.exitApp();
  });
}

function registrarOnDeviceReadyCallback(PushNotificationsService) {
  PushNotificationsService.register();
}

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'AppCtrl'
  })

  .state('app.noticias', {
    url: "/noticias",
    views: {
      'menuContent': {
        templateUrl: "views/app/noticias/index.html",
        controller: 'NoticiasCtrl'
      }
    }
  })

  .state('app.categorias', {
    url: "/categorias/:id",
    views: {
      'menuContent': {
        templateUrl: "views/app/noticias/index.html",
        controller: 'CategoriaCtrl'
      }
    }
  })

  .state('app.noticia', {
    url: '/noticias/:id',
    views: {
      menuContent: {
        templateUrl: 'views/app/noticias/show.html',
        controller: 'NoticiaCtrl'
      }
    }
  })

  .state('app.top', {
    url: '/noticias/top',
    views: {
      menuContent: {
        templateUrl: 'views/app/noticias/index.html',
        controller: 'TopCtrl'
      }
    }
  })

;

  $urlRouterProvider.otherwise('/app/noticias');
});
