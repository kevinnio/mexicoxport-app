<?php
/**
 * Devuelve servicios obtenidos de la base de datos de mexicoxport.com en formato JSON.
 * Los servicios se devuelven por páginas y ordenadas de más reciente a más antigua.
 *
 * @param int     $ultima         Última fila recibida (default: 0)
 * @param int     $por_pagina     Cantidad de servicios a devolver en una página (default: 20)
 * @param string  $buscar         Texto para buscar en el título, resumen y cuerpo de las servicios
 * @param int     $tipo_asistente Tipo de asistente asociado al servicio (cuando aplica)
 * @param boolean $activo         Estado de activación de los servicios devueltos
 *
 * @author Kevin Perez <kevindperezm@gmail.com>
 * @copyright Mexicoxport 2015
 */

require_once __DIR__ . '/../utilidades.php';

function obtener_servicios_en_json() {
  $parametros = obtener_parametros_de_peticion();
  $consulta   = construir_consulta_para_servicios($parametros, null);
  $servicios  = renombrar_campos(obtener_servicios_de_la_bd($consulta), campos_de_servicios());

  enviarRespuesta(generar_respuesta($servicios, $parametros));
}

function campos_de_servicios() {
  return array(
    'id'             => 'idServicio',
    'codigo'         => 'Codigo',
    'nombre'         => 'Servicio',
    'descripcion'    => 'Descripcion',
    'precio'         => 'Precio',
    'activo'         => 'Activo',
    'full_access'    => 'FullAccess',
    'tipo_asistente' => 'idTipoAsistente',
  );
}

function generar_respuesta($servicios, $parametros) {
  if ($parametros['v'] == '2') {
    $respuesta = array();
    $respuesta['servicios'] = $servicios;
    $respuesta['total'] = obtener_total_de_servicios($parametros);
  } else {
    $respuesta = $servicios;
  }

  return $respuesta;
}

function obtener_total_de_servicios($parametros) {
  $consulta = construir_consulta_para_servicios($parametros, 'count(*)');
  $resultados = query($consulta);
  $fila = mysqli_fetch_array($resultados, MYSQLI_NUM);

  return $fila[0];
}

function obtener_parametros_de_peticion() {
  $parametros_por_defecto = array('por_pagina' => 20,
                                  'ultima'     => 0);
  $parametros = array_map(function($parametro) { return sanitizar($parametro); }, $_GET);

  return array_merge($parametros_por_defecto, $parametros);
}

function construir_consulta_para_servicios($parametros, $campos) {
  extract($parametros);

  if (is_null($campos)) $campos = implode(', ', array_values(campos_de_servicios()));
  $consulta = "SELECT $campos FROM servicios WHERE 1=1 ";
  if (isset($buscar)) $consulta .= " AND Nombre LIKE '%$buscar%' ";
  if (isset($activo)) $consulta .= " AND Activo = $activo ";
  if (isset($tipo_asistente)) $consulta .= " AND idTipoAsistente = $tipo_asistente ";
  $consulta .= ' ORDER BY idServicio ASC';
  $consulta .= generar_limite($parametros['ultima'], $parametros['por_pagina']);
  
  return $consulta;
}

function obtener_servicios_de_la_bd($consulta) {
  $resultados = query($consulta);

  if ($error = mysqli_error(getMyConection())) {
    enviarRespuesta((object)['exito'       => false,
                             'error_debug' => $error]);
    die();
  }

  for ($servicios = array(); $fila = mysqli_fetch_assoc($resultados); $servicios[] = $fila);

  return $servicios;
}

function generar_limite($ultima_fila, $por_pagina) {
  if ($ultima_fila <= 0) {
    return " LIMIT $por_pagina";
  } else {
    return " LIMIT $ultima_fila, $por_pagina";
  }
}

obtener_servicios_en_json();
