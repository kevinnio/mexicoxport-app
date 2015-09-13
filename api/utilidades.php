<?php

require_once '../mxport.php';

/**
 * Prepara un dato recibido desde la temible Internet para ser introducido en la base de datos.
 *
 * @param  $dato $string
 *
 * @return $string
 */
function sanitizar($dato) {
  return mysqli_escape_string(getMyConection(), $dato);
}
