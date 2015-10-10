var controllers = angular.module('mexicoxport.controllers', []);

var descargarNoticias = function(scope, loading, noticiasService, ultimaNoticia, cb) {
  loading.show();

  noticiasService.obtenerNoticias(ultimaNoticia, function(noticias) {
    scope.noticias = scope.noticias.concat(noticias);
    if (cb !== null && cb !== undefined) cb(noticias);

    scope.$broadcast('scroll.refreshComplete');
    scope.$broadcast('scroll.infiniteScrollComplete');

    loading.hide();
  });
};

controllers.controller('AppCtrl', function($scope, AlmacenCategorias, DescargarCategoriasService) {
  $scope.categorias = AlmacenCategorias.todas();

  if ($scope.categorias.length <= 0) {
    DescargarCategoriasService.obtenerCategorias(function(categorias) {
      for (var i = 0; i < categorias.length; AlmacenCategorias.agregar(categorias[i++]));
    });
  }
});

controllers.controller('NoticiasCtrl', function($scope, $ionicLoading, DescargarNoticiasService) {
  $scope.noticias = [];

  $scope.refrescar = function() {
    $scope.noticias = [];
    $scope.cargar();
  };

  $scope.cargar = function() {
    var ultimaNoticia;
    if ($scope.noticias.length > 0) {
      ultimaNoticia = $scope.noticias[$scope.noticias.length - 1];
    } else {
      ultimaNoticia = null;
    }

    descargarNoticias($scope, $ionicLoading, DescargarNoticiasService, ultimaNoticia);
  };
});

controllers.controller('NoticiaCtrl', function($scope, $stateParams, $ionicLoading, DescargarNoticiasService) {
  $ionicLoading.show();

  DescargarNoticiasService.obtenerNoticia($stateParams.id, function(noticia) {
    $scope.noticia = noticia;
    $ionicLoading.hide();
  });
});

controllers.controller('CategoriaCtrl', function($scope, $stateParams, $ionicLoading, AlmacenNoticias, DescargarNoticiasService) {
  $scope.categoriaActual = $stateParams.categoriaId;

  var mostrar = function() {
    $scope.noticias = AlmacenNoticias.deCategoria($stateParams.categoriaId);
  };

  if (AlmacenNoticias.noticias.length > 0) {
    mostrar();
  } else {
    descargarNoticias($scope, $ionicLoading, AlmacenNoticias, DescargarNoticiasService, mostrar);
  }
});

controllers.controller('AjustesCtrl', function($scope, $ionicActionSheet, $state) {
  $scope.airplaneMode = true;
  $scope.wifi = false;
  $scope.bluetooth = true;
  $scope.personalHotspot = true;

  $scope.checkOpt1 = true;
  $scope.checkOpt2 = true;
  $scope.checkOpt3 = false;

  $scope.radioChoice = 'B';
});
