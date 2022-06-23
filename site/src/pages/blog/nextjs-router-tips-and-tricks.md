---
layout: layouts/Post.astro
title: An Overview on the Current State of Next.js Router
summary: These tips and tricks for you on the Next.js router help you make your DX better and code cleaner
publishedAt: '2021-05-29'
---

### Disclamer

Next.js is a dynamically developed framework and a lot of old articles about it could be outdated because Next.js made a huge leap forward. I wrote this article in May 2021 and now the current version is 10.2.3 I suggest to check [docs](https://nextjs.org/docs/getting-started) while you look at examples because some tips could be outdated due to improved API.

## Features Were Released You Probably Don't Know

If you use Next.js for a long time your projects should have a huge amount of code, and you just keep writing it in the style that it already has. Sometimes because you use to and sometimes because you use your codebase as a catalog of snippets and examples. That's why you can skip new cool stuff.

### Server redirects and not found status

These features, as well as previous, were released in version 10 and I still see a lot of questions about how to make redirect on the server. First of all, I suggest checking if you use modern fetching methods because only they get updates and new features. I explained **[here](/blog/why-i-got-rid-of-getinitialprops-in-my-nextjs-project)** other reasons why to use modern fetching methods.

Here is a simple way to make redirect or show page 404:

```jsx
// Redirect
export function getServerSideProps() {
	return {
		redirect: {
			destination: '/',
			permanent: false,
		},
	}
}

// Page 404
export function getServerSideProps() {
	return {
		notFound: true,
	}
}
```

### Automatic resolving of `href` param

Try to find `next/link` in your project that has `href` and `as` prop as well. If you found it, it's time to update that links. Because starts with 10.x version you don't need to pass both of the params you can drop `href` param and rename `as` to `href`, and it will work well.

For example:

```jsx
import Link from 'next/link'

// Before
function MyComponent() {
	return (
		<Link href="/posts/[post]" as="/posts/blog-post">
			Blog post
		</Link>
	)
}

// Since v10.x
function MyComponent() {
	return <Link href="/posts/blog-post">Blog post</Link>
}
```

## Client Router Functions

I noticed that people often use `router.push` from `useRouter`. If you use it in functions that were wrapped in `useCallback` or just inside `useEffect` you have to mention it in dependencies like in the example down below.

```jsx:pages/params.jsx
import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'

function MyComponent() {
	const { push } = useRouter()

	const handleClick = useCallback(() => {
		// some logic
		push('/profile')
	}, [push])

	useEffect(() => {
		if (...) {
			push('/sign-in')
		}
	}, [push])

	return <>...</>
}
```

It's completely unnecessary because these functions don't update over re-renders but ESlint rules will tell you that you should do it. Solutions for this are fairly easy. Just use routing functions from the `Router`. It makes your code cleaner and nicer 😉

```jsx:pages/params.jsx
import Router from 'next/router'

function MyComponent() {
	const handleClick = useCallback(() => {
		// some logic
		Router.push('/profile')
	}, [])

	useEffect(() => {
		if (...) {
			Router.push('/sign-in')
		}
	}, [])

	return <>...</>
}
```

Sometimes when I work with the router I need to get the current pathname. But `react/router` stores the dynamic representation of the router in that field, and it's the same as router filed. We can create these params by ourselves with `asPath`. I created a wrapper over `useRouter` and always have access to the props If I need them.

```jsx:lib/router.js
import { useRouter as useNextRouter } from 'next/router'

export function useRouter() {
	const router = useNextRouter()
	const [pathname, queryString = ''] = router.asPath.split('?')

	return Object.assign(router, { pathname, queryString })
}
```

The wrapper gives us handy props that we can use in a situation when we need to update a current route.

```jsx:pages/params.jsx
import Router from 'next/router'
import { useRouter } from 'lib/router'

function MyComponent() {
	const { query, pathname } = useRouter()

	function handleSubmit(evt) {
		const params = new FormData(evt.currentTarget).getAll("fruits");

		evt.preventDefault();
		Router.replace(
			{ pathname, query: { ...query, params }},
			null,
			{ shallow: true }
		)
	}

	return (
		<form>
			{...}
			<button type="submit">Apply</button>
		</form>
	)
}
```

Do you wonder why the second param in `Router.replace` is `null`? Since 10.x with automatic resolving, we can skip that param.

Since we have such a feature as automatic resolving we can use it in `next/router`, but it is a small inconvenience in its API. Because if you want to pass `options` you should pass dynamic route to the first argument and full path to the second in earlier versions and Next.js kept those 3 arguments for backward compatibility. I have small handy functions that help me to use router functions easier.

```jsx:lib/router.js
import NextRouter from 'next/router'

function push(url, opts) {
	return NextRouter.push(url, null, opts)
}

const Router = {
	...NextRouter,
	push,
}

export default Router
```

```jsx:pages/params.jsx
import Router, { useRouter } from 'lib/router'

function MyComponent() {
	const { query } = useRouter()

	function handleSubmit(evt) {
		const params = new FormData(evt.currentTarget).getAll("fruits");

		evt.preventDefault();
		Router.push({ pathname, query: { ...query, params } }, { shallow: true });
	}

	return <>{...}</>
}
```

## Conclusion

Thank you for reading the article till the end. You can find complete code on [GitHub](https://github.com/akellbl4/nextjs-router-tips).
There is always some way to make good tools better. Small improvements could help you and your project a lot.
