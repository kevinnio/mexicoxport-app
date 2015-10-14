<?php

/**
 * Devuelve las categorías de noticias de mexicoxport.com en formato JSON.
 *
 * @author Kevin Perez <kevindperezm@gmail.com>
 * @copyright Mexicoxport 2015
 */

require_once __DIR__ . '/../utilidades.php';

$campos_categorias = array(
  'id'     => 'idTematica',
  'nombre' => 'Nombre',
);

$campos     = implode(', ', array_values($campos_categorias));
$resultados = query("SELECT $campos FROM nw_tematica ORDER BY Nombre");
for ($categorias = array(); $fila = mysqli_fetch_assoc($resultados); $categorias[] = $fila);
$categorias = renombrar_campos($categorias, $campos_categorias);

enviarRespuesta($categorias);
