var controllers = angular.module('mexicoxport.controllers', []);

var descargarNoticias = function(scope, loading, almacen, noticiasService, cb) {
  loading.show();

  noticiasService.obtenerNoticias(almacen.ultimaNoticia(), function(noticias) {
    almacen.agregar(noticias);
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

controllers.controller('NoticiasCtrl', function(scope, loading, almacen, noticiasService) {
  scope.noticias = almacen.noticias;

  scope.refrescar = function() {
    almacen.vaciar();
    scope.cargar();
  };

  scope.cargar = function() {
    descargarNoticias(scope, loading, almacen, noticiasService);
  };
});

controllers.controller('NoticiaCtrl', function($scope, $stateParams, $ionicLoading, AlmacenNoticias, DescargarNoticiasService) {
  var mostrar = function() {
    $scope.noticia = AlmacenNoticias.buscar($stateParams.noticiaId);
  }

  if (AlmacenNoticias.noticias.length > 0) {
    mostrar();
  } else {
    descargarNoticias($scope, $ionicLoading, AlmacenNoticias, DescargarNoticiasService, mostrar);
  }
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
