# 雷索纳斯市场 / resonance-market

[![resonance-market](https://img.shields.io/endpoint?url=https://pages.onekuma.cn/project/resonance-market&label=在线访问)](https://resonance.breadio.wiki/)
[![CI](https://github.com/yjl9903/resonance-market/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/resonance-market/actions/workflows/ci.yml)

## 本地运行 或 开发测试 / Run locally or Development Test

请确保已安装 [git] 和 [pnpm]。

Please make sure [git] and [pnpm] are installed.

1. 对本项目进行 git clone。（请注意，git clone下来的程序并不会自动更新，如需长期做本地运行或自行部署，请自行做定期或不定期的git clone，以获取最新版本）

   Perform git clone on this project. (Please note that the program downloaded by git clone will not be automatically updated. If you need to run it locally for a long time or deploy it yourself, please do regular or irregular git clone yourself to get the latest version)

   ```bash
   git clone https://github.com/yjl9903/resonance-market.git
   cd resonance-market
   ```

2. 使用 pnpm 安装依赖。

   Use pnpm to install dependencies.

   ```bash
   pnpm install
   ```

3. 运行开发测试。

   Run the development test.

   ```bash
   pnpm run dev
   ```

会在 `http://localhost:3000` 启动开发测试。普通用户此时可以在确保网络条件适合的情况下直接使用（在本地运行时，对商家网站的内容请求由运行程序的电脑发出，而不是我们的服务器）。其他开发者可在调整代码后“实时”地查看效果。

Start the development server on `http://localhost:3000`. Ordinary users can use it directly at this time after ensuring that the network conditions are suitable (when running locally, content requests for merchant websites are issued by the computer running the program, not our server). Other developers can adjust the code and see the effects "in real time".

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
