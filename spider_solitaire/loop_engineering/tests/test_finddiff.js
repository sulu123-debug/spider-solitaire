/**
 * FindDiff Game - Loop Engineering Test Suite
 * 自动化测试流程：功能测试 -> 图片生成测试 -> 差异点验证 -> 迭代修复
 */

const fs = require('fs');
const path = require('path');

// 测试配置
const CONFIG = {
    targetFile: '../../finddiff/v2.html',
    maxIterations: 5,
    testTimeout: 30000,
    requiredDiffCount: 3, // 每关至少3处不同
};

// 测试结果存储
let testResults = {
    iteration: 0,
    passed: false,
    tests: [],
    errors: []
};

// ==================== 测试用例 ====================

const TEST_CASES = {
    // 测试1: 文件结构和基本元素
    testBasicStructure: () => {
        console.log('📋 测试1: 基础文件结构检查...');
        const filePath = path.join(__dirname, CONFIG.targetFile);
        
        if (!fs.existsSync(filePath)) {
            throw new Error(`目标文件不存在: ${CONFIG.targetFile}`);
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 检查必要元素
        const requiredElements = [
            { pattern: /<title>/, name: '页面标题' },
            { pattern: /class="image-container"/, name: '图片容器' },
            { pattern: /function.*handleImageClick/, name: '点击处理函数' },
            { pattern: /generateDifferences/, name: '差异点生成函数' },
            { pattern: /picsum\.photos/, name: '图片API引用' },
        ];
        
        const missing = requiredElements.filter(el => !el.pattern.test(content));
        
        if (missing.length > 0) {
            throw new Error(`缺少必要元素: ${missing.map(m => m.name).join(', ')}`);
        }
        
        console.log('✅ 基础结构检查通过');
        return true;
    },
    
    // 测试2: 功能按钮检查
    testFunctionButtons: () => {
        console.log('🔘 测试2: 功能按钮检查...');
        const filePath = path.join(__dirname, CONFIG.targetFile);
        const content = fs.readFileSync(filePath, 'utf8');
        
        const requiredButtons = [
            { pattern: /onclick="useHint\(\)"/, name: '提示按钮' },
            { pattern: /onclick="addTime\(\)"/, name: '加时按钮' },
            { pattern: /onclick="zoomImage\(\)"/, name: '放大按钮' },
            { pattern: /function useHint/, name: '提示功能实现' },
            { pattern: /function addTime/, name: '加时功能实现' },
        ];
        
        const missing = requiredButtons.filter(btn => !btn.pattern.test(content));
        
        if (missing.length > 0) {
            throw new Error(`功能按钮缺失: ${missing.map(m => m.name).join(', ')}`);
        }
        
        console.log('✅ 功能按钮检查通过');
        return true;
    },
    
    // 测试3: 差异点生成逻辑检查
    testDifferenceGeneration: () => {
        console.log('🎯 测试3: 差异点生成逻辑检查...');
        const filePath = path.join(__dirname, CONFIG.targetFile);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 检查差异点生成函数
        const hasGenerateFunction = /function generateDifferences/.test(content);
        if (!hasGenerateFunction) {
            throw new Error('缺少 generateDifferences 函数');
        }
        
        // 检查差异点数据结构
        const hasDiffStructure = /differences\.push\(\{[^}]*id:[^}]*x:[^}]*y:/.test(content);
        if (!hasDiffStructure) {
            throw new Error('差异点数据结构不完整，需要包含 id, x, y 属性');
        }
        
        // 检查差异点数量逻辑
        const hasDiffCountLogic = /currentLevel.*\?.*3.*:.*4|count.*=.*3|count.*=.*4/.test(content);
        if (!hasDiffCountLogic) {
            throw new Error('缺少根据关卡设置差异点数量的逻辑');
        }
        
        console.log('✅ 差异点生成逻辑检查通过');
        return true;
    },
    
    // 测试4: 图片生成和加载检查
    testImageGeneration: () => {
        console.log('🖼️ 测试4: 图片生成和加载检查...');
        const filePath = path.join(__dirname, CONFIG.targetFile);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 检查图片API使用
        const hasImageAPI = /picsum\.photos/.test(content);
        if (!hasImageAPI) {
            throw new Error('未使用图片API (picsum.photos)');
        }
        
        // 检查左右图片容器创建
        const hasImageWrappers = /createImageWrapper|image-wrapper.*left|image-wrapper.*right/.test(content);
        if (!hasImageWrappers) {
            throw new Error('缺少左右图片容器创建逻辑');
        }
        
        // 检查图片加载事件
        const hasLoadEvent = /img\.onload|img\.addEventListener\('load'/.test(content);
        if (!hasLoadEvent) {
            throw new Error('缺少图片加载事件处理');
        }
        
        console.log('✅ 图片生成和加载检查通过');
        return true;
    },
    
    // 测试5: 点击检测逻辑检查
    testClickDetection: () => {
        console.log('👆 测试5: 点击检测逻辑检查...');
        const filePath = path.join(__dirname, CONFIG.targetFile);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 检查点击处理函数
        const hasClickHandler = /function handleImageClick/.test(content);
        if (!hasClickHandler) {
            throw new Error('缺少 handleImageClick 函数');
        }
        
        // 检查距离计算逻辑
        const hasDistanceCalc = /Math\.sqrt.*\*\* 2|Math\.sqrt.*Math\.pow/.test(content);
        if (!hasDistanceCalc) {
            throw new Error('缺少点击距离计算逻辑');
        }
        
        // 检查差异点匹配逻辑
        const hasDiffMatching = /dist.*<.*40|dist.*<.*radius/.test(content);
        if (!hasDiffMatching) {
            throw new Error('缺少差异点匹配逻辑（距离阈值判断）');
        }
        
        console.log('✅ 点击检测逻辑检查通过');
        return true;
    },
    
    // 测试6: 游戏状态管理检查
    testGameState: () => {
        console.log('🎮 测试6: 游戏状态管理检查...');
        const filePath = path.join(__dirname, CONFIG.targetFile);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 检查游戏状态变量
        const requiredStates = [
            { pattern: /let score/, name: '分数变量' },
            { pattern: /let timeLeft|let timer/, name: '计时器变量' },
            { pattern: /let lives|let life/, name: '生命值变量' },
            { pattern: /let gameOver/, name: '游戏结束标志' },
            { pattern: /foundDifferences/, name: '已找到差异记录' },
        ];
        
        const missing = requiredStates.filter(s => !s.pattern.test(content));
        
        if (missing.length > 0) {
            throw new Error(`状态变量缺失: ${missing.map(m => m.name).join(', ')}`);
        }
        
        // 检查计时器逻辑
        const hasTimerLogic = /setInterval|startTimer/.test(content);
        if (!hasTimerLogic) {
            throw new Error('缺少计时器逻辑');
        }
        
        console.log('✅ 游戏状态管理检查通过');
        return true;
    },
    
    // 测试7: UI反馈和动画检查
    testUIFeedback: () => {
        console.log('✨ 测试7: UI反馈和动画检查...');
        const filePath = path.join(__dirname, CONFIG.targetFile);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 检查标记动画
        const hasMarkerAnim = /@keyframes markerAppear|animation: marker/.test(content);
        if (!hasMarkerAnim) {
            throw new Error('缺少差异标记动画');
        }
        
        // 检查庆祝效果
        const hasConfetti = /confetti|celebration/.test(content);
        if (!hasConfetti) {
            throw new Error('缺少庆祝效果（confetti）');
        }
        
        // 检查提示动画
        const hasHintAnim = /@keyframes hintPulse|hint-ring/.test(content);
        if (!hasHintAnim) {
            throw new Error('缺少提示动画');
        }
        
        console.log('✅ UI反馈和动画检查通过');
        return true;
    }
};

// ==================== 自动修复逻辑 ====================

const AUTO_FIXES = {
    // 修复1: 添加缺失的基础结构
    fixBasicStructure: (content) => {
        let fixed = content;
        
        // 确保有图片容器
        if (!/class="image-container"/.test(fixed)) {
            fixed = fixed.replace(
                /<div class="game-area">/,
                `<div class="game-area">\n                <div class="image-container" id="imageContainer"></div>`
            );
        }
        
        return fixed;
    },
    
    // 修复2: 完善差异点生成逻辑
    fixDifferenceGeneration: (content) => {
        let fixed = content;
        
        // 如果缺少差异点数量逻辑，添加默认逻辑
        if (!/currentLevel.*\?.*3.*:.*4/.test(fixed)) {
            const defaultGen = `
function generateDifferences() {
    const count = currentLevel <= 3 ? 3 : (currentLevel <= 6 ? 4 : 5);
    differences = [];
    for (let i = 0; i < count; i++) {
        differences.push({
            id: i,
            x: 50 + Math.random() * 300,
            y: 50 + Math.random() * 200,
            found: false
        });
    }
}`;
            
            if (!/function generateDifferences/.test(fixed)) {
                fixed = fixed.replace(/<\/script>/, defaultGen + '\n</script>');
            }
        }
        
        return fixed;
    },
    
    // 修复3: 确保图片加载逻辑完整
    fixImageLoading: (content) => {
        let fixed = content;
        
        // 确保使用 picsum.photos
        if (!/picsum\.photos/.test(fixed)) {
            fixed = fixed.replace(
                /img\.src\s*=\s*["'][^"']+["']/,
                "img.src = `https://picsum.photos/seed/finddiff${seed}/400/300`;"
            );
        }
        
        return fixed;
    }
};

// ==================== 主测试流程 ====================

async function runTests() {
    console.log('🚀 启动 FindDiff Loop Engineering 测试流程\n');
    console.log('=' .repeat(50));
    
    const tests = [
        { name: '基础结构', fn: TEST_CASES.testBasicStructure },
        { name: '功能按钮', fn: TEST_CASES.testFunctionButtons },
        { name: '差异点生成', fn: TEST_CASES.testDifferenceGeneration },
        { name: '图片生成', fn: TEST_CASES.testImageGeneration },
        { name: '点击检测', fn: TEST_CASES.testClickDetection },
        { name: '状态管理', fn: TEST_CASES.testGameState },
        { name: 'UI反馈', fn: TEST_CASES.testUIFeedback },
    ];
    
    let allPassed = true;
    const results = [];
    
    for (const test of tests) {
        try {
            await test.fn();
            results.push({ name: test.name, status: 'PASS', error: null });
        } catch (error) {
            console.error(`❌ ${test.name} 测试失败:`, error.message);
            results.push({ name: test.name, status: 'FAIL', error: error.message });
            allPassed = false;
        }
        console.log('');
    }
    
    // 输出测试报告
    console.log('=' .repeat(50));
    console.log('📊 测试报告:\n');
    
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    
    console.log(`✅ 通过: ${passed}/${results.length}`);
    console.log(`❌ 失败: ${failed}/${results.length}`);
    console.log('');
    
    if (failed > 0) {
        console.log('🔧 失败项详情:');
        results.filter(r => r.status === 'FAIL').forEach(r => {
            console.log(`   - ${r.name}: ${r.error}`);
        });
    }
    
    console.log('');
    console.log('=' .repeat(50));
    
    return {
        passed: allPassed,
        results,
        summary: { passed, failed, total: results.length }
    };
}

// ==================== Loop Engineering 主流程 ====================

async function loopEngineering() {
    console.log('🔁 Loop Engineering 启动');
    console.log(`最大迭代次数: ${CONFIG.maxIterations}`);
    console.log('');
    
    for (let i = 1; i <= CONFIG.maxIterations; i++) {
        console.log(`\n🔄 第 ${i}/${CONFIG.maxIterations} 轮迭代`);
        console.log('-'.repeat(50));
        
        testResults.iteration = i;
        
        // 执行测试
        const result = await runTests();
        testResults.tests = result.results;
        
        if (result.passed) {
            console.log('\n🎉 所有测试通过！Loop Engineering 完成。');
            testResults.passed = true;
            break;
        } else {
            console.log(`\n⚠️ 第 ${i} 轮测试未通过，准备自动修复...`);
            
            // 这里可以添加自动修复逻辑
            // 目前仅记录错误，实际修复需要更复杂的逻辑
            testResults.errors = result.results.filter(r => r.status === 'FAIL');
            
            if (i < CONFIG.maxIterations) {
                console.log('📝 建议在以下方面进行修复:');
                testResults.errors.forEach(err => {
                    console.log(`   - ${err.name}: ${err.error}`);
                });
            }
        }
    }
    
    // 输出最终结果
    console.log('\n' + '='.repeat(50));
    console.log('📋 Loop Engineering 最终报告');
    console.log('='.repeat(50));
    console.log(`迭代次数: ${testResults.iteration}`);
    console.log(`最终状态: ${testResults.passed ? '✅ 通过' : '❌ 未通过'}`);
    console.log(`测试项: ${testResults.summary?.total || 0}`);
    console.log(`通过: ${testResults.summary?.passed || 0}`);
    console.log(`失败: ${testResults.summary?.failed || 0}`);
    
    if (!testResults.passed && testResults.errors.length > 0) {
        console.log('\n🔧 需要修复的问题:');
        testResults.errors.forEach((err, idx) => {
            console.log(`${idx + 1}. ${err.name}`);
            console.log(`   错误: ${err.error}`);
        });
    }
    
    // 保存测试报告
    const reportPath = path.join(__dirname, 'test_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
    console.log(`\n📄 详细报告已保存: ${reportPath}`);
    
    return testResults;
}

// ==================== 执行入口 ====================

if (require.main === module) {
    loopEngineering().then(results => {
        process.exit(results.passed ? 0 : 1);
    }).catch(err => {
        console.error('💥 Loop Engineering 执行失败:', err);
        process.exit(1);
    });
}

module.exports = { runTests, loopEngineering, TEST_CASES };
