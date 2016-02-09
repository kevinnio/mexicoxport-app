<?php
/**
 * Devuelve noticias relacionadas de la base de datos de mexicoxport.com en formato JSON.
 * Las noticias se devuelven por páginas y ordenadas de más reciente a más antigua.
 *
 * @param int    $cantidad Cantidad de noticias relacionadas
 * @param string $keywords Palabras clave a partir de las cuales encontrar noticias relacionadas
 *
 * @author Kevin Perez <kevindperezm@gmail.com>
 * @copyright Mexicoxport 2015
 */

require_once __DIR__ . '/../utilidades.php';

function obtener_noticias_en_json() {
  $parametros = obtener_parametros_de_peticion();
  $consulta   = construir_consulta_para_noticias($parametros, null);
  $noticias   = renombrar_campos(obtener_noticias_de_la_bd($consulta), campos_de_noticias());

  foreach ($noticias as &$noticia) {
    $imagen_nombre = basename($noticia['imagen']);
    $dir_imagen = trim(str_replace($imagen_nombre, '', $noticia['imagen']), '/');
    $noticia['miniatura'] = "$dir_imagen/mcith/mcith_$imagen_nombre";
  }

  enviarRespuesta(generar_respuesta($noticias, $parametros));
}

function generar_respuesta($noticias, $parametros) {
  if ($parametros['v'] == '2') {
    $respuesta = array();
    $respuesta['noticias'] = $noticias;
    $respuesta['total'] = obtener_total_de_noticias($parametros);
  } else {
    $respuesta = $noticias;
  }

  return $respuesta;
}

function obtener_total_de_noticias($parametros) {
  $consulta = construir_consulta_para_noticias($parametros, 'count(*)');
  $resultados = query($consulta);
  $fila = mysqli_fetch_array($resultados, MYSQLI_NUM);

  return $fila[0];
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
  $parametros_por_defecto = array('por_pagina' => 20,
                                  'ultima'     => 0);
  $parametros = array_map(function($parametro) { return sanitizar($parametro); }, $_GET);

  return array_merge($parametros_por_defecto, $parametros);
}

function construir_consulta_para_noticias($parametros, $campos) {
  if (is_null($campos)) $campos = implode(', ', array_values(campos_de_noticias()));
  $consulta = "SELECT $campos FROM noticias WHERE Titulo LIKE '%";

  $keywords = explode(',', $parametros['keywords']);
  $keywords = array_map('sanitizar', $keywords);
  $consulta.= implode("%' OR Titulo LIKE '%", $keywords);
  $consulta.= "%' ORDER BY idNoticia DESC LIMIT 1,{$parametros['cantidad']}";

  return $consulta;
}

function obtener_noticias_de_la_bd($consulta) {
  $resultados = query($consulta);
  for ($noticias = array(); $fila = mysqli_fetch_assoc($resultados); $noticias[] = $fila);

  return $noticias;
}

function generar_restriccion_de_fecha($parametros) {
  if (isset($parametros['año'])) {
    if (isset($parametros['mes'])) {
      $fecha_inicio = $parametros['año'] . '-' . $parametros['mes']-- . '-31';
      $fecha_limite = $parametros['año'] . '-' . $parametros['mes']   . '-31';
    } else {
      $fecha_inicio = $parametros['año']-- . '-12-31';
      $fecha_limite = $parametros['año']   . '-12-31';
    }
  }

  $sql = '';
  if (isset($fecha_inicio)) {
    $sql = " AND FechaNoticia <= '$fecha_inicio' AND FechaNoticia > '$fecha_limite'";
  }

  return $sql;
}

function generar_limite($ultima_fila, $por_pagina) {
  if ($ultima_fila <= 0) {
    return " LIMIT $por_pagina";
  } else {
    return " LIMIT $ultima_fila, $por_pagina";
  }
}

obtener_noticias_en_json();
