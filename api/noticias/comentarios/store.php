<?php

require_once __DIR__ . '/../../utilidades.php';

$usuario    = sanitizar($_POST['usuario']);
$email      = sanitizar($_POST['email']);
$comentario = sanitizar($_POST['comentario']);
$noticia_id = sanitizar($_POST['noticia_id']);
$created_at = date('Y-d-m H:i:s');

query('INSERT INTO noticias_comentarios (usuario, email, comentario, noticia_id, created_at) ' .
      "VALUES ('$usuario', '$email', '$comentario', $noticia_id, '$created_at')");
