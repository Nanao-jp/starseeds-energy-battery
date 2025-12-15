const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * 画像を最適化して .webp 形式に変換
 * @param {string} inputPath - 入力画像のパス
 * @param {string} outputPath - 出力画像のパス
 * @param {number} quality - 品質 (0-100, デフォルト: 85)
 * @param {number} maxWidth - 最大幅 (デフォルト: 1920)
 */
async function optimizeImage(inputPath, outputPath, quality = 85, maxWidth = 1920) {
  try {
    const metadata = await sharp(inputPath).metadata();
    const width = Math.min(metadata.width, maxWidth);
    const height = Math.round((width / metadata.width) * metadata.height);

    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toFile(outputPath);

    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`  ${(inputStats.size / 1024).toFixed(2)} KB → ${(outputStats.size / 1024).toFixed(2)} KB (${reduction}% 削減)`);

    return {
      originalSize: inputStats.size,
      optimizedSize: outputStats.size,
      reduction: parseFloat(reduction),
    };
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
    throw error;
  }
}

/**
 * photo ディレクトリ内の画像を一括最適化
 */
async function optimizePhotos() {
  const materialDir = path.join(__dirname, '..', 'public', 'material', 'images', 'photo');
  const outputDir = path.join(__dirname, '..', 'public', 'images', 'photo');

  // 出力ディレクトリが存在しない場合は作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 入力ファイル一覧を取得
  const files = fs.readdirSync(materialDir).filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );

  if (files.length === 0) {
    console.log('No image files found in', materialDir);
    return;
  }

  console.log(`Found ${files.length} image(s) to optimize...\n`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const file of files) {
    const inputPath = path.join(materialDir, file);
    const baseName = path.basename(file, path.extname(file));
    const outputPath = path.join(outputDir, `${baseName}.webp`);

    const result = await optimizeImage(inputPath, outputPath);
    totalOriginalSize += result.originalSize;
    totalOptimizedSize += result.optimizedSize;
  }

  console.log('\n--- Summary ---');
  console.log(`Total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB → ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Reduction: ${((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)}%`);
}

// 実行
if (require.main === module) {
  optimizePhotos().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { optimizeImage, optimizePhotos };
