<?php

require_once __DIR__ . '/../../utilidades.php';

$noticia_id = sanitizar($_GET['noticia_id']);
$cantidad   = sanitizar($_GET['cantidad']);

$resultados = query("SELECT * FROM noticias_comentarios WHERE noticia_id = $noticia_id ORDER BY created_at DESC LIMIT $cantidad");

$comentarios = array();
while($fila = mysqli_fetch_array($resultados, MYSQLI_ASSOC)) {
  $comentarios[] = $fila;
}

enviarRespuesta($comentarios);
