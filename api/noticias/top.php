<?php

/**
 * Devuelve las noticias más vistas en la última semana de mexicoxport.com en formato JSON.
 * Las noticias se devuelven por páginas y ordenadas de más vista a menos vista.
 *
 * @param int $por_pagina Cantidad de noticias a mostrar. Por defecto es 20.
 *
 * @author Kevin Perez <kevindperezm@gmail.com>
 * @copyright Mexicoxport 2015
 */

require_once __DIR__ . '/../utilidades.php';

function obtener_noticias_en_json() {
  $parametros = obtener_parametros_de_peticion();
  $consulta   = construir_consulta_para_noticias($parametros);
  $noticias   = renombrar_campos(obtener_noticias_de_la_bd($consulta), campos_de_noticias());

  foreach ($noticias as &$noticia) {
    $imagen_nombre = basename($noticia['imagen']);
    $dir_imagen = trim(str_replace($imagen_nombre, '', $noticia['imagen']), '/');
    $noticia['miniatura'] = "$dir_imagen/mcith/mcith_$imagen_nombre";
  }

  enviarRespuesta($noticias);
}

function campos_de_noticias() {
  return array('id'      => 'idNoticia',
               'titulo'  => 'Titulo',
               'imagen'  => 'Imagen',
               'fecha'   => 'FechaNoticia',
               'hora'    => 'time(FechaAlta)',
               'vistas'  => 'Views');
}

function obtener_parametros_de_peticion() {
  $parametros_por_defecto = array('por_pagina' => 20);
  $parametros = array_map(function($parametro) { return sanitizar($parametro); }, $_GET);

  return array_merge($parametros_por_defecto, $parametros);
}

function construir_consulta_para_noticias($parametros) {
  $campos = implode(', ', array_values(campos_de_noticias()));
  $consulta  = "SELECT $campos FROM noticias WHERE 1=1 ";
  $consulta .= generar_restriccion_de_fecha();
  $consulta .= ' ORDER BY Views DESC, FechaNoticia DESC, time(FechaAlta) DESC, idNoticia DESC';
  $consulta .= ' LIMIT '.$parametros['por_pagina'];

  return $consulta;
}

function obtener_noticias_de_la_bd($consulta) {
  $resultados = query($consulta);
  for ($noticias = array(); $fila = mysqli_fetch_assoc($resultados); $noticias[] = $fila);

  return $noticias;
}

function generar_restriccion_de_fecha() {
  return 'AND FechaNoticia > (NOW() - INTERVAL 7 DAY)';
}

obtener_noticias_en_json();
