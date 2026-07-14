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

async function createSquareIcon(sourceFile, size, outputFile) {
  // For rectangular images, center on square canvas with white background
  const resizeSize = Math.round(size * 0.8);
  const buffer = await sharp(sourceFile)
    .resize(resizeSize, resizeSize, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  })
    .composite([
      {
        input: buffer,
        gravity: 'center'
      }
    ])
    .png()
    .toFile(outputFile);
}

async function processIcons() {
  try {
    console.log('🎨 Processing CownIt icons...\n');

    // 1. Create 192x192px icon (centered on square canvas)
    await createSquareIcon(SOURCE_ICON, 192, path.join(OUTPUT_DIR, 'icon-192x192.png'));
    console.log('✓ Created icon-192x192.png (centered on square)');

    // 2. Create 512x512px icon (centered on square canvas)
    await createSquareIcon(SOURCE_ICON, 512, path.join(OUTPUT_DIR, 'icon-512x512.png'));
    console.log('✓ Created icon-512x512.png (centered on square)');

    // 3. Create 192x192px maskable icon with safe zone (80% canvas)
    const canvasSize = 192;
    const safeZoneSize = Math.round(canvasSize * 0.8); // 154
    const padding = Math.round((canvasSize - safeZoneSize) / 2); // 19

    const maskableBuffer = await sharp(SOURCE_ICON)
      .resize(safeZoneSize, safeZoneSize, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();

    await sharp({
      create: {
        width: canvasSize,
        height: canvasSize,
        channels: 3,
        background: { r: 255, g: 255, b: 255 }
      }
    })
      .composite([
        {
          input: maskableBuffer,
          top: padding,
          left: padding
        }
      ])
      .png()
      .toFile(path.join(OUTPUT_DIR, 'icon-192x192-maskable.png'));

    console.log('✓ Created icon-192x192-maskable.png (safe zone: 80%)');

    console.log('\n✅ All icons processed successfully!\n');
    console.log('📁 Output directory:', OUTPUT_DIR);
    console.log('\nGenerated files:');
    console.log('  - icon-192x192.png         (standard 192px, centered)');
    console.log('  - icon-512x512.png         (standard 512px, centered)');
    console.log('  - icon-192x192-maskable.png (Android adaptive icon)');
    console.log('\n💡 Logo is centered on white background for proper square format');

  } catch (error) {
    console.error('❌ Error processing icons:', error.message);
    process.exit(1);
  }
}

processIcons();
