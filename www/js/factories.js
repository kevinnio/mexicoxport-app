angular.module('mexicoxport.factories', [])

.factory('AlmacenNoticias', function() {
    return {
      noticias: [],

      buscar: function(id) {
        for (var i = 0; i < this.noticias.length; i++) {
          if (this.noticias[i].idNoticia == id) return this.noticias[i];
        }
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
      }
    };
})

;
