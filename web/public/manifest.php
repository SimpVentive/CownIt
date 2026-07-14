<?php
// Set correct Content-Type for PWA manifest
header('Content-Type: application/manifest+json');
header('Cache-Control: public, max-age=3600');

// Read manifest.json and update icon paths to use PHP wrappers
$manifest = json_decode(file_get_contents(__DIR__ . '/manifest.json'), true);

// Update icon paths to use PHP wrappers for proper MIME types
$manifest['icons'] = [
  [
    'src' => '/icon-192.php',
    'sizes' => '192x192',
    'type' => 'image/png',
    'purpose' => 'any'
  ],
  [
    'src' => '/icon-maskable.php',
    'sizes' => '192x192',
    'type' => 'image/png',
    'purpose' => 'maskable'
  ],
  [
    'src' => '/icon-512.php',
    'sizes' => '512x512',
    'type' => 'image/png',
    'purpose' => 'any'
  ],
  [
    'src' => '/icon-512.php',
    'sizes' => '512x512',
    'type' => 'image/png',
    'purpose' => 'maskable'
  ]
];

// Output modified manifest as JSON
echo json_encode($manifest, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
?>

