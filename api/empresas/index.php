<?php
/**
 * Devuelve empresas obtenidas de la base de datos de mexicoxport.com en formato JSON.
 * Las empresas se devuelven por páginas y ordenadas de más reciente a más antigua.
 *
 * @param int    $ultima        Última fila recibida (default: 0)
 * @param int    $por_pagina    Cantidad de empresas a devolver en una página (default: 20)
 * @param int    $categoria_id  ID de la categoría de la que se quieren ver empresas (default: todas)
 * @param int    $año           Si esta presente, indica el año del que se desean consultar empresas
 * @param int    $mes           Si esta presente, indica el mes del que se desean consultar empresas
 * @param string $buscar        Texto para buscar en el título, resumen y cuerpo de las empresas
 *
 * @author Kevin Perez <kevindperezm@gmail.com>
 * @copyright Mexicoxport 2015
 */

require_once __DIR__ . '/../utilidades.php';

function obtener_empresas_en_json() {
  $parametros = obtener_parametros_de_peticion();
  $consulta   = construir_consulta_para_empresas($parametros, null);
  $empresas   = renombrar_campos(obtener_empresas_de_la_bd($consulta), campos_de_empresas());

  enviarRespuesta(generar_respuesta($empresas, $parametros));
}

function campos_de_empresas() {
  return array(
    'id'           => 'idEmpresa',
    'razon_social' => 'RazonSocial',
  );
}

function generar_respuesta($empresas, $parametros) {
  if ($parametros['v'] == '2') {
    $respuesta = array();
    $respuesta['empresas'] = $empresas;
    $respuesta['total'] = obtener_total_de_empresas($parametros);
  } else {
    $respuesta = $empresas;
  }

  return $respuesta;
}

function obtener_total_de_empresas($parametros) {
  $consulta = construir_consulta_para_empresas($parametros, 'count(*)');
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

function construir_consulta_para_empresas($parametros, $campos) {
  extract($parametros);

  if (is_null($campos)) $campos = implode(', ', array_values(campos_de_empresas()));
  $consulta = "SELECT $campos FROM empresas WHERE 1=1 ";
  if (isset($buscar)) $consulta .= " AND RazonSocial LIKE '%$buscar%' ";
  $consulta .= ' ORDER BY idEmpresa ASC';
  $consulta .= generar_limite($parametros['ultima'], $parametros['por_pagina']);

  return $consulta;
}

function obtener_empresas_de_la_bd($consulta) {
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

obtener_empresas_en_json();
