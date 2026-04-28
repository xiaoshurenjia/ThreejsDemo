# ThreejsDemo

一个面向 three.js 初学者的入门示例项目。  
当前版本实现了一个基础三维场景，加载开源 glTF 贴图模型（DamagedHelmet），并支持旋转、缩放和平移查看。

## 快速开始

### 1) 安装依赖

```bash
npm install
```

### 2) 启动开发环境

```bash
npm run dev
```

启动后在浏览器打开终端中显示的本地地址（通常是 `http://localhost:5173`）。

### 3) 构建生产版本

```bash
npm run build
```

## 交互说明

- 鼠标左键拖动：旋转视角
- 鼠标滚轮：缩放（拉近/拉远）
- 鼠标右键拖动：平移

## 模型说明

- 当前默认模型为 Khronos 官方 glTF Sample Models 的 `DamagedHelmet`（含材质与贴图）
- 模型地址：
  `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf`
- 首次加载依赖网络，请保持可访问外网

## 项目结构

```text
.
├── docs/
│   └── spec-v1.md           # 规格文档（Spec）
├── public/
├── src/
│   ├── main.js              # three.js 场景、glTF模型加载与交互逻辑
│   └── style.css            # 页面样式
├── index.html
└── package.json
```

