#!/usr/bin/env node

/**
 * 对比中英文 i18n 词条，找出缺少英文版的词条
 * 用法: node scripts/compare-i18n-keys.js
 */

const fs = require('fs');
const path = require('path');

// 配置
const ZH_CN_FILE = path.join(__dirname, '../packages/refine/src/locales/zh-CN/dovetail.json');
const EN_US_FILE = path.join(__dirname, '../packages/refine/src/locales/en-US/dovetail.json');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 读取 JSON 文件
function loadJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    log(`❌ 读取文件失败: ${filePath}`, 'red');
    log(`   错误信息: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 主函数
function main() {
  log('\n🔍 开始对比中英文 i18n 词条...\n', 'cyan');
  log(`📁 中文文件: ${ZH_CN_FILE}`, 'blue');
  log(`📁 英文文件: ${EN_US_FILE}\n`, 'blue');

  // 加载文件
  const zhCnData = loadJsonFile(ZH_CN_FILE);
  const enUsData = loadJsonFile(EN_US_FILE);

  // 获取所有键
  const zhCnKeys = Object.keys(zhCnData);
  const enUsKeys = Object.keys(enUsData);

  log(`✅ 中文词条总数: ${zhCnKeys.length}`, 'green');
  log(`✅ 英文词条总数: ${enUsKeys.length}\n`, 'green');

  // 找出缺少英文版的词条
  const missingInEnUs = zhCnKeys.filter(key => !enUsKeys.includes(key));
  const missingInZhCn = enUsKeys.filter(key => !zhCnKeys.includes(key));

  // 输出缺少英文版的词条
  if (missingInEnUs.length > 0) {
    log(`\n❌ 缺少英文版的词条 (共 ${missingInEnUs.length} 个):\n`, 'red');
    missingInEnUs.forEach((key, index) => {
      const zhValue = zhCnData[key];
      log(`  ${index + 1}. ${key}`, 'yellow');
      log(`     中文: ${zhValue}`, 'cyan');
      log('', 'reset');
    });

    // 生成 JSON 格式的输出，包含中文内容
    log('\n📋 缺少的词条（JSON 格式，包含中文内容）:\n', 'magenta');
    log('// 注意: 请将中文内容替换为对应的英文翻译\n', 'cyan');
    
    // 输出包含中文内容的 JSON 格式（键值对，值为中文）
    const missingEntries = {};
    missingInEnUs.forEach(key => {
      const zhValue = zhCnData[key];
      missingEntries[key] = zhValue; // 直接使用中文内容
    });
    console.log(JSON.stringify(missingEntries, null, 2));
  } else {
    log('🎉 太棒了！所有中文词条都有对应的英文版本！', 'green');
  }

  // 输出英文文件中多出的词条（可选）
  if (missingInZhCn.length > 0) {
    log(`\n⚠️  英文文件中多出的词条 (共 ${missingInZhCn.length} 个):\n`, 'yellow');
    missingInZhCn.forEach((key, index) => {
      const enValue = enUsData[key];
      log(`  ${index + 1}. ${key}`, 'yellow');
      log(`     英文: ${enValue}`, 'cyan');
    });
    log('\n💡 提示: 这些词条在英文文件中存在，但中文文件中没有，可能需要添加到中文文件。', 'yellow');
  }

  // 统计信息
  log('\n📊 统计信息:\n', 'cyan');
  log(`  中文词条总数: ${zhCnKeys.length}`, 'blue');
  log(`  英文词条总数: ${enUsKeys.length}`, 'blue');
  log(`  缺少英文版的词条: ${missingInEnUs.length}`, missingInEnUs.length > 0 ? 'red' : 'green');
  log(`  英文文件中多出的词条: ${missingInZhCn.length}`, missingInZhCn.length > 0 ? 'yellow' : 'green');
  log(`  覆盖率: ${Math.round((zhCnKeys.length - missingInEnUs.length) / zhCnKeys.length * 100)}%`, 'yellow');

  log(''); // 空行
}

// 运行脚本
main();

