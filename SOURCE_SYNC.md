# 源码同步记录

- 网站：秘典工坊 · 西幻排版（塔泽里亚大陆）
- 类型：独立网页应用，TypeScript / React；包含正文排版、人物与生物资料、长图导出。
- 本次导入：Sites 已发布第21版。
- 原始源码提交：`63ba417c44e6a9c308f648c09b18749b80cb0db5`。
- 保留 GitHub 原有的 Pages 部署工作流、静态入口、相对资源路径和字体延迟加载修复。
- 第21版新增的生命树、蔷薇1/2、月桂叶素材已一起纳入；字体和授权说明完整保留。

## 本地运行与静态构建

使用 Node.js >=22.13.0 和项目声明的 pnpm 11.25.0。

```sh
pnpm install --frozen-lockfile
pnpm build:pages
```

静态构建输出为 `out/`。仓库原有 GitHub Pages 工作流在 main 更新后执行部署。
Sites 的 Worker 构建入口及 `.openai/hosting.json` 同时保留。

本次仅将源码同步到 GitHub；Sites 原网站继续使用已发布第21版。
