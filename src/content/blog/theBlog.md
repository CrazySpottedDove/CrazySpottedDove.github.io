---
title: 如何使用 Astro 模板 cojocarudavid.me
description: 仅仅是记录一下如何使用这个模板而已。
pubDate: 2025-02-06
updatedDate: 2025-02-06
tags: ["astro","template","blog"]
category: "瞎折腾"
---

## 处理 Blog 配置文件与相关文件

修改 `/src/content/config.ts` 如下：

```typescript
import { defineCollection, z} from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string().max(80).min(0),
      description: z.string().max(220).min(0),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
      tags: z.array(z.string()),
    }),
});

export const collections = {
  blog: blogCollection,
};
```

修改 `/src/layouts/BlogLayout.astro` 如下：

```astro
---
import AppLayout from "@layouts/AppLayout.astro";
import Pagination from "@components/Pagination.astro";
import { Image } from "astro:assets";
import authorImage from "../assets/me.jpg";
import { author, tag } from "@data/socials";

interface Props {
 title: string;
 description: string;
 pubDate: Date;
 url: string;
 updatedDate: Date | undefined;
 tags: string[];
}

const { title, description, pubDate, url, updatedDate, tags } = Astro.props;

const ogImage = {
 src: `/image/${url}.png`,
 alt: title,
};

const fullPubDate = pubDate.toLocaleDateString("en", {
 dateStyle: "full",
});
---

<AppLayout
 title={title}
 description={description}
 ogImage={ogImage}
 pubDate={updatedDate ?? pubDate}
 tags={tags}
>
 <header class="flex flex-col mb-8">
  <h1
   class="text-2xl sm:text-4xl pb-8 font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-400"
  >
   {title}
  </h1>
  <div
   class="inline-flex items-center mb-8 justify-between align-middle flex-wrap gap-2"
  >
   <time
    datetime={pubDate.toISOString()}
    class="block text-center dark:text-zinc-400 text-zinc-600 mb-4 text-sm sm:text-base"
   >
    {fullPubDate}
   </time>
   <div class="flex items-center gap-4">
    <div class="aspect-square rounded-full overflow-hidden">
     <Image
      src={authorImage}
      alt="Image of the author"
      loading="eager"
      class="aspect-square w-10"
      width={80}
      height={80}
     />
    </div>
    <p class="dark:text-zinc-400 text-zinc-700 text-sm">
     <span class="block font-semibold">{author}</span>
     <a
      class="dark:text-blue-400 text-blue-600 hover:underline block"
      href="https://github.com/CrazySpottedDove"
      target="_blank"
      rel="noopener noreferrer"
      >{tag}
     </a>
    </p>
   </div>
  </div>
 </header>
 <article
  class="prose dark:prose-invert lg:prose-lg dark:prose-code:text-zinc-300 dark:prose-a:text-blue-400 prose-a:text-blue-600 max-w-none hover:prose-a:underline focus:prose-a:underline prose-a:no-underline dark:prose-headings:text-teal-500 prose-img:rounded-lg"
 >
  <slot />
 </article>
 <Pagination />
</AppLayout>
```

修改 `/src/pages/blog/index.astro` 如下：

```astro
---
import AppLayout from "@layouts/AppLayout.astro";
import BlogCard from "@components/BlogCard.astro";
import Header from "@components/Header.astro";
import { getCollection } from "astro:content";

const posts = (await getCollection("blog")).sort(
 (a, _) => new Date() - new Date(a.data.pubDate),
);

const title = "CrazySpottedDove - Blog";
const description =
 "我不擅长写 Blog，这里写的东西基本都是自己看的。如果你对我很感兴趣，也可以随便看看。";
---

<AppLayout
 title={title}
 description={description}
>
 <Header title="Blog" />
 <p
  class="max-w-prose mb-10 font-normal dark:text-zinc-400 text-zinc-600 leading-relaxed"
 >
  {description}
 </p>
 <ul class="space-y-8">
  {
   posts.map((post) => (
    <BlogCard
     title={post.data.title}
     pubDate={post.data.pubDate}
     description={post.data.description}
     url={`/blog/${post.slug}/`}
     tags={post.data.tags}
    />
   ))
  }
 </ul>
</AppLayout>
```

## Blog 文件位置与规范

在 `/src/content/blog/` 内添加 `.md` 文件，并确保文件的开头有如下的说明块：

```md
---
title: 如何使用 Astro 模板 cojocarudavid.me
description: 仅仅是记录一下如何使用这个模板而已。
pubDate: 2025-02-06
updatedDate: 2025-02-06
tags: ["web", "mobile", "optimization", "best practices", "website", "development"]
---
```

## 编辑 Projects

Project 的主文件为 `/src/pages/projects.astro`。至于想要修改项目卡片元数据，则需要修改 `/src/data/contributions.json` 文件。

## 导航栏

请编辑 `/src/data/navigation.json`。

## 删除 Footer

在 `/src/layouts/AppLayout.astro` 中删去与 `Footer` 有关内容。同时，可以在本文件中修改一些网页元数据。

## 修改个人信息

在 `/src/data/social.ts` 中修改有关信息。

## 添加工作流文件

创建 `/.github/workflows/deploy.yml`，内容为

```yml
name: Deploy to GitHub Pages

on:
  # 每次推送到 `main` 分支时触发这个“工作流程”
  # 如果你使用了别的分支名，请按需将 `main` 替换成你的分支名
  push:
    branches: [ main ]
  # 允许你在 GitHub 上的 Actions 标签中手动触发此“工作流程”
  workflow_dispatch:

# 允许 job 克隆 repo 并创建一个 page deployment
permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository using git
        uses: actions/checkout@v4
      - name: Install, build, and upload your site
        uses: withastro/action@v3
        with:
          path: . # 存储库中 Astro 项目的根位置。（可选）
          node-version: 23.7.0 # 用于构建站点的特定 Node.js 版本，默认为 20。（可选）
          package-manager: npm@latest # 应使用哪个 Node.js 包管理器来安装依赖项和构建站点。会根据存储库中的 lockfile 自动检测。（可选）

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

注：这是网页为 `https://<user-name>.github.io` 时的情况，其余情况可能有所不同，需要对 `astro.config.mjs` 进行额外配置
