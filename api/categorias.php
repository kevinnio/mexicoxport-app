<?php

/**
 * Devuelve las categorías de noticias de mexicoxport.com en formato JSON.
 *
 * @author Kevin Perez <kevindperezm@gmail.com>
 * @copyright Mexicoxport 2015
 */

require_once '../mxport.php';
require_once __DIR__.'/utilidades.php';

$resultados = query('SELECT * FROM nw_tematica ORDER BY Nombre, Tag');

for ($categorias = array(); $fila = mysqli_fetch_assoc($resultados);) {
  $categorias[] = $fila;
}

$json = json_encode(utf8_encode_all($categorias));
header('Content-Type: application/json');
header('Content-Length: ' . strlen($json));
echo $json;
