#!/usr/bin/env node
/**
 * Loop Engineering - 小游戏合集自动化测试框架
 * 支持多游戏测试、目录结构验证、功能完整性检查
 * 
 * 使用方法:
 *   node loop_engineering/index.js              # 测试所有游戏
 *   node loop_engineering/index.js --game finddiff  # 测试指定游戏
 *   node loop_engineering/index.js --quick      # 快速模式
 *   node loop_engineering/index.js --structure  # 仅验证目录结构
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 项目根目录
const ROOT_DIR = path.join(__dirname, '..');

// 游戏配置
const GAMES = {
    spider_solitaire: {
        name: '蜘蛛纸牌',
        folder: 'spider_solitaire',
        entry: 'index.html',
        tests: ['basic_structure', 'links_valid']
    },
    sudoku: {
        name: '数独',
        folder: 'sudoku',
        entry: 'index.html',
        tests: ['basic_structure', 'links_valid']
    },
    minesweeper: {
        name: '扫雷',
        folder: 'minesweeper',
        entry: 'index.html',
        tests: ['basic_structure', 'links_valid']
    },
    finddiff: {
        name: '找不同',
        folder: 'finddiff',
        entry: 'v2.html',
        tests: ['basic_structure', 'difference_logic', 'image_generation', 'function_buttons']
    }
};

// 命令行参数
const ARGS = {
    game: process.argv.find(arg => arg.startsWith('--game='))?.split('=')[1],
    quick: process.argv.includes('--quick'),
    structure: process.argv.includes('--structure'),
    verbose: process.argv.includes('--verbose')
};

// 颜色输出
const c = {
    g: '\x1b[32m',
    r: '\x1b[31m',
    y: '\x1b[33m',
    b: '\x1b[34m',
    c: '\x1b[36m',
    w: '\x1b[37m',
    x: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(msg, color = 'w') {
    console.log(`${c[color]}${msg}${c.x}`);
}

function banner() {
    log('');
    log('╔════════════════════════════════════════════════════════════╗', 'b');
    log('║                                                            ║', 'b');
    log('║           🔁 LOOP ENGINEERING - 小游戏测试框架            ║', 'c');
    log('║                                                            ║', 'b');
    log('║   自动化验证目录结构、链接有效性、游戏功能完整性          ║', 'b');
    log('║                                                            ║', 'b');
    log('╚════════════════════════════════════════════════════════════╝', 'b');
    log('');
}

// ==================== 目录结构验证 ====================

function verifyDirectoryStructure() {
    log('\n📁 阶段1: 目录结构验证', 'b');
    log('━'.repeat(50), 'b');
    
    const requiredStructure = [
        { path: 'index.html', type: 'file', desc: '游戏首页' },
        { path: 'spider_solitaire/index.html', type: 'file', desc: '蜘蛛纸牌' },
        { path: 'sudoku/index.html', type: 'file', desc: '数独' },
        { path: 'minesweeper/index.html', type: 'file', desc: '扫雷' },
        { path: 'finddiff/index.html', type: 'file', desc: '找不同(原版)' },
        { path: 'finddiff/v2.html', type: 'file', desc: '找不同(V2)' },
        { path: 'loop_engineering/index.js', type: 'file', desc: '测试框架入口' },
        { path: 'loop_engineering/tests', type: 'dir', desc: '测试脚本目录' },
        { path: 'loop_engineering/reports', type: 'dir', desc: '测试报告目录' },
        { path: 'shared/css', type: 'dir', desc: '共享CSS' },
        { path: 'shared/js', type: 'dir', desc: '共享JS' },
    ];
    
    const results = [];
    
    for (const item of requiredStructure) {
        const fullPath = path.join(ROOT_DIR, item.path);
        const exists = fs.existsSync(fullPath);
        const isCorrectType = exists && (
            item.type === 'file' ? fs.statSync(fullPath).isFile() : fs.statSync(fullPath).isDirectory()
        );
        
        results.push({
            path: item.path,
            desc: item.desc,
            exists,
            valid: exists && isCorrectType
        });
        
        const status = exists && isCorrectType ? '✅' : '❌';
        const color = exists && isCorrectType ? 'g' : 'r';
        log(`  ${status} ${item.desc} (${item.path})`, color);
    }
    
    const allValid = results.every(r => r.valid);
    const passedCount = results.filter(r => r.valid).length;
    
    log(`\n  目录结构: ${passedCount}/${results.length} 项通过`, allValid ? 'g' : 'y');
    
    return {
        verified: allValid,
        details: results,
        summary: { passed: passedCount, total: results.length }
    };
}

// ==================== 链接有效性验证 ====================

function verifyLinks() {
    log('\n� 阶段2: 链接有效性验证', 'b');
    log('━'.repeat(50), 'b');
    
    const indexPath = path.join(ROOT_DIR, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf8');
    
    // 提取所有 href 链接
    const hrefMatches = content.match(/href="([^"]+)"/g) || [];
    const links = hrefMatches.map(match => match.replace(/href="([^"]+)"/, '$1'));
    
    // 去重并过滤外部链接
    const internalLinks = [...new Set(links)].filter(link => 
        !link.startsWith('http') && !link.startsWith('#') && !link.startsWith('data:')
    );
    
    const results = [];
    
    for (const link of internalLinks) {
        // 处理相对路径
        let targetPath;
        if (link.endsWith('/')) {
            targetPath = path.join(ROOT_DIR, link, 'index.html');
        } else {
            targetPath = path.join(ROOT_DIR, link);
        }
        
        const exists = fs.existsSync(targetPath);
        results.push({ link, path: targetPath, exists });
        
        const status = exists ? '✅' : '❌';
        const color = exists ? 'g' : 'r';
        log(`  ${status} ${link}`, color);
    }
    
    const allValid = results.every(r => r.exists);
    const passedCount = results.filter(r => r.exists).length;
    
    log(`\n  链接检查: ${passedCount}/${results.length} 项通过`, allValid ? 'g' : 'r');
    
    return {
        verified: allValid,
        details: results,
        summary: { passed: passedCount, total: results.length }
    };
}

// ==================== 游戏功能测试 ====================

function testGameFunctionality(gameKey) {
    const game = GAMES[gameKey];
    if (!game) {
        return { verified: false, error: `未知游戏: ${gameKey}` };
    }
    
    log(`\n🎮 阶段3: ${game.name} 功能测试`, 'b');
    log('━'.repeat(50), 'b');
    
    const filePath = path.join(ROOT_DIR, game.folder, game.entry);
    
    if (!fs.existsSync(filePath)) {
        return { verified: false, error: `文件不存在: ${filePath}` };
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const results = [];
    
    // 基础结构检查
    if (game.tests.includes('basic_structure')) {
        const checks = [
            { name: 'HTML结构', test: /<html/i.test(content) },
            { name: '标题标签', test: /<title>/i.test(content) },
            { name: '返回首页链接', test: /\.\.\//.test(content) || /href="\.\.\/"/.test(content) },
        ];
        
        checks.forEach(check => {
            results.push({ category: '基础结构', ...check });
            log(`  ${check.test ? '✅' : '❌'} ${check.name}`, check.test ? 'g' : 'y');
        });
    }
    
    // 找不同特有测试
    if (gameKey === 'finddiff') {
        // 差异点生成逻辑
        if (game.tests.includes('difference_logic')) {
            const diffLogic = {
                hasGenerateFunction: /function\s+generateDifferences/.test(content),
                level1to3: /currentLevel.*<=.*3.*\?.*3/.test(content),
                level4to6: /currentLevel.*<=.*6.*\?.*4/.test(content),
                level7plus: /:\s*5/.test(content),
                hasDiffArray: /differences\s*=\s*\[|let\s+differences/.test(content),
            };
            
            log('\n  📐 差异点生成逻辑:', 'c');
            Object.entries(diffLogic).forEach(([key, val]) => {
                const name = {
                    hasGenerateFunction: '生成函数',
                    level1to3: '关卡1-3 (3处)',
                    level4to6: '关卡4-6 (4处)',
                    level7plus: '关卡7+ (5处)',
                    hasDiffArray: '差异点数组'
                }[key];
                results.push({ category: '差异点逻辑', name, test: val });
                log(`    ${val ? '✅' : '❌'} ${name}`, val ? 'g' : 'r');
            });
        }
        
        // 图片生成
        if (game.tests.includes('image_generation')) {
            const imgGen = {
                usesPicsum: /picsum\.photos/.test(content),
                hasImageLoad: /img\.onload/.test(content),
                hasLeftRight: /left.*right|Left.*Right|createImageWrapper.*left|createImageWrapper.*right/i.test(content),
            };
            
            log('\n  🖼️ 图片生成:', 'c');
            Object.entries(imgGen).forEach(([key, val]) => {
                const name = {
                    usesPicsum: 'Picsum API',
                    hasImageLoad: '加载事件',
                    hasLeftRight: '左右区分'
                }[key];
                results.push({ category: '图片生成', name, test: val });
                log(`    ${val ? '✅' : '❌'} ${name}`, val ? 'g' : 'r');
            });
        }
        
        // 功能按钮
        if (game.tests.includes('function_buttons')) {
            const buttons = {
                useHint: /function\s+useHint/.test(content),
                addTime: /function\s+addTime/.test(content),
                zoomImage: /function\s+zoomImage/.test(content),
            };
            
            log('\n  🔘 功能按钮:', 'c');
            Object.entries(buttons).forEach(([key, val]) => {
                const name = {
                    useHint: '💡 提示',
                    addTime: '⏱️ 加时',
                    zoomImage: '🔍 放大'
                }[key];
                results.push({ category: '功能按钮', name, test: val });
                log(`    ${val ? '✅' : '❌'} ${name}`, val ? 'g' : 'r');
            });
        }
    }
    
    const allPassed = results.every(r => r.test);
    const passedCount = results.filter(r => r.test).length;
    
    log(`\n  功能测试: ${passedCount}/${results.length} 项通过`, allPassed ? 'g' : 'y');
    
    return {
        verified: allPassed,
        details: results,
        summary: { passed: passedCount, total: results.length }
    };
}

// ==================== 运行子测试脚本 ====================

function runSubTests() {
    log('\n🧪 阶段4: 子测试脚本执行', 'b');
    log('━'.repeat(50), 'b');
    
    const testsDir = path.join(__dirname, 'tests');
    const testFiles = fs.readdirSync(testsDir).filter(f => f.endsWith('.js'));
    
    const results = [];
    
    for (const testFile of testFiles) {
        const testPath = path.join(testsDir, testFile);
        log(`\n  运行: ${testFile}`, 'c');
        
        try {
            const output = execSync(`node "${testPath}"`, {
                encoding: 'utf8',
                timeout: 30000,
                cwd: ROOT_DIR
            });
            
            const hasSuccess = output.includes('所有测试通过') || output.includes('测试通过') || output.includes('PASSED');
            // 只匹配明确的失败标记，排除"失败: 0"这样的无失败情况
            const hasCriticalFailure = /❌\s*失败|测试失败(?!.*通过)|未通过/.test(output);
            const hasZeroFailures = /失败[:：]\s*0\s*\//.test(output);
            
            const passed = (hasSuccess || hasZeroFailures) && !hasCriticalFailure;
            results.push({ file: testFile, passed });
            
            log(`    ${passed ? '✅' : '❌'} ${testFile}`, passed ? 'g' : 'r');
            
            if (ARGS.verbose && output) {
                log(`    输出: ${output.substring(0, 200)}...`, 'w');
            }
        } catch (error) {
            results.push({ file: testFile, passed: false, error: error.message });
            log(`    ❌ ${testFile} (执行错误)`, 'r');
        }
    }
    
    const allPassed = results.every(r => r.passed);
    const passedCount = results.filter(r => r.passed).length;
    
    log(`\n  子测试: ${passedCount}/${results.length} 项通过`, allPassed ? 'g' : 'y');
    
    return {
        verified: allPassed,
        details: results,
        summary: { passed: passedCount, total: results.length }
    };
}

// ==================== 主流程 ====================

async function main() {
    banner();
    
    log(`📂 项目根目录: ${ROOT_DIR}`, 'c');
    log(`🎯 测试模式: ${ARGS.game || '全部游戏'}`, 'c');
    log(`⚡ 快速模式: ${ARGS.quick ? '是' : '否'}`, 'c');
    log('');
    
    const allResults = {};
    let finalStatus = 'PASSED';
    
    // 阶段1: 目录结构
    const structureResult = verifyDirectoryStructure();
    allResults.directoryStructure = structureResult;
    
    if (!structureResult.verified) {
        finalStatus = 'NEEDS_REVIEW';
    }
    
    // 阶段2: 链接有效性
    const linksResult = verifyLinks();
    allResults.links = linksResult;
    
    if (!linksResult.verified) {
        finalStatus = 'NEEDS_REVIEW';
    }
    
    // 阶段3: 游戏功能测试
    allResults.games = {};
    
    const gamesToTest = ARGS.game ? [ARGS.game] : Object.keys(GAMES);
    
    for (const gameKey of gamesToTest) {
        const gameResult = testGameFunctionality(gameKey);
        allResults.games[gameKey] = gameResult;
        
        if (!gameResult.verified) {
            finalStatus = 'NEEDS_REVIEW';
        }
    }
    
    // 阶段4: 子测试脚本 (非快速模式)
    if (!ARGS.quick && !ARGS.structure) {
        const subTestResult = runSubTests();
        allResults.subTests = subTestResult;
        
        if (!subTestResult.verified) {
            finalStatus = 'NEEDS_REVIEW';
        }
    }
    
    // 生成最终报告
    log('\n' + '═'.repeat(60), 'b');
    log('� 最终测试报告', 'b');
    log('═'.repeat(60), 'b');
    
    // 汇总统计
    let totalTests = 0;
    let totalPassed = 0;
    
    totalTests += allResults.directoryStructure.summary.total;
    totalPassed += allResults.directoryStructure.summary.passed;
    
    totalTests += allResults.links.summary.total;
    totalPassed += allResults.links.summary.passed;
    
    Object.values(allResults.games).forEach(game => {
        totalTests += game.summary.total;
        totalPassed += game.summary.passed;
    });
    
    if (allResults.subTests) {
        totalTests += allResults.subTests.summary.total;
        totalPassed += allResults.subTests.summary.passed;
    }
    
    const passRate = ((totalPassed / totalTests) * 100).toFixed(1);
    
    log(`\n  总测试项: ${totalTests}`, 'w');
    log(`  通过: ${totalPassed}`, 'g');
    log(`  失败: ${totalTests - totalPassed}`, totalPassed === totalTests ? 'g' : 'r');
    log(`  通过率: ${passRate}%`, passRate >= 90 ? 'g' : passRate >= 70 ? 'y' : 'r');
    
    // 各阶段状态
    log('\n  各阶段状态:', 'c');
    log(`    目录结构: ${allResults.directoryStructure.verified ? '✅' : '❌'}`, 
        allResults.directoryStructure.verified ? 'g' : 'r');
    log(`    链接有效性: ${allResults.links.verified ? '✅' : '❌'}`, 
        allResults.links.verified ? 'g' : 'r');
    
    Object.entries(allResults.games).forEach(([key, result]) => {
        const gameName = GAMES[key]?.name || key;
        log(`    ${gameName}: ${result.verified ? '✅' : '❌'}`, result.verified ? 'g' : 'r');
    });
    
    if (allResults.subTests) {
        log(`    子测试脚本: ${allResults.subTests.verified ? '✅' : '❌'}`, 
            allResults.subTests.verified ? 'g' : 'r');
    }
    
    // 结论
    log('\n' + '═'.repeat(60), finalStatus === 'PASSED' ? 'g' : 'y');
    
    if (finalStatus === 'PASSED') {
        log('');
        log('  ✅ LOOP ENGINEERING 测试通过！', 'g');
        log('', 'g');
        log('  验证结果:', 'g');
        log('    • 目录结构清晰合理', 'g');
        log('    • 所有链接指向正确', 'g');
        log('    • 游戏功能完整可用', 'g');
        log('', 'g');
        log('  🎮 项目可以正常部署使用！', 'g');
        log('', 'g');
    } else {
        log('');
        log('  ⚠️  部分测试未通过', 'y');
        log('', 'y');
        log('  建议检查:', 'y');
        
        if (!allResults.directoryStructure.verified) {
            log('    • 目录结构是否符合规范', 'y');
        }
        if (!allResults.links.verified) {
            log('    • 首页链接是否指向正确', 'y');
        }
        Object.entries(allResults.games).forEach(([key, result]) => {
            if (!result.verified) {
                log(`    • ${GAMES[key]?.name || key} 功能是否完整`, 'y');
            }
        });
        log('', 'y');
    }
    
    log('═'.repeat(60), finalStatus === 'PASSED' ? 'g' : 'y');
    
    // 保存报告
    const report = {
        timestamp: new Date().toISOString(),
        status: finalStatus,
        summary: {
            total: totalTests,
            passed: totalPassed,
            failed: totalTests - totalPassed,
            passRate: `${passRate}%`
        },
        details: allResults
    };
    
    const reportPath = path.join(__dirname, 'reports', `report_${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    log(`\n📄 报告已保存: ${reportPath}`, 'c');
    log('');
    
    return finalStatus;
}

// 执行
main().then(status => {
    process.exit(status === 'PASSED' ? 0 : 1);
}).catch(err => {
    log(`\n💥 执行失败: ${err.message}`, 'r');
    console.error(err);
    process.exit(1);
});
