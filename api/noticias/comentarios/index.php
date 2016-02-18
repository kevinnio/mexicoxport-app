<?php

require_once __DIR__ . '/../../utilidades.php';

$noticia_id = sanitizar($_GET['noticia_id']);

$resultados = query("SELECT * FROM noticias_comentarios WHERE noticia_id = $noticia_id");

$comentarios = array();
while($fila = mysqli_fetch_array($resultados, MYSQLI_ASSOC)) {
  $comentarios[] = $fila;
}

enviarRespuesta($comentarios);
