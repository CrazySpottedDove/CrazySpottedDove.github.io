import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import InterRegular from '@fontsource/inter/files/inter-latin-400-normal.woff';
import InterBold from '@fontsource/inter/files/inter-latin-700-normal.woff';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

const dimensions = {
  width: 1200,
  height: 630,
};

interface Props {
  title: string;
  pubDate: Date;
  description: string;
  tags: string[];
}

export async function GET(context: APIContext) {
  const { title, pubDate, description, tags } = context.props as Props;
  const date = pubDate.toLocaleDateString('en-US', { dateStyle: 'full' });

  const markup = html`
    <div tw="bg-zinc-900 flex flex-col w-full h-full rounded-lg overflow-hidden shadow-lg text-white border border-zinc-700/50 divide-y divide-zinc-700/50 divide-solid">

      

    </div>
  `;

  const svg = await satori(markup, {
    fonts: [
      {
        name: 'Inter',
        data: Buffer.from(InterRegular),
        weight: 400,
      },
      {
        name: 'Inter',
        data: Buffer.from(InterBold),
        weight: 700,
      },
    ],
    height: dimensions.height,
    width: dimensions.width,
  });

  const image = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: dimensions.width
    },
  }).render();

  return new Response(image.asPng(), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': image.asPng().length.toString(),
      'Surrogate-Key': tags.join(' '),
      'Query-String-Hash': 'image',
      'Cache-Tag': 'image',
      'Keep-Alive': 'timeout=5, max=1000',
      'X-Content-Type-Options': 'nosniff'
    },
  });
}

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const paths = posts.map((post) => ({
    params: {
      slug: post.slug,

    },
    props: {
      title: post.data.title,
      pubDate: post.data.updatedDate ?? post.data.pubDate,
      description: post.data.description,
      tags: post.data.tags,
    },
  }));
  return paths;
}
