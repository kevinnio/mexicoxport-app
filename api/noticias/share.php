<?php

/**
 * Registra la compartición de una noticia.
 *
 * @param int $month Mes en el que ocurre el evento de compartir.
 * @param int $year  Año en el que ocurre el evento de compartir.
 *
 * @author Kevin Perez <kevindperezm@gmail.com>
 * @copyright Mexicoxport 2015
 */

require_once __DIR__ . '/../utilidades.php';

list($month, $year) = array(mysqli_escape_string(getMyConection(), $_GET['month']),
                            mysqli_escape_string(getMyConection(), $_GET['year']));

$sql = "SELECT * FROM mobile_share_stats WHERE month = $month AND year = $year";
$row = mysqli_fetch_assoc(query($sql));

if ($row) {
  $sql = "UPDATE mobile_share_stats SET count = " . ($row['count'] + 1) . " WHERE month = $month AND year = $year";
} else {
  $sql = "INSERT INTO mobile_share_stats (month, year, count) VALUES ($month, $year, 1)";
}

if (query($sql)) {
  header("Access-Control-Allow-Origin: *");
  echo '{"saved": true}';
} else {
  die('An error ocurred. ' . mysqli_error(getMyConection()));
}
