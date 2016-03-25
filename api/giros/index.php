<?php
/**
 * Devuelve giros obtenidas de la base de datos de mexicoxport.com en formato JSON.
 * Los giros se devuelven por páginas y ordenadas de más reciente a más antigua.
 *
 * @param int    $ultima        Última fila recibida (default: 0)
 * @param int    $por_pagina    Cantidad de giros a devolver en una página (default: 20)
 * @param int    $categoria_id  ID de la categoría de la que se quieren ver giros (default: todas)
 * @param int    $año           Si esta presente, indica el año del que se desean consultar giros
 * @param int    $mes           Si esta presente, indica el mes del que se desean consultar giros
 * @param string $buscar        Texto para buscar en el título, resumen y cuerpo de las giros
 *
 * @author Kevin Perez <kevindperezm@gmail.com>
 * @copyright Mexicoxport 2015
 */

require_once __DIR__ . '/../utilidades.php';

function obtener_giros_en_json() {
  $parametros = obtener_parametros_de_peticion();
  $consulta   = construir_consulta_para_giros($parametros, null);
  $giros      = renombrar_campos(obtener_giros_de_la_bd($consulta), campos_de_giros());

  enviarRespuesta(generar_respuesta($giros, $parametros));
}

function campos_de_giros() {
  return array(
    'id'     => 'idTipoEmpresa',
    'nombre' => 'TipoEmpresa',
  );
}

function generar_respuesta($giros, $parametros) {
  if ($parametros['v'] == '2') {
    $respuesta = array();
    $respuesta['giros'] = $giros;
    $respuesta['total'] = obtener_total_de_giros($parametros);
  } else {
    $respuesta = $giros;
  }

  return $respuesta;
}

function obtener_total_de_giros($parametros) {
  $consulta = construir_consulta_para_giros($parametros, 'count(*)');
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

function construir_consulta_para_giros($parametros, $campos) {
  extract($parametros);

  if (is_null($campos)) $campos = implode(', ', array_values(campos_de_giros()));
  $consulta = "SELECT $campos FROM cat_Tipos_Empresas WHERE 1=1 ";
  if (isset($buscar)) $consulta .= " AND TipoEmpresa LIKE '%$buscar%' ";
  $consulta .= ' ORDER BY idTipoEmpresa ASC';
  $consulta .= generar_limite($parametros['ultima'], $parametros['por_pagina']);
  return $consulta;
}

function obtener_giros_de_la_bd($consulta) {
  $resultados = query($consulta);
  for ($noticias = array(); $fila = mysqli_fetch_assoc($resultados); $noticias[] = $fila);

  return $noticias;
}

function generar_limite($ultima_fila, $por_pagina) {
  if ($ultima_fila <= 0) {
    return " LIMIT $por_pagina";
  } else {
    return " LIMIT $ultima_fila, $por_pagina";
  }
}

obtener_giros_en_json();
