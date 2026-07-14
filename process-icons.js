import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SOURCE_ICON = './web/public/icon.png';
const OUTPUT_DIR = './web/public/icons';

// Create icons directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`✓ Created ${OUTPUT_DIR} directory`);
}

async function processIcons() {
  try {
    console.log('🎨 Processing CownIt icons...\n');

    // 1. Create 192x192px icon
    await sharp(SOURCE_ICON)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFile(path.join(OUTPUT_DIR, 'icon-192x192.png'));
    console.log('✓ Created icon-192x192.png');

    // 2. Create 512x512px icon
    await sharp(SOURCE_ICON)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFile(path.join(OUTPUT_DIR, 'icon-512x512.png'));
    console.log('✓ Created icon-512x512.png');

    // 3. Create 192x192px maskable icon with safe zone (80% canvas)
    // Safe zone is 80% of 192 = 153.6px, centered with 19.2px padding each side
    const canvasSize = 192;
    const safeZonePercent = 0.8;
    const safeZoneSize = Math.floor(canvasSize * safeZonePercent);
    const padding = Math.floor((canvasSize - safeZoneSize) / 2);

    // First resize the icon to fit within safe zone
    await sharp(SOURCE_ICON)
      .resize(safeZoneSize, safeZoneSize, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toBuffer()
      .then(buffer => {
        // Create a new canvas with padding
        return sharp({
          create: {
            width: canvasSize,
            height: canvasSize,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          }
        })
          .composite([
            {
              input: buffer,
              top: padding,
              left: padding
            }
          ])
          .toFile(path.join(OUTPUT_DIR, 'icon-192x192-maskable.png'));
      });

    console.log('✓ Created icon-192x192-maskable.png (safe zone: 80%)');

    console.log('\n✅ All icons processed successfully!\n');
    console.log('📁 Output directory:', OUTPUT_DIR);
    console.log('\nGenerated files:');
    console.log('  - icon-192x192.png         (standard 192px)');
    console.log('  - icon-512x512.png         (standard 512px)');
    console.log('  - icon-192x192-maskable.png (Android adaptive icon)');

  } catch (error) {
    console.error('❌ Error processing icons:', error.message);
    process.exit(1);
  }
}

processIcons();
