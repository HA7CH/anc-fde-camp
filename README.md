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

正常提交到 `main` 会触发 [GitHub Actions 工作流](.github/workflows/deploy.yml)：安装依赖、测试、从同一份 Markdown 构建网站，并使用 Wrangler 发布现有 `anc-camp` Worker。工作流只发布到 `camp.ha7ch.com`，拉取请求不会部署生产网站，也没有定时任务。

部署使用仓库级 Actions secrets `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID`。令牌只需 Workers Editor 权限；不要把密钥放进源码。工作流串行发布，并在部署前确认本次提交仍是 `main` 最新版本。发布后执行 `npm run verify:live`，对照该次提交检查 Skill、全部引用、许可证、首页和 `release.json`。

## License

MIT. 课程定位、历史案例及人工审核边界见 Skill 和引用正文。
