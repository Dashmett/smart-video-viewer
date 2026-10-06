# 开发与验证 / Development and verification

## 自动检查 / Automated checks

在仓库根目录，使用 Node.js 22+，无需安装 npm 依赖。
From the repository root, use Node.js 22+; no npm dependencies are required.

```sh
node scripts/check.mjs
node --test "Smart Video Viewer/tests/background.test.mjs"
```

## Xcode

工程部署目标为 macOS 12.0；本机曾使用 Xcode 27 构建，最低 Xcode/Safari 组合尚未确认。使用支持该工程的 Xcode，先为两个 target 配置自己的签名团队。
The deployment target is macOS 12.0. Local builds used Xcode 27; the minimum Xcode/Safari combination is not verified. Use Xcode capable of opening the project and configure signing for both targets.

```sh
xcodebuild -project "Smart Video Viewer/Smart Open in IINA.xcodeproj"   -scheme "Smart Open in IINA" -configuration Release   -derivedDataPath output/build build
```

仅验证编译可附加 `CODE_SIGNING_ALLOWED=NO`；无签名构建成功不代表 Safari 可以加载。签名与实际启用是独立检查。
For compile-only checks, append `CODE_SIGNING_ALLOWED=NO`. An unsigned build does not establish that Safari can load it. Signing and runtime enablement require separate verification.

## 手动回归 / Manual regression

- 原视频不重载，进入/退出后进度保留；退出恢复原网页样式与倍速。 / Preserve the media element and time; restore page styling and prior rate on exit.
- 横/竖视频、不同窗口比例下居中；留白点击退出，画面点击播放/暂停。 / Center landscape/portrait video at different window ratios; distinguish backdrop and picture clicks.
- 控制台自动隐藏；快进快退不唤出，仅原区域悬停显示；输入框不触发快捷键。 / Check auto-hide, hover-only reveal, shortcut seeking and text-field exclusions.
- 检查 0.1× 步进、跳转秒数、无可跳转范围的直播、静音与恢复。 / Check rate increments, configured seeking, unseekable live media and mute.
- 有权限/无权限的 iframe、blob/MSE 媒体与开放 Shadow DOM。 / Check authorized/unauthorized frames, blob/MSE and open Shadow DOM.
- IINA 请求成功与实际播放分开记录，不使用带凭据的素材反馈。 / Record IINA launch and playback separately; redact credentials.
- 图标查看所有 PNG、浅深背景、实际 Safari 工具栏；遵循确认稿母版目录的说明。 / Inspect every PNG, light/dark backgrounds and the real Safari toolbar; follow the approved-master instructions.

`tests/*-checks.js` 为既有浏览器驱动函数，依赖特定 HTML、媒体素材和消息模拟；这些本地 fixture 未全部入库，不能当作独立 CLI 测试运行，暂未纳入 CI。`tests/serve.mjs` 仅提供 127.0.0.1:8766 测试服务器，不会自动生成 fixture。
The existing `tests/*-checks.js` files are browser-driver functions requiring specific HTML, media and message mocks. Those local fixtures are not fully tracked, so the functions are not standalone CLI tests and are not included in CI. `tests/serve.mjs` only serves local fixtures on 127.0.0.1:8766; it does not generate them.

## GitHub Actions 待启用 / Pending CI activation

配置已保存在 [checks.yml.example](ci/checks.yml.example)。当前 OAuth 连接缺少 workflow 写入权限，因此没有将其放入 `.github/workflows/`，GitHub 不会执行这个模板。
The configuration is stored in [checks.yml.example](ci/checks.yml.example). The current OAuth connection cannot write workflows, so the template is not installed under `.github/workflows/` and GitHub will not run it.

维护者使用具备对应权限的认证方式后，将模板复制到 `.github/workflows/checks.yml`，提交并推送，再确认首次运行成功。是否扩大现有认证权限须单独确认；无需改仓库可见性或开放更多网站权限。
After the maintainer has appropriately authorized workflow access, copy the template to `.github/workflows/checks.yml`, commit and push, and verify the first run. Expanding current authentication permissions needs separate confirmation; changing repository visibility or extension website permissions is unnecessary.
