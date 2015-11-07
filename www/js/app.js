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

app.run(function($ionicPlatform, $ionicPush, amMoment, $ionicUser) {
  amMoment.changeLocale('es');

  $ionicPlatform.ready(function() {
    var user = $ionicUser.current();
    if ( ! user.id) {
      user.id = $ionicUser.anonymousId();
    }
    registrarOnDeviceReadyCallback($ionicPush, $ionicUser);
  });

});

function registrarOnDeviceReadyCallback($ionicPush, $ionicUser) {
  $ionicPush.init({
    debug: true,
    onNotification: function (notification) {
      alert('Push received!');
    },
    onRegister: function (data) {
      var user = $ionicUser.current();
      user.addPushToken(data.token);
      user.save();
      console.log(user.id);
    }
  });

  $ionicPush.register();
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
