# 源码同步记录

- 网站：秘典工坊 · 西幻排版（塔泽里亚大陆）
- 类型：独立网页应用，TypeScript / React；包含正文排版、人物与生物资料、长图导出。
- 本次导入：Sites 第22版纹样更新。
- 原始源码提交：`82ccd4654483f131bac758cd886d10d62d888181`。
- 保留 GitHub 原有的 Pages 部署工作流、静态入口、相对资源路径和字体延迟加载修复。
- 保留第21版的生命树、蔷薇1/2、月桂叶；新增八芒星1/2及外围菱形差分、三个组织地域底纹。七张原图和七张透明调色蒙版完整纳入。字体和授权说明完整保留。

## 本地运行与静态构建

使用 Node.js >=22.13.0 和项目声明的 pnpm 11.25.0。

```sh
pnpm install --frozen-lockfile
pnpm build:pages
```

静态构建输出为 `out/`。仓库原有 GitHub Pages 工作流在 main 更新后执行部署。
Sites 的 Worker 构建入口及 `.openai/hosting.json` 同时保留。

本次同时更新 Sites 原网站和 GitHub。32项测试、类型检查、Worker 构建与 Pages 静态构建通过。本地浏览器无法连接预览服务，因此手机端视觉交互尚未实测。
