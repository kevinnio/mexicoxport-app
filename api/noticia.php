<?php

/**
 * Devuelve el contenido de una noticia de mexicoxport.com en formato JSON.
 *
 * @author Kevin Perez <kevindperezm@gmail.com>
 * @copyright Mexicoxport 2015
 */

require_once '../mxport.php';
require_once __DIR__.'/utilidades.php';

extract($_GET);

$campos    = 'idNoticia, Titulo, Resumen, Cuerpo, Imagen, Fuente, Views';
$resultado = query("SELECT $campos FROM noticias WHERE idNoticia = " . sanitizar($idNoticia));

if ($resultado) {
  $noticia = mysqli_fetch_assoc($resultado);
  $views = $noticia["Views"] + 1;
  query("UPDATE noticias SET Views = $views WHERE idNoticia = ". sanitizar($idNoticia));
  enviarRespuesta($noticia);
} else {
  enviarRespuesta(null);
}
