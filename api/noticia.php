<?php

/**
 * Devuelve el contenido de una noticia de mexicoxport.com en formato JSON.
 *
 * @author Kevin Perez <kevindperezm@gmail.com>
 * @copyright Mexicoxport 2015
 */

require_once '../mxport.php';
require_once __DIR__.'/utilidades.php';

$campos_de_noticias = array(
  'id'      => 'idNoticia',
  'titulo'  => 'Titulo',
  'resumen' => 'Resumen',
  'cuerpo'  => 'Cuerpo',
  'imagen'  => 'Imagen',
  'fuente'  => 'Fuente',
  'fecha'   => 'FechaNoticia',
  'vistas'  => 'Views',
);

extract($_GET);

$campos    = implode(', ', array_values($campos_de_noticias));
$resultado = query("SELECT $campos FROM noticias WHERE idNoticia = " . sanitizar($noticia_id));

if ($resultado) {
  $noticia = renombrar_campos(array(mysqli_fetch_assoc($resultado)), $campos_de_noticias);
  $noticia = $noticia[0];
  $views = $noticia["Views"] + 1;
  query("UPDATE noticias SET Views = $views WHERE idNoticia = ". sanitizar($idNoticia));
  enviarRespuesta($noticia);
} else {
  enviarRespuesta(null);
}
