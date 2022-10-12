---
title: NPM Binary 镜像配置
date: 2022-02-18T16:00:00.000+00:00
lang: zh
duration: 1min
---

在 NPM 安装 Electron, Puppeteer 等包时，他们会通过 `postinstall` 脚本下载对应的二进制文件。因为一些不得而知的原因这个过程在某些网络下可能会很慢或不可用。你可以复制以下配置至 `.bashrc` 或 `.zshrc` 中，使用 npmmirror.com 提供的二进制镜像。数据来源于 [`binary-mirror-config`](https://github.com/cnpm/binary-mirror-config)。

感谢 [@xiaoxiangmoe](https://github.com/xiaoxiangmoe)，[@Kingwl](https://github.com/Kingwl)。

```bash
# === NPM BINARY CHINA ===
# https://github.com/cnpm/binary-mirror-config/blob/master/package.json#L53
export NODEJS_ORG_MIRROR="https://cdn.npmmirror.com/binaries/node"
export NVM_NODEJS_ORG_MIRROR="https://cdn.npmmirror.com/binaries/node"
export PHANTOMJS_CDNURL="https://cdn.npmmirror.com/binaries/phantomjs"
export CHROMEDRIVER_CDNURL="https://cdn.npmmirror.com/binaries/chromedriver"
export OPERADRIVER_CDNURL="https://cdn.npmmirror.com/binaries/operadriver"
export ELECTRON_MIRROR="https://cdn.npmmirror.com/binaries/electron/"
export ELECTRON_BUILDER_BINARIES_MIRROR="https://cdn.npmmirror.com/binaries/electron-builder-binaries/"
export SASS_BINARY_SITE="https://cdn.npmmirror.com/binaries/node-sass"
export SWC_BINARY_SITE="https://cdn.npmmirror.com/binaries/node-swc"
export NWJS_URLBASE="https://cdn.npmmirror.com/binaries/nwjs/v"
export PUPPETEER_DOWNLOAD_HOST="https://cdn.npmmirror.com/binaries"
export SENTRYCLI_CDNURL="https://cdn.npmmirror.com/binaries/sentry-cli"
export SAUCECTL_INSTALL_BINARY_MIRROR="https://cdn.npmmirror.com/binaries/saucectl"
export npm_config_sharp_binary_host="https://cdn.npmmirror.com/binaries/sharp"
export npm_config_sharp_libvips_binary_host="https://cdn.npmmirror.com/binaries/sharp-libvips"
export npm_config_robotjs_binary_host="https://cdn.npmmirror.com/binaries/robotj"
# For Cypress >=10.6.0, https://docs.cypress.io/guides/references/changelog#10-6-0
export CYPRESS_DOWNLOAD_PATH_TEMPLATE='https://cdn.npmmirror.com/binaries/cypress/${version}/${platform}-${arch}/cypress.zip'
```
