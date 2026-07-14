<?php
header('Content-Type: image/png');
header('Cache-Control: public, max-age=31536000, immutable');
readfile(__DIR__ . '/icons/icon-512x512.png');
?>
