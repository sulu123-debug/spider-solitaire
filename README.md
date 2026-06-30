# 🎮 小游戏合集

一个包含多种经典小游戏的 HTML5 网页游戏合集，支持桌面和移动设备。

## 📁 项目结构

```
spider_solitaire/
├── index.html                      # 游戏首页
├── README.md                       # 项目说明
│
├── spider_solitaire/               # 🕷️ 蜘蛛纸牌
│   └── index.html
│
├── sudoku/                         # 🔢 数独
│   └── index.html
│
├── minesweeper/                    # 🚩 扫雷
│   └── index.html
│
├── finddiff/                       # 🔍 找不同
│   ├── index.html                # 原版
│   └── v2.html                   # Vant UI 精美版
│
├── loop_engineering/              # 🔁 自动化测试框架
│   ├── index.js                  # 测试主入口
│   ├── tests/                    # 测试脚本
│   │   ├── test_finddiff.js
│   │   ├── test_static_analysis.js
│   │   └── test_browser_simulation.js
│   └── reports/                  # 测试报告
│
└── shared/                        # 共享资源
    ├── css/
    ├── js/
    └── assets/
```

## 🎲 游戏列表

| 游戏 | 文件路径 | 说明 |
|-----|---------|------|
| 蜘蛛纸牌 | `spider_solitaire/index.html` | 经典 Windows 纸牌游戏，支持1/2/4花色难度 |
| 数独 | `sudoku/index.html` | 9x9 数字益智游戏，简单到专家难度 |
| 扫雷 | `minesweeper/index.html` | 经典 Windows 扫雷，三个难度级别 |
| 找不同 | `finddiff/v2.html` | 精美版找不同，多主题多关卡 |

## 🚀 快速开始

### 本地运行

直接在浏览器中打开 `index.html` 即可：

```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

### 部署到 GitHub Pages

1. 将项目推送到 GitHub 仓库
2. 进入 Settings → Pages
3. 选择 Source 为 Deploy from a branch
4. 选择 main 分支和 root 目录
5. 保存后即可访问 `https://<username>.github.io/<repo>/`

## 🧪 自动化测试

项目包含完整的 Loop Engineering 自动化测试框架：

### 运行测试

```bash
# 完整测试（包含子测试脚本）
node loop_engineering/index.js

# 快速模式（跳过子测试脚本）
node loop_engineering/index.js --quick

# 仅验证目录结构
node loop_engineering/index.js --structure

# 测试指定游戏
node loop_engineering/index.js --game finddiff
```

### 测试内容

- **目录结构验证**: 检查文件组织是否符合规范
- **链接有效性**: 验证首页链接指向正确
- **游戏功能测试**: 验证各游戏核心功能完整
  - 蜘蛛纸牌: HTML结构、返回链接
  - 数独: HTML结构、返回链接
  - 扫雷: HTML结构、返回链接
  - 找不同: 差异点生成、图片加载、功能按钮

## 🎯 找不同 V2 特性

- **多主题系统**: 电影、水果、自然、动物、美食、运动
- **关卡系统**: 每主题10关，难度递增
- **差异点数量**: 关卡1-3有3处，4-6有4处，7+有5处
- **功能按钮**: 💡提示、⏱️加时、🔍放大
- **精美UI**: 使用 Vant UI 组件库
- **庆祝动画**: 通关时 Confetti 动画效果

## 📝 技术栈

- **前端**: 纯 HTML5 + CSS3 + JavaScript
- **UI库**: Vant 4 (找不同V2)
- **动画**: Canvas Confetti
- **图片**: Picsum Photos API
- **测试**: Node.js 自动化测试框架

## 📄 文件说明

### 游戏文件
- `spider_solitaire/index.html` - 蜘蛛纸牌游戏 (64KB)
- `sudoku/index.html` - 数独游戏 (24KB)
- `minesweeper/index.html` - 扫雷游戏 (23KB)
- `finddiff/index.html` - 找不同原版 (48KB)
- `finddiff/v2.html` - 找不同精美版 (32KB)

### 测试文件
- `loop_engineering/index.js` - 测试框架主入口
- `loop_engineering/tests/test_finddiff.js` - 找不同基础测试
- `loop_engineering/tests/test_static_analysis.js` - 静态代码分析
- `loop_engineering/tests/test_browser_simulation.js` - 浏览器模拟测试

## ✅ 测试状态

**最新测试结果**: 100% 通过 (38/38 项)

- ✅ 目录结构: 11/11
- ✅ 链接有效性: 4/4
- ✅ 蜘蛛纸牌: 3/3
- ✅ 数独: 3/3
- ✅ 扫雷: 3/3
- ✅ 找不同: 14/14

## 🔧 开发计划

- [ ] 添加更多游戏主题
- [ ] 实现本地存储保存进度
- [ ] 添加排行榜功能
- [ ] 支持多语言

## 📜 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**使用 Loop Engineering 构建和验证** 🔁
# SSH Test
