angular.module('underscore', []).factory('_', function() {
  return window._;
});

var app = angular.module('mexicoxport', [
  'ionic',
  'ionic.service.core',
  'ionic.service.push',
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

app.run(function($ionicPlatform, $ionicPush, amMoment, $ionicPopup) {
  amMoment.changeLocale('es');

  $ionicPlatform.ready(function() {
    revisarConexionDeInternet($ionicPopup);
    registrarOnDeviceReadyCallback($ionicPush);
  });

});

function revisarConexionDeInternet($ionicPopup) {
  /* Esto siempre devuelve TRUE en un navegador web */
  if (window.Connection && navigator.connection.type != Connection.NONE) return;

  $ionicPopup.confirm({
    title: "No hay conexión a Internet",
    content: "Esta aplicación requiere una conexión a Internet activa en tu dispositivo."
  }).then(function() {
    ionic.Platform.exitApp();
  });
}

function registrarOnDeviceReadyCallback(pushService) {
  pushService.init({
    debug: true,
    onNotification: function (notification) {
      var payload = notification.payload;
      console.log(notification, payload);
    },
    onRegister: function (data) {
      console.log(data.token);
    }
  });

  pushService.register();
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
