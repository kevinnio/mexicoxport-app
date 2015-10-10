var factories = angular.module('mexicoxport.factories', []);

factories.factory('NodePushServer', function ($http) {
  // Configure push notifications server address
  // 		- If you are running a local push notifications server you can test this by setting the local IP (on mac run: ipconfig getifaddr en1)
  var push_server_address = "http://192.168.1.102:8000";

  return {
    // Stores the device token in a db using node-pushserver
    // type:  Platform type (ios, android etc)
    storeDeviceToken: function(type, regId) {
      // Create a random userid to store with it
      var user = {
        user: 'user' + Math.floor((Math.random() * 10000000) + 1),
        type: type,
        token: regId
      };
      console.log("Post token for registered device with data " + JSON.stringify(user));

      $http.post(push_server_address+'/subscribe', JSON.stringify(user))
      .success(function (data, status) {
        console.log("Token stored, device is successfully subscribed to receive push notifications.");
      })
      .error(function (data, status) {
        console.log("Error storing device token." + data + " " + status);
      });
    },
    // CURRENTLY NOT USED!
    // Removes the device token from the db via node-pushserver API unsubscribe (running locally in this case).
    // If you registered the same device with different userids, *ALL* will be removed. (It's recommended to register each
    // time the app opens which this currently does. However in many cases you will always receive the same device token as
    // previously so multiple userids will be created with the same token unless you add code to check).
    removeDeviceToken: function(token) {
      var tkn = {"token": token};
      $http.post(push_server_address+'/unsubscribe', JSON.stringify(tkn))
      .success(function (data, status) {
        console.log("Token removed, device is successfully unsubscribed and will not receive push notifications.");
      })
      .error(function (data, status) {
        console.log("Error removing device token." + data + " " + status);
      });
    }
  };
});

factories.factory('AlmacenNoticias', function() {
  return {
    noticias: [],

    buscar: function(id) {
      for (var i = 0; i < this.noticias.length; i++) {
        if (this.noticias[i].id == id) return this.noticias[i];
      }

      return null;
    },

    agregar: function(noticias) {
      if (noticias.constructor === Array) {
        for (var i = 0; i < noticias.length; this.noticias.push(noticias[i++]));
      } else {
        this.noticias.push(noticias);
      }
    },

    ultimaNoticia: function() {
      return this.noticias[this.noticias.length - 1];
    },

    vaciar: function() {
      delete this.noticias;
      this.noticias = [];
    },

    deCategoria: function(categoriaId) {
      var noticias = [];

      for (var i = 0; i < this.noticias.length; i++) {
        if (this.noticias[i].id == categoriaId) noticias.push(this.noticias[i]);
      }

      return noticias;
    }
  };
});

factories.factory('AlmacenCategorias', function() {
  var categorias = [];

  return {
    todas: function() {
      return categorias;
    },

    agregar: function(categoria) {
      categorias.push(categoria);
    },

    buscar: function(id) {
      for (var i = 0; i < categorias.length; i++) {
        if (categorias[i].id == id) return categorias[i];
      }
    }
  };
});
