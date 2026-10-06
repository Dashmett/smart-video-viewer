# 贡献指南 / Contributing

## 中文

提交前先阅读 README、AGENTS.md 与[开发指南](docs/DEVELOPMENT.md)。本项目采用 [MIT 许可证](LICENSE)。提交贡献前，请确保你有权提交相关代码与资源，并同意贡献按同一许可证发布。

- Bug 请使用问题模板，提供版本、最小复现步骤与预期/实际结果。网址和日志必须移除令牌、Cookie、账号信息及带签名的媒体链接。
- 功能建议先说明使用场景；较大的行为或视觉调整先提交提案。图标与界面修改需附实际尺寸、浅色/深色对比，不能只交放大稿。
- PR 聚焦一个问题，保留无关设置。不要提交 output、release、用户 Xcode 配置、证书或本地备份。
- 运行 `node scripts/check.mjs` 与 `node --test "Smart Video Viewer/tests/background.test.mjs"`；涉及原生代码时还需构建，交互变化需实测 Safari。无法完成的检查如实注明。
- 不在本任务中自行扩大网站权限、加入遥测或改变授权条款。

## English

Read the README, AGENTS.md and [development guide](docs/DEVELOPMENT.md) first. This project uses the [MIT License](LICENSE). Submit only code and assets you have the right to contribute, and agree to license your contributions under the same terms.

- Use issue templates and include versions, minimal reproduction steps, and expected/actual behavior. Remove tokens, cookies, account details and signed media URLs.
- Explain the use case before substantial feature or visual changes. Include actual-size light/dark previews for icon or UI changes.
- Keep each PR focused. Exclude build output, releases, personal Xcode state, certificates and backup copies.
- Run both Node checks above, build native changes, and verify interaction changes in real Safari. State any checks you could not perform.
- Do not broaden permissions, add telemetry or change licensing incidentally.
