---
layout: layouts/Post.astro
title: Fetch Shared Data in Next.js With Single Request
summary: Does your project has a lot of static generated pages and all of the pages have shared data that is fetched from server side? It could cause spamming your server by many requests that are called by every page that should be generated. Let's take a look at how we can prevent that with NodeJS in front of Next.js on the build stage
original:
  name: ITNEXT
  url: https://itnext.io/fetch-shared-data-in-next-js-with-single-request-833433fa8ed1
publishedAt: '2021-03-06'
---

While reviewing my current project's build process, I noticed that generating pages with `getStaticProps` yields many requests to one endpoint. It's not a big problem in my case since our backend is quite fast but googling this issue showed that some people are struggling with it. For example, the issue might be serious in case of a slow database or when the backend can't cope with 100 requests per second. So I decided to try solving this problem and improving the build time of my project.

### Why So Many Requests?

Before diving deep into Next.js's build process let's look how another static site generator Gatsby — does a similar thing. Gatsby has a very different mechanism as it does SSG only when Next.js is started as an SSR framework.
Gatsby has several building process steps, but the main two are: pulling data and populating components with data, and then rendering. Gatsby plugins usually use GraphQL data layer for storing data from data sources (surely you can build without GraphQL data layer and use unstructured data). Gatsby runs data plugins, then they fetch data and put it on the data layer. Then it gets GraphQL queries from pages and prepares data for templates. After that populates components with data. This way of building pages seems simple and straightforward. But Next.js works the other way.
As I have said before, Next.js originally was SSR-only framework with SSG feature added later. It has API where you get data and pass it to every page, but this method breaks SSG optimization. I'm talking about `getInitialData` when it is used inside `_app.js`
To have SSG pages we use only `getStaticProps` or just make pages without data fetching. When Next.js builds pages it runs data fetching function if it is inside of the page file and then renders a page with this data. And the process is repeated page after page. So if data's shared, it will be requested every time for every page. If the number of pages in the application is increasing then the number of requests is also growing.
My app requires showing the list of cities on every page and these cities should be defined on server. I knew how Gatsby worked and wanted to add a similar mechanism but simpler and without GraphQL 🙂

### My First Approach

The first idea was really simple. When the first page calls `fetchCities` for example, I save the promise returned by `fetch` to module scoped variable. When the next page calls `fetchCities` I check if our variable points to the promise and return it if so.

```js:data/cities.js
const { PUBLIC_NEXT_API_URL } = process.env
let citiesRequest

export function fetchCities() {
	if (!citiesRequest) {
		citiesRequest = fetch(`${PUBLIC_NEXT_API_URL}/cities`)
	}

	return citiesRequest
}
```

The concept is simple. We just save request promise in module scope and then return it to all the next calls. Problem is — this approach doesn't work. The reason is workers. Next.js runs each page build in its own worker. It means that I'm not able to share data between pages and I don't have access to a place where I can share data between workers without huge effort. Also, I check if our request works in CI because `fetchCities` could be called on revalidation and I want to get fresh data every time in this case.

### Maybe Google Could Help?

I had a couple more ideas but I decided to google it. Maybe I'm not the first one who is facing this problem. I found other people who thought about the same question and they had different reasons to do it. Somebody just started using Next.js and its backend wasn't able to serve a decent amount of requests. Other people tried to make transition from Gatsby to Next and realized their backend wasn't too fast for 300 RPS. I knew how Gatsby worked because I faced it on the previous job. Gatsby does this differently. First of all, prepares building by collecting data to local cache, and in this case all resources are fetched only once. So that every page gets data from this cache. My idea was similar but I didn't need to add cache on top of Next.js.

### Cache Data in Files

One of the potential ways to solve the problem is caching in files. We need to add one more step to our build process and write something like this.

We run the script that fetches data and saves it to files. The disadvantage of this method is that we need to collect all endpoints in it for data fetching.

```js
const path = require('path')
const crypto = require('crypto')
const fs = require('fs/promises')
const fetch = require('isomorphic-unfetch')

const { API_URL, CACHE_DIR } = process.env
const RESOUCES = ['/posts', '/albums']

function getFilename(str) {
	const hash = crypto.createHash('sha1').update(str).digest('hex')

	return `${hash}.json`
}

function writeResponseToFile(filepath, data) {
	return fs.writeFile(filepath, data, 'utf-8')
}

function cacheRequests([endpoint, ...r]) {
	return new Promise((resolve, reject) => {
		if (!endpoint) {
			console.log('\nResources have been succesfully cached 📦')
			return resolve()
		}

		const url = `${API_URL}${endpoint}`
		const filename = getFilename(endpoint)
		const filepath = path.resolve(__dirname, CACHE_DIR, filename)

		fetch(url)
			.then((r) => r.text())
			.then((d) => writeResponseToFile(filepath, d))
			.then(() => {
				console.log(`${endpoint} -> ${filepath} 💾`)
				cacheRequests(r)
			})
			.catch((e) => reject(e))
	})
}

cacheRequests(RESOUCES)
```

Once data is collected, we can run server which will serve cached data for building our application.

```js
const http = require('http')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs/promises')

const { HOST, PORT, CACHE_DIR } = process.env

function getFilename(str) {
	const hash = crypto.createHash('sha1').update(str).digest('hex')

	return `${hash}.json`
}

async function handler(req, res) {
	const filename = getFilename(req.url)
	const filepath = path.resolve(__dirname, CACHE_DIR, filename)
	const data = await fs.readFile(filepath)

	res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
	res.write(data)
	res.end()
	console.log(`📤 ${req.method} ${req.url}`)
}

http.createServer(handler).listen(PORT, HOST, () => {
	console.log(`Server is running on 🌎 http://${HOST}:${PORT}`)
})
```

These options are good but have their own cons. For example, we should collect all endpoints for caching and update them. Or you should wait till all resources are cached. On the other hand, all resources are cached on disk and don't stay in memory. I wanted to share this piece of code just to show you all the options.

### Cache It Right in Memory on Build

Yes, it's the easiest and the fastest way to cache your data and not wait for anything. Just pass different `API_PATH` on building stage and run cache server before you run `next build`.

Code of our server could look like this:

```js
const http = require('http')
const fetch = require('isomorphic-unfetch')

const { API_URL, PORT, HOST } = process.env

const map = new Map()

async function handler(req, res) {
	if (map.has(req.url)) {
		const data = await map.get(req.url)

		res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
		res.write(data)
		res.end()
		console.log(`📦 Cached request to: ${req.url}`)

		return
	}

	const request = fetch(`${API_URL}${req.url}`).then((res) => res.text())

	map.set(req.url, request)

	const data = await request

	res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
	res.write(data)
	res.end()
	console.log(`📥 GET ${req.url}`)
}

http.createServer(handler).listen(PORT, HOST, () => {
	console.log(`Server is running on 🌎 http://${HOST}:${PORT}`)
})
```

The idea is the same as the first one – we just store data on a different level. All requests will be calling our cache proxy. When the request is received it is stored in a map and all subsequent requests to the same resource will get the same response. It should be really fast but if you request a lot of data you should be careful about memory. Otherwise, you can make a hybrid of these two approaches by caching data just in time and store it on disk instead of memory.

### Conclusion

Actually, Next.js team planned to add the ability for using `getStaticProps` in `_app.js`. After that, the whole problem could be solved without any additional effort. I keep an eye on this [discussion](https://github.com/vercel/next.js/discussions/10949#discussioncomment-44898) but it is still on hold.
Maybe you have a similar issue with your data source and I'd be glad if this article is of help to you. The goal was not just to solve the problem but to try using different approaches. I hope I've shown something new and maybe it will inspire you to solve some problems and do some “mind” exercises. These examples could be helpful for other problems when you need to cache data. You can use them and modify them for your needs.
[Full examples](https://github.com/akellbl4/cache-proxy) stored on GitHub.
