<?php
// Set correct Content-Type for PWA manifest
header('Content-Type: application/manifest+json');
header('Cache-Control: public, max-age=3600');

// Read and output the manifest.json file
readfile(__DIR__ . '/manifest.json');
?>
