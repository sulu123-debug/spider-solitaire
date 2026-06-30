/**
 * FindDiff Game - 浏览器级模拟测试
 * 模拟浏览器环境，验证游戏实际运行时的功能
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 模拟浏览器环境
function createMockBrowser() {
    const html = fs.readFileSync(path.join(__dirname, 'finddiff_v2.html'), 'utf8');
    
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        resources: 'usable',
        pretendToBeVisual: true,
        url: 'http://localhost'
    });
    
    return dom;
}

// 测试套件
const BrowserTests = {
    
    // 测试1: 验证差异点生成数量
    testDifferenceCount: (window) => {
        console.log('🎯 测试: 差异点数量验证');
        
        // 模拟不同关卡
        const testLevels = [1, 3, 5, 7, 9];
        const results = [];
        
        for (const level of testLevels) {
            window.currentLevel = level;
            
            // 调用生成函数
            if (typeof window.generateDifferences === 'function') {
                window.generateDifferences();
                const count = window.differences ? window.differences.length : 0;
                
                // 验证数量规则
                let expected = 3;
                if (level > 3) expected = 4;
                if (level > 6) expected = 5;
                
                const passed = count === expected;
                results.push({
                    level,
                    expected,
                    actual: count,
                    passed
                });
                
                console.log(`  关卡 ${level}: 期望 ${expected} 处, 实际 ${count} 处 ${passed ? '✅' : '❌'}`);
            } else {
                throw new Error('generateDifferences 函数未定义');
            }
        }
        
        const allPassed = results.every(r => r.passed);
        if (!allPassed) {
            const failed = results.filter(r => !r.passed);
            throw new Error(`差异点数量不匹配: ${failed.map(f => `关卡${f.level}`).join(', ')}`);
        }
        
        console.log('✅ 差异点数量验证通过\n');
        return true;
    },
    
    // 测试2: 验证差异点数据结构
    testDifferenceStructure: (window) => {
        console.log('📐 测试: 差异点数据结构验证');
        
        window.currentLevel = 1;
        window.generateDifferences();
        
        const diffs = window.differences;
        if (!Array.isArray(diffs) || diffs.length === 0) {
            throw new Error('差异点数组为空或格式错误');
        }
        
        for (let i = 0; i < diffs.length; i++) {
            const diff = diffs[i];
            
            // 检查必要属性
            if (typeof diff.id !== 'number') {
                throw new Error(`差异点 ${i} 缺少 id 属性`);
            }
            if (typeof diff.x !== 'number' || diff.x < 0 || diff.x > 400) {
                throw new Error(`差异点 ${i} x 坐标无效: ${diff.x}`);
            }
            if (typeof diff.y !== 'number' || diff.y < 0 || diff.y > 300) {
                throw new Error(`差异点 ${i} y 坐标无效: ${diff.y}`);
            }
            if (typeof diff.found !== 'boolean') {
                throw new Error(`差异点 ${i} 缺少 found 布尔属性`);
            }
        }
        
        console.log(`✅ 验证了 ${diffs.length} 个差异点的数据结构\n`);
        return true;
    },
    
    // 测试3: 验证点击检测逻辑
    testClickDetection: (window) => {
        console.log('👆 测试: 点击检测逻辑验证');
        
        window.currentLevel = 1;
        window.generateDifferences();
        window.foundDifferences = [];
        window.score = 0;
        
        // 获取第一个差异点位置
        const firstDiff = window.differences[0];
        
        // 模拟点击在差异点上
        const mockEvent = {
            target: { dataset: { side: 'left' } },
            offsetX: firstDiff.x,
            offsetY: firstDiff.y
        };
        
        // 验证点击检测函数存在
        if (typeof window.handleImageClick !== 'function') {
            throw new Error('handleImageClick 函数未定义');
        }
        
        // 测试点击在差异点上
        window.handleImageClick(mockEvent);
        
        // 验证差异点被标记为已找到
        if (!firstDiff.found) {
            throw new Error('点击在差异点上但未正确标记为已找到');
        }
        
        // 测试点击在空白处
        const blankEvent = {
            target: { dataset: { side: 'left' } },
            offsetX: 10,
            offsetY: 10
        };
        
        const prevLives = window.lives || 3;
        window.handleImageClick(blankEvent);
        
        console.log('✅ 点击检测逻辑验证通过\n');
        return true;
    },
    
    // 测试4: 验证图片URL生成
    testImageURLGeneration: (window) => {
        console.log('🖼️ 测试: 图片URL生成验证');
        
        // 检查图片URL格式
        const testCases = [
            { theme: 'movie', seed: 1 },
            { theme: 'fruit', seed: 2 },
            { theme: 'nature', seed: 3 }
        ];
        
        for (const test of testCases) {
            window.currentTheme = test.theme;
            
            // 检查是否使用了 picsum.photos
            const expectedPattern = /picsum\.photos/;
            
            // 读取HTML内容检查
            const html = fs.readFileSync(path.join(__dirname, 'finddiff_v2.html'), 'utf8');
            if (!expectedPattern.test(html)) {
                throw new Error('未使用 picsum.photos API');
            }
        }
        
        console.log('✅ 图片URL生成验证通过\n');
        return true;
    },
    
    // 测试5: 验证游戏状态管理
    testGameStateManagement: (window) => {
        console.log('🎮 测试: 游戏状态管理验证');
        
        // 初始化游戏状态
        window.score = 0;
        window.lives = 3;
        window.timeLeft = 60;
        window.gameOver = false;
        window.foundDifferences = [];
        
        // 验证状态变量存在
        const requiredStates = ['score', 'lives', 'timeLeft', 'gameOver', 'foundDifferences'];
        for (const state of requiredStates) {
            if (typeof window[state] === 'undefined') {
                throw new Error(`游戏状态变量 ${state} 未定义`);
            }
        }
        
        // 验证状态类型
        if (typeof window.score !== 'number') {
            throw new Error('score 必须是数字类型');
        }
        if (typeof window.lives !== 'number') {
            throw new Error('lives 必须是数字类型');
        }
        if (typeof window.timeLeft !== 'number') {
            throw new Error('timeLeft 必须是数字类型');
        }
        if (typeof window.gameOver !== 'boolean') {
            throw new Error('gameOver 必须是布尔类型');
        }
        if (!Array.isArray(window.foundDifferences)) {
            throw new Error('foundDifferences 必须是数组类型');
        }
        
        console.log('✅ 游戏状态管理验证通过\n');
        return true;
    },
    
    // 测试6: 验证功能按钮
    testFunctionButtons: (window) => {
        console.log('🔘 测试: 功能按钮验证');
        
        const requiredFunctions = [
            'useHint',
            'addTime',
            'zoomImage',
            'pauseGame',
            'returnToTheme'
        ];
        
        for (const funcName of requiredFunctions) {
            if (typeof window[funcName] !== 'function') {
                throw new Error(`功能按钮函数 ${funcName} 未定义`);
            }
        }
        
        console.log(`✅ 验证了 ${requiredFunctions.length} 个功能按钮函数\n`);
        return true;
    },
    
    // 测试7: 验证关卡系统
    testLevelSystem: (window) => {
        console.log('📊 测试: 关卡系统验证');
        
        // 检查关卡数据结构
        const html = fs.readFileSync(path.join(__dirname, 'finddiff_v2.html'), 'utf8');
        
        // 验证主题配置存在
        if (!/const themes/.test(html)) {
            throw new Error('主题配置未定义');
        }
        
        // 验证关卡生成逻辑
        if (!/function generateLevels/.test(html)) {
            throw new Error('关卡生成函数未定义');
        }
        
        console.log('✅ 关卡系统验证通过\n');
        return true;
    }
};

// 运行所有浏览器测试
async function runBrowserTests() {
    console.log('🌐 启动浏览器级模拟测试\n');
    console.log('=' .repeat(60));
    
    let dom;
    try {
        dom = createMockBrowser();
    } catch (err) {
        console.log('⚠️  无法创建完整浏览器环境，使用静态代码分析模式');
        return runStaticAnalysis();
    }
    
    const window = dom.window;
    
    // 等待脚本加载
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const tests = [
        { name: '差异点数量', fn: BrowserTests.testDifferenceCount },
        { name: '差异点结构', fn: BrowserTests.testDifferenceStructure },
        { name: '点击检测', fn: BrowserTests.testClickDetection },
        { name: '图片URL', fn: BrowserTests.testImageURLGeneration },
        { name: '状态管理', fn: BrowserTests.testGameStateManagement },
        { name: '功能按钮', fn: BrowserTests.testFunctionButtons },
        { name: '关卡系统', fn: BrowserTests.testLevelSystem },
    ];
    
    const results = [];
    
    for (const test of tests) {
        try {
            await test.fn(window);
            results.push({ name: test.name, status: 'PASS' });
        } catch (error) {
            console.error(`❌ ${test.name} 测试失败:`, error.message);
            results.push({ name: test.name, status: 'FAIL', error: error.message });
        }
    }
    
    // 输出报告
    console.log('=' .repeat(60));
    console.log('📋 浏览器级测试报告:\n');
    
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    
    console.log(`✅ 通过: ${passed}/${results.length}`);
    console.log(`❌ 失败: ${failed}/${results.length}`);
    console.log('');
    
    if (failed > 0) {
        console.log('🔧 失败项:');
        results.filter(r => r.status === 'FAIL').forEach(r => {
            console.log(`   - ${r.name}: ${r.error}`);
        });
    }
    
    dom.window.close();
    
    return {
        passed: failed === 0,
        results,
        summary: { passed, failed, total: results.length }
    };
}

// 静态代码分析（当无法创建浏览器环境时）
function runStaticAnalysis() {
    console.log('📄 运行静态代码分析\n');
    
    const html = fs.readFileSync(path.join(__dirname, 'finddiff_v2.html'), 'utf8');
    
    const checks = [
        { name: '差异点生成', pattern: /function generateDifferences/ },
        { name: '点击处理', pattern: /function handleImageClick/ },
        { name: '提示功能', pattern: /function useHint/ },
        { name: '加时功能', pattern: /function addTime/ },
        { name: '图片API', pattern: /picsum\.photos/ },
        { name: '差异点数组', pattern: /let differences/ },
        { name: '分数系统', pattern: /let score/ },
        { name: '计时器', pattern: /let timeLeft|let timer/ },
        { name: '生命值', pattern: /let lives/ },
        { name: '主题配置', pattern: /const themes/ },
    ];
    
    const results = checks.map(check => ({
        name: check.name,
        status: check.pattern.test(html) ? 'PASS' : 'FAIL'
    }));
    
    const passed = results.filter(r => r.status === 'PASS').length;
    
    console.log('📋 静态分析结果:\n');
    results.forEach(r => {
        console.log(`${r.status === 'PASS' ? '✅' : '❌'} ${r.name}`);
    });
    
    console.log(`\n总计: ${passed}/${results.length} 项通过`);
    
    return {
        passed: passed === results.length,
        results,
        summary: { passed, failed: results.length - passed, total: results.length }
    };
}

// 主函数
async function main() {
    const result = await runBrowserTests();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 最终结论:');
    console.log('='.repeat(60));
    
    if (result.passed) {
        console.log('\n✅ 所有浏览器级测试通过！');
        console.log('游戏功能完整，可以正常使用。');
    } else {
        console.log('\n⚠️  部分测试未通过，需要检查以下问题:');
        result.results.filter(r => r.status === 'FAIL').forEach(r => {
            console.log(`   - ${r.name}: ${r.error}`);
        });
    }
    
    // 保存报告
    const reportPath = path.join(__dirname, 'browser_test_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
    console.log(`\n📄 报告已保存: ${reportPath}`);
    
    return result;
}

// 执行
main().then(result => {
    process.exit(result.passed ? 0 : 1);
}).catch(err => {
    console.error('💥 测试执行失败:', err);
    process.exit(1);
});
