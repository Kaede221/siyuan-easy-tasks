# Siyuan Easy Tasks

<div align="center">

一个简洁高效的思源笔记任务管理插件

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Kaede221/siyuan-easy-tasks/blob/main/LICENSE)
</div>

## ✨ 功能特性

- 📝 **快速添加任务** - 从笔记块或选中文本快速创建待办任务
- ✅ **任务状态管理** - 轻松标记任务完成/未完成状态
- 🔍 **智能搜索** - 支持关键词搜索，快速定位任务
- 🔗 **双向关联** - 任务与笔记块关联，一键跳转到原文
- 📋 **分类查看** - 支持查看全部任务、待完成、已完成任务
- 📝 **任务编辑** - 支持编辑任务内容和添加备注
- 🗑️ **批量操作** - 一键清空所有已完成任务
- 🌐 **国际化支持** - 支持中文和英文界面
- 🎨 **主题适配** - 完美适配思源笔记主题样式

## 📦 安装

### 方式一：集市安装（推荐）

1. 打开思源笔记
2. 进入 `设置` → `集市` → `插件`
3. 搜索 "Easy Tasks"
4. 点击安装

### 方式二：手动安装

1. 从 [Releases](https://github.com/Kaede221/siyuan-easy-tasks/releases) 下载最新版本
2. 解压到思源笔记的 `data/plugins/` 目录
3. 重启思源笔记
4. 在 `设置` → `插件` 中启用插件

## 🚀 使用方法

### 添加任务

#### 方法一：从笔记块添加
1. 在笔记中，点击任意块的块标图标
2. 在弹出菜单中选择 `添加到待办`
3. 任务将自动添加到任务列表

#### 方法二：从选中文本添加
1. 在笔记中选中任意文本
2. 右键点击选中的文本
3. 在弹出菜单中选择 `添加到待办`

#### 方法三：手动添加
1. 点击顶部栏的任务图标打开任务面板
2. 在输入框中输入任务内容
3. 按回车键或点击添加按钮

### 管理任务

- **查看任务**：点击顶部栏的任务图标打开任务面板
- **完成任务**：点击任务前的复选框标记为已完成
- **编辑任务**：点击任务的编辑按钮修改内容或添加备注
- **删除任务**：点击任务的删除按钮
- **跳转原文**：点击任务的跳转按钮（仅限从笔记块添加的任务）
- **搜索任务**：在搜索框中输入关键词过滤任务
- **筛选任务**：使用标签页切换查看全部/待完成/已完成任务
- **批量删除**：点击 `清空已完成` 按钮删除所有已完成任务

## 🛠️ 开发

### 环境要求

- Node.js >= 16
- pnpm >= 8

### 开发流程

1. 克隆仓库
```bash
git clone https://github.com/Wetoria/siyuan-easy-tasks.git
cd siyuan-easy-tasks
```

2. 安装依赖
```bash
pnpm install
```

3. 配置开发环境
```bash
cp .env.example .env
# 编辑 .env 文件，设置思源笔记插件目录路径
```

4. 启动开发模式
```bash
pnpm dev
```

5. 构建生产版本
```bash
pnpm build
```

### 发布版本

```bash
# 手动指定版本号
pnpm release:manual

# 自动升级补丁版本 (0.0.1 -> 0.0.2)
pnpm release:patch

# 自动升级次版本 (0.0.1 -> 0.1.0)
pnpm release:minor

# 自动升级主版本 (0.0.1 -> 1.0.0)
pnpm release:major
```

## 📁 项目结构

```
siyuan-easy-tasks/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── SiyuanTheme/    # 思源主题组件
│   │   └── Todo/           # 任务管理组件
│   ├── services/           # 业务逻辑服务
│   │   ├── StorageService.ts   # 数据存储服务
│   │   └── TaskManager.ts      # 任务管理服务
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   ├── i18n/               # 国际化文件
│   ├── api.ts              # 思源 API 封装
│   ├── index.ts            # 插件入口
│   └── App.vue             # 主应用组件
├── plugin.json             # 插件配置
├── package.json            # 项目配置
└── vite.config.ts          # Vite 配置
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 [MIT](https://github.com/Kaede221/siyuan-easy-tasks/blob/main/LICENSE) 许可证。

## 🙏 致谢

- [思源笔记](https://b3log.org/siyuan/) - 优秀的本地知识管理系统
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

## 📮 联系方式

- GitHub: [@Kaede221](https://github.com/Kaede221)
- 项目地址: [siyuan-easy-tasks](https://github.com/Kaede221/siyuan-easy-tasks)

---

<div align="center">

如果这个插件对你有帮助，欢迎 ⭐ Star 支持一下！

</div>
