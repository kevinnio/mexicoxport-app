<?php

/**
 * Devuelve las categorías de noticias de mexicoxport.com en formato JSON.
 *
 * @author Kevin Perez <kevindperezm@gmail.com>
 * @copyright Mexicoxport 2015
 */

require_once '../mxport.php';

$resultados = query('SELECT * FROM nw_tematica ORDER BY Nombre, Tag');

for ($categorias = array(); $fila = mysqli_fetch_assoc($resultados);) {
  $categorias[] = $fila;
}

$json = json_encode($categorias);
header('Content-Type: application/json');
header('Content-Length: ' . strlen($json));
echo $json;
