#!/usr/bin/env node

/**
 * 检查 dovetail.json 中的 i18n 词条是否都被使用
 * 用法: node scripts/check-dovetail-i18n-usage.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const I18N_FILE = path.join(__dirname, '../packages/refine/src/locales/zh-CN/dovetail.json');
const SEARCH_DIR = path.join(__dirname, '../packages/refine/src');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 读取 i18n 文件
function loadI18nKeys() {
  try {
    const content = fs.readFileSync(I18N_FILE, 'utf-8');
    const jsonData = JSON.parse(content);
    return Object.keys(jsonData);
  } catch (error) {
    log(`❌ 读取 i18n 文件失败: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 使用 grep 搜索词条使用情况
function searchKeyUsage(key) {
  try {
    // 搜索 dovetail.key_name 的使用
    // 支持多种使用方式：
    // - t('dovetail.key')
    // - t("dovetail.key")
    // - i18n.t('dovetail.key')
    // - sksI18n.t('dovetail.key')
    // - 动态拼接方式（如 `dovetail.${variable}`）
    const searchPattern = `dovetail\\.${key}`;
    const command = `grep -r --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=lib --exclude-dir=build -E "${searchPattern}" "${SEARCH_DIR}" 2>/dev/null || true`;
    
    const result = execSync(command, { encoding: 'utf-8' });
    return result.trim().length > 0;
  } catch (error) {
    return false;
  }
}

// 主函数
function main() {
  log('\n🔍 开始检查 dovetail.json 中的 i18n 词条使用情况...\n', 'cyan');
  log(`📁 i18n 文件: ${I18N_FILE}`, 'blue');
  log(`📁 搜索目录: ${SEARCH_DIR}\n`, 'blue');

  const keys = loadI18nKeys();
  log(`✅ 共找到 ${keys.length} 个词条\n`, 'green');

  const unusedKeys = [];
  const usedKeys = [];
  const usedKeysWithFiles = {};

  // 显示进度
  let processed = 0;
  const total = keys.length;

  for (const key of keys) {
    processed++;
    process.stdout.write(`\r正在检查... ${processed}/${total} (${Math.round(processed / total * 100)}%)`);
    
    const isUsed = searchKeyUsage(key);
    if (isUsed) {
      usedKeys.push(key);
      // 获取使用该词条的文件列表
      try {
        const searchPattern = `dovetail\\.${key}`;
        const command = `grep -r --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=lib --exclude-dir=build -l -E "${searchPattern}" "${SEARCH_DIR}" 2>/dev/null || true`;
        const result = execSync(command, { encoding: 'utf-8' });
        const files = result.trim().split('\n').filter(f => f.length > 0);
        if (files.length > 0) {
          usedKeysWithFiles[key] = files;
        }
      } catch (error) {
        // 忽略错误
      }
    } else {
      unusedKeys.push(key);
    }
  }

  process.stdout.write('\r' + ' '.repeat(50) + '\r'); // 清除进度行

  // 输出结果
  log('\n📊 检查结果:\n', 'cyan');
  log(`✅ 已使用的词条: ${usedKeys.length} 个`, 'green');
  log(`❌ 未使用的词条: ${unusedKeys.length} 个`, unusedKeys.length > 0 ? 'red' : 'green');
  log(`📈 使用率: ${Math.round(usedKeys.length / total * 100)}%\n`, 'yellow');

  if (unusedKeys.length > 0) {
    log('⚠️  以下词条可能未被使用:\n', 'yellow');
    unusedKeys.forEach((key, index) => {
      log(`  ${index + 1}. ${key}`, 'red');
    });
    
    log('\n💡 提示:', 'cyan');
    log('  - 以上词条在代码中未找到使用痕迹', 'yellow');
    log('  - 可能是通过动态拼接的方式使用（如 `dovetail.${variable}`）', 'yellow');
    log('  - 建议人工确认后再决定是否删除', 'yellow');
    log('  - 可以使用以下命令手动搜索某个词条:', 'yellow');
    log('    grep -r "dovetail.key_name" packages/refine/src/', 'blue');
  } else {
    log('🎉 太棒了！所有词条都被使用了！', 'green');
  }

  // 可选：显示已使用词条的文件位置（仅在未使用词条较少时显示）
  if (unusedKeys.length > 0 && unusedKeys.length <= 10) {
    log('\n📝 已使用词条的文件位置（部分）:\n', 'cyan');
    const sampleKeys = Object.keys(usedKeysWithFiles).slice(0, 5);
    sampleKeys.forEach(key => {
      log(`  ${key}:`, 'blue');
      usedKeysWithFiles[key].slice(0, 3).forEach(file => {
        const relativePath = path.relative(SEARCH_DIR, file);
        log(`    - ${relativePath}`, 'reset');
      });
      if (usedKeysWithFiles[key].length > 3) {
        log(`    ... 还有 ${usedKeysWithFiles[key].length - 3} 个文件`, 'reset');
      }
    });
  }

  log(''); // 空行
}

// 运行脚本
main();








