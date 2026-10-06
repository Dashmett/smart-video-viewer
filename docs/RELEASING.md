# 发布检查 / Release checklist

当前没有对外发布的签名安装包；下面是将来的发布流程，不是已完成声明。
There is currently no distributed signed installer. This is a future release checklist, not a completion claim.

1. 确认许可证与所有资源权利；公开前配置私密安全报告渠道。 / Confirm licensing and asset rights; establish private security reporting before going public.
2. 同步 manifest、Xcode marketing/build 版本和更新日志；不要为文档修改无故升级 App 版本。 / Synchronize manifest, Xcode marketing/build versions and changelog; do not bump the app merely for documentation.
3. 运行 Node 检查、Xcode 构建与 Safari 手动回归，逐一检查所有图标导出。 / Run Node checks, Xcode builds, Safari regression checks and inspect every icon export.
4. 确认适合分发的签名与 Apple 当前发行要求；本机开发签名不等于公证或 App Store 审核。 / Verify distribution signing and current Apple requirements; development signing is not notarization or App Store approval.
5. 在干净测试环境验证安装/更新、权限说明和卸载，记录实际测试的系统版本。 / Verify installation/update, permissions and removal in a clean environment; record tested OS versions.
6. 仅对确认提交创建 Git tag，按需创建 Release，附变更说明、适用平台、校验值与实际验证限制。 / Tag the verified commit and create a release as needed, with notes, supported platform, checksums and verification limits.
7. 本仓库按 MIT 公开；发布前检查文件与历史中的凭据和私人数据。源码回退使用 Git；不创建额外本地备份副本。 / This repository is public under MIT; check files and history for credentials and private data before releases. Use Git for source rollback instead of extra local backup copies.

Apple: https://developer.apple.com/documentation/safariservices/distributing-your-safari-web-extension
