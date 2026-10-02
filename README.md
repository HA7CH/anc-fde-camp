# ANC Camp

ANC Camp（旧称 FDE Camp）的公开咨询介绍 Skill。下一场为上海 2026年10月17–18日，每天10:00–18:00，12,800元/人；场地及具体报名条款待公布。报名及付款请私信 Lawted，微信 `lawted` 沟通。AI 对话不提交报名、不保留名额，网站不接支付系统。

- 官网：https://camp.ha7ch.com/
- Skill：https://camp.ha7ch.com/SKILL.md
- 课程原文：[references/program.md](references/program.md)

把 Skill 网址交给 Agent，要求读取正文及引用后讨论课程与个人适合程度。也可通过兼容工具安装本仓库的 `anc-camp` Skill。旧 FDE Camp 名称保留为主题别名。

## 唯一维护源

只修改根目录 `SKILL.md` 和 `references/*.md`，不维护另一套网站正文。`site/index.html` 仅保存首页模板；场次及课程内容直接从 `references/program.md` 渲染。`npm run build` 将原始 Markdown 原样复制到 `dist`，并生成首页。`dist` 不入库，不手工修改。

```sh
npm ci
npm test
npm run build
npx wrangler deploy --dry-run
```

## 提交触发发布

计划使用现有 `anc-camp` Worker 的 Cloudflare Workers Builds Git 集成：仓库 `HA7CH/anc-fde-camp`，生产分支 `main`，根目录 `/`，构建命令 `npm test && npm run build`，部署命令 `npx wrangler deploy`。只绑定 `camp.ha7ch.com`。不使用定时任务。Git 连接需在 Cloudflare 中实际启用；单独提交此配置并不会自动创建连接。

集成启用后正常提交至 main 触发部署；拉取请求用于审查与本地验证，不向生产域名发布。发布后对该次提交运行 `npm run build && npm run verify:live`，确认 Skill、全部引用、许可证和首页与该提交一致。Cloudflare Builds 应同时显示对应的 Git 提交和成功部署记录。

当前状态：单源构建及部署配置已备妥。Cloudflare Builds 创建 Git 连接返回认证错误（10000），提交自动部署尚未启用。当前版本由维护者从已提交源码手动部署；`release.json` 记录该次构建的 Git 提交与公开文件哈希，不能把它当作自动触发证据。恢复 Builds 连接后按以上设置启用，并通过一次正常提交核验触发记录与公网内容。

[Cloudflare Workers Builds 配置说明](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)

## License

MIT. 课程定位、历史案例及人工审核边界见 Skill 和引用正文。
