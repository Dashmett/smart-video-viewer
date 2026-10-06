# 发布检查 / Release checklist

v2.0.6 提供 Apple Silicon 的临时签名、未公证测试包；正式签名发行及异机安装验证仍未完成。下面是每次发布应核对的流程。
v2.0.6 provides an ad-hoc signed, unnotarized Apple Silicon preview. Distribution signing and clean-machine installation remain unverified. Use the following checklist for releases.

1. 确认许可证与所有资源权利；公开前配置私密安全报告渠道。 / Confirm licensing and asset rights; establish private security reporting before going public.
2. 同步 manifest、Xcode marketing/build 版本和更新日志；不要为文档修改无故升级 App 版本。 / Synchronize manifest, Xcode marketing/build versions and changelog; do not bump the app merely for documentation.
3. 运行 Node 检查、Xcode 构建与 Safari 手动回归，逐一检查所有图标导出。 / Run Node checks, Xcode builds, Safari regression checks and inspect every icon export.
4. 确认适合分发的签名与 Apple 当前发行要求；本机开发签名不等于公证或 App Store 审核。 / Verify distribution signing and current Apple requirements; development signing is not notarization or App Store approval.
5. 在干净测试环境验证安装/更新、权限说明和卸载，记录实际测试的系统版本。 / Verify installation/update, permissions and removal in a clean environment; record tested OS versions.
6. 仅对确认提交创建 Git tag，按需创建 Release，附变更说明、适用平台、校验值与实际验证限制。 / Tag the verified commit and create a release as needed, with notes, supported platform, checksums and verification limits.
7. 本仓库按 MIT 公开；发布前检查文件与历史中的凭据和私人数据。源码回退使用 Git；不创建额外本地备份副本。 / This repository is public under MIT; check files and history for credentials and private data before releases. Use Git for source rollback instead of extra local backup copies.

Apple: https://developer.apple.com/documentation/safariservices/distributing-your-safari-web-extension

## 构建测试安装包 / Build preview packages

以下命令创建不含个人开发证书的 arm64 测试包，不会替换已安装 App，也不会更改系统或 Safari 安全设置。
These commands create an arm64 preview without personal development certificates. They do not replace the installed app or change system/Safari security settings.

```sh
xcodebuild -project "Smart Video Viewer/Smart Open in IINA.xcodeproj" \
  -scheme "Smart Open in IINA" -configuration Release \
  -derivedDataPath output/distribution-build -arch arm64 \
  CODE_SIGN_IDENTITY=- CODE_SIGN_STYLE=Manual DEVELOPMENT_TEAM= build
bash scripts/package-preview.sh
```

打包前先提交对应源码，使 BUILD.txt 指向可追溯的提交。输出位于被 Git 忽略的 `release/github-v<version>/`；如目录已存在，脚本拒绝覆盖。不要把此临时签名包当成已公证发行版。
Commit the source before packaging so BUILD.txt identifies the source revision. Output goes to ignored `release/github-v<version>/`; the script refuses to overwrite an existing directory. Do not present an ad-hoc preview as a notarized release.
