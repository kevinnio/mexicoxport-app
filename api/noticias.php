<?php

/**
 * Devuelve noticias obtenidas de la base de datos de mexicoxport.com en formato JSON.
 * Las noticias se devuelven por páginas y ordenadas de más reciente a más antigua.
 *
 * @param int   $categoria_id  ID de la categoría de la que se quieren ver noticias (default: todas)
 * @param int   $noticia_id    ID de la última noticia de la página anterior
 * @param int   $por_pagina    Cantidad de noticias a devolver en una página (default: 20)
 * @param int   $año           Si esta presente, indica el año del que se desean consultar noticias
 * @param int   $mes           Si esta presente, indica el mes del que se desean consultar noticias
 *
 * @author Kevin Perez <kevindperezm@gmail.com>
 * @copyright Mexicoxport 2015
 */

require_once '../mxport.php';
$conexion = getMyConection();

// Definiendo parámetros
$categoria_id = isset($_GET['categoria_id']) ? mysqli_escape_string($conexion, $_GET['categoria_id']) : null;
$noticia_id   = isset($_GET['noticia_id'])   ? mysqli_escape_string($conexion, $_GET['noticia_id'])   : null;
$por_pagina   = isset($_GET['por_pagina'])   ? mysqli_escape_string($conexion, $_GET['por_pagina'])   : 20;
$año          = isset($_GET['año'])          ? mysqli_escape_string($conexion, $_GET['año'])          : null;
$mes          = isset($_GET['mes'])          ? mysqli_escape_string($conexion, $_GET['mes'])          : null;

// Construyendo consulta a la base de datos
$consulta = 'SELECT * FROM noticias WHERE 1=1 ';
if ($noticia_id)   $consulta .= " AND idNoticia  < $noticia_id";
if ($categoria_id) $consulta .= " AND idTematica = $categoria_id";

$fecha_inicio = null;
if ($año) {
  if ($mes) {
    $fecha_inicio = "$año-$mes-31";
    $mes--;
    $fecha_limite = "$año-$mes-31";
  } else {
    $fecha_inicio = "$año-12-31";
    $año--;
    $fecha_limite = "$año-12-31";
  }
}
if ($fecha_inicio) $consulta .= " AND FechaNoticia <= '$fecha_inicio' AND FechaNoticia > '$fecha_limite'";

$consulta .= ' ORDER BY FechaNoticia DESC';
$consulta .= ' LIMIT ' . mysqli_escape_string($conexion, $por_pagina);

// Obteniendo noticias
$resultados = query($consulta) or die(mysqli_error($conexion));
for ($noticias = array(); $fila = mysqli_fetch_assoc($resultados); $noticias[] = $fila);

$json = json_encode($noticias);
header('Content-Type: application/json');
header('Content-Length: ' . strlen($json));
echo $json;
