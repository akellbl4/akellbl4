import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import readingTime from 'reading-time'
import { format, parseISO } from 'date-fns'
import renderToString from 'next-mdx-remote/render-to-string'

import Image from 'next/image'
import { Link } from 'components/Link'
import { Talk } from 'components/Talk'
import { Project } from 'components/Project'

const dataFolderPath = path.resolve(process.cwd(), 'data')

export function getFiles(type: string) {
	return fs.readdirSync(path.resolve(dataFolderPath, type))
}

export function getFile(relFilepath: string) {
	return fs.readFileSync(path.resolve(dataFolderPath, relFilepath))
}

async function transformMDX(content: string) {
	const { renderedOutput } = await renderToString(content, {
		components: { img: Image, a: Link, Project, Talk },
		mdxOptions: {
			remarkPlugins: [
				require('remark-autolink-headings'),
				require('remark-slug'),
				require('remark-code-titles'),
			],
			rehypePlugins: [require('mdx-prism')],
		},
	})

	return renderedOutput
}

type GetFileContentResult<T> = {
	content: string
	meta: T & {
		readingTime: string
	} & (
			| {
					publishedAt?: never
					publishedAtISO?: never
			  }
			| {
					publishedAt: string
					publishedAtISO: string
			  }
		)
}

/**
 * Read file from data folder and transform
 *
 * @param filepath relative path from data folder
 * @returns frontmatter data and transformed mdx to string
 */
export async function getFileContent<T>(filepath: string): Promise<GetFileContentResult<T>> {
	const source = fs.readFileSync(path.resolve(dataFolderPath, filepath), 'utf-8')
	const { data, content } = matter(source)
	const result = {
		meta: {
			...data,
			readingTime: `${readingTime(content).text}`,
		},
		content: await transformMDX(content),
	} as GetFileContentResult<T>

	if (typeof result.meta.publishedAt === 'string') {
		Object.assign(result, {
			publishedAt: format(parseISO(result.meta.publishedAt), 'MMMM dd'),
			publishedAtISO: result.meta.publishedAt,
		})
	}

	return result
}

export type PostFrontmatter = {
	slug: string
	title: string
	summary: string
	publishedAt: string
	publishedAtISO: string
	original: { url: string; name: string }
	readingTime: string
}

export async function getAllBlogPostsFrontmatter() {
	const blogFolderPath = path.resolve(dataFolderPath, 'blog')
	const files = fs.readdirSync(blogFolderPath)

	return files
		.map((f) => {
			const filepath = path.resolve(blogFolderPath, f)
			const { data } = matter.read(filepath)
			const frontmatter = {
				...data,
				slug: f.replace('.mdx', ''),
			} as PostFrontmatter

			return frontmatter
		})
		.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
}
