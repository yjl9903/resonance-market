# 雷索纳斯市场 / resonance-market

[![resonance-market](https://img.shields.io/endpoint?url=https://pages.onekuma.cn/project/resonance-market&label=在线访问)](https://resonance.breadio.wiki/)
[![CI](https://github.com/yjl9903/resonance-market/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/resonance-market/actions/workflows/ci.yml)

## 数据上报接口文档

见 [此处](./report.md)

## 本地运行 或 开发测试 / Run locally or Development Test

请确保已安装 [git] 和 [pnpm]。

Please make sure [git] and [pnpm] are installed.

1. 对本项目进行 git clone;

   Perform git clone on this project;

   ```bash
   git clone https://github.com/yjl9903/resonance-market.git
   cd resonance-market
   ```

2. 使用 pnpm 安装依赖;

   Use pnpm to install dependencies;

   ```bash
   pnpm install
   ```

3. 准备开发用的 SQLite 本地数据库（位于：`./sqlite.db`）;

   Prepare development SQLite database;

   ```bash
   pnpm db:prepare:dev
   ```

4. 运行开发服务器;

   Run the development server;

   ```bash
   pnpm run dev
   ```

会在 `http://localhost:3000` 启动开发测试。

Start the development server on `http://localhost:3000`.

## 构建 / Build

本程序是一个 Nuxt 3 应用程序。所以，需自行部署者，可参考 [Nuxt 的部署指南](https://nuxt.com/docs/getting-started/deployment)。总而言之，本程序支持借助 Node.js 在服务器上运行，也可以托管到主流的 Serverless 型的网站托管服务。我们自己选择了后者，可以参考 /.github 的相关 GitHub Actions 流程文件。

This program is a Nuxt 3 application. Therefore, those who need to deploy by themselves can refer to [Nuxt's deployment guide](https://nuxt.com/docs/getting-started/deployment). All in all, this program supports running on the server with Node.js, and can also be hosted on mainstream Serverless website hosting services. We chose the latter ourselves, you can refer to the related GitHub Actions process files in /.github.

```bash
# 构建生产用程序 / Build the application for production
pnpm run build
```

```bash
# 对生产构建进行预览 / Locally preview production build
pnpm run preview
```

## 使用协议 / License

[LICENSE](/LICENSE)

本程序附带 MIT License 开源。使用本程序及其源代码时，请遵守 MIT License。

This program comes with the MIT License.

[git]: https://git-scm.com
[pnpm]: https://pnpm.io
