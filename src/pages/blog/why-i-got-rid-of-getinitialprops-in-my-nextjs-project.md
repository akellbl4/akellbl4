---
title: Why I Got Rid of getInitialProps in My Next.js Project
summary: When I joined June Homes they already used Next.js and getInitialProps for fetching data. I've noticed that there are no pages that are statically optimized. I decided to try to fix it and make the transition to modern fetching methods. Let's look at how to do so and what problems you can face
publishedAt: '2021-03-09'
original:
  name: Better Programming
  url: https://betterprogramming.pub/why-i-got-rid-of-getinitialprops-in-my-next-js-project-fc926e98ed61
---

Let’s start with a small explanation of how Next.js works with `getInitialProps`.  
In Next.js, `getInitialProps` enables server-side rendering and can't be statically optimized. It runs every time we open a page. If a page is requested directly by a URL, it runs on the server. On the other hand, if we open a page through a link or UI element that uses `next/link` or `next/router`, it runs on the client.

## Is `getInitialProps` That Bad?

### It renders a page on the server-side

Sometimes we need to render static pages with data from the server. `getInitialProps` is the worst method for that. In this case, you lose static optimization. You had your static HTML page. Now you have a server-side-rendered page. It’s not bad when you need to update pages dynamically for different users, but it’s much worse when it’s just a page with data that could be updated sometimes. You could have your server send static HTML with no processing and no additional time.

### It opts out of automatic static generation when used in `_app.js`

Based on my experience, I can say that the main reason for using `getInitialProps` is obtaining shared data and populating it to all pages in the app. It can be really useful in this case, but it ruins the whole idea of static optimization because all the pages become SSR. Of course, it’s OK if you planned to write an SSR-only application, but it’s horrible when you didn’t plan to. Later, we will find out how to do that with `getStaticProps`.

### It brings server logic on the client-side

This method is a hybrid — it gets called both on the server and the client. It’s not new to those who have used it from the beginning and got used to it, but this approach leads to writing isomorphic code without any proper way of doing it.  
For example, in React, you can write browser-related code in componentDidMount or useEffect and not be scared of the fact that it could be called on the server. With `getInitialProps`, we have to check where our code is working. Sometimes logic could be duplicated between the client and server-side. This leads to numerous conditions in your code, and the code itself becomes messy. Your server-side dependencies could also be packed in the client-side bundle. That is just the start.

### Requests on navigation

Now let’s talk about HTTP requests. We could send several requests on the server, build our page there, and then send one HTML to the client. But then all these requests would be called every single time we navigate our site. Of course, you can implement some sort of cache or store that will manage the data to organize the requests efficiently. To do that, you need to add some modules to the project, and again complexity will grow very fast.
Imagine that we solved all the problems with request caching, but we still have chains of requests. For example, request a user, and if the user is authorized, request their permissions. Then, check the permissions and then request data for the page. If we compose requests on the server-side, they can be resolved much faster. Why? Because we do it server to server and the Next.js app and backend usually have data much closer to each other than the client and server are. When doing the same on the client-side, we’d rely only on the user’s internet speed.

### It’s not recommended

No, [it’s not deprecated](). It’s just not recommended by the Next.js team. They don’t plan to deprecate it in the nearest future. Since the Next.js team released new fetching methods `getServerSideProps` and `getStaticProps`, they recommend using them. They are more atomic and easier to use.

## New Methods for Data Fetching

Since [Next.js 9.3 was released](), the `getStaticProps` and `getServerSideProps` methods have become the recommended way of fetching props. They are atomic, so you can understand what they do by just looking at their names.

### Are they really good?

In my opinion, yes. As I can see, Next.js’s authors have the same opinion. As I’ve said before, they are atomic and really easy to use. If you need to create a statically generated page, use `getStaticProps` and create the HTML. If you want to update your page from time to time, you can add `revalidate`. Your page will be marked stale after the amount of time that you passed as a param value in seconds, and when a new request for the page comes, it will be regenerated in the background.  
`getServerSideProps` is called only on the server and solves the problems that I described above. Also, it provides an API for redirects.

### How to make them better

The new methods are good but not perfect. Let’s do a bit of programming. If we use some data or actions on many pages, we don’t want to duplicate their code. In this case, we could create a wrapper. For example, authorization with SSR would do:

```js:lib/auth-wrapper.js
export function authWrapper(next) {
	return async function auth(ctx) {
		const user = await session.getUser()

		if (!user) {
			return {
				redirect: {
					destination: '/sign-in',
					permanent: false,
				},
			}
		}

		const props = { user }

		return typeof next === 'function' ? next(ctx, props) : { props }
	}
}
```

Otherwise, we have two other options: Write our implementation or just use [next-connect](). I won’t show how to work with `next-connect`, but I will try to get my hands dirty and offer my own implementation. Maybe it won’t be really clean, but I will do my best. Let’s look at an example:

```js:lib/compose.js
// Pass middlewares as arguments to out composer
export function compose(...middlewares) {
	// Return getServerSideProps handler
	return async function composer(ctx) {
		let prevIndex = -1
		const pageProps = { props: {} }

		// Create middlewares runner
		const runner = async (index) => {
			// Check if `next` was called accidently muliple times
			if (index === prevIndex) {
				throw new Error('next() was called multiple times')
			}

			const middleware = middlewares[index]

			prevIndex = index

			if (typeof middleware === 'function') {
				// Run middlewares one by one
				await middleware(ctx, pageProps, () => {
					return runner(index + 1)
				})
			}
		}

		await runner(0)

		// Return results to next.js
		return pageProps
	}
}
```

It’s a really simple example that could make our life easier. Take a look at how we can use it. We have a couple functions for fetching data on the server.

```js:middlewares/data.js
import { fetchArticles, fetchFriends } from 'lib/api'

async function getUserArticles(ctx, pageProps, next) {
	pageProps.props.articles = await fetchArticles(ctx.req)

	return next()
}

async function getUserFriends(ctx, pageProps, next) {
	pageProps.props.friends = await fetchFriends(ctx.req)

	return next()
}
```

```jsx:pages/profile.jsx
import compose from 'lib/compose'
import Profile from 'components/Profile'
import FriendsList from 'components/FriendsList'
import ArticlesList from 'components/ArticlesList'
import { getUserArticles, getUserFriends } from 'middlewares/data'

export const getServerSideProps = compose(
	getUserArticles,
	getUserFriends
)

export default function Profile({ user, articles, friends }) {
	return (
		<main>
			<ArticlesList items={articles} />
			<FriendsList items={friends} />
		</main>
	)
}
```

## Transition

You can use neither `getServerSideProps` nor `getStaticProps` in `_app.js`. It's a disadvantage compared to `getInitialProps`. On the other hand, it’s a really good decision by the Next.js team. If you add `getInitialProps` to your `_app.js` file, it enables server-side rendering for every page. If you really care about speed, that’s not what you want to do.

The function down below could be used for diffrent pages and used for any pages where they could be needed.

```js:lib/session.js
async function session(ctx, pageProps, next) {
	const currentSession = await session(ctx)

	if (!currentSession) {
		pageProps.redirect = {
			destination: '/sign-in',
			permanent: false,
		}
		// Stop middlewares chain execution
		// because user not authorized to check this page
		return
	}

	// Populate user to page props and continue middlewares execution
	pageProps.props.user = currentSession.user
	return next()
}
```

Finnaly put everything together and get out page work

```jsx:pages/profile.jsx
import compose from 'lib/compose'
import session from 'lib/session'
import Profile from 'components/Profile'
import ArticlesList from 'components/ArticlesList'
import FriendsList from 'components/FriendsList'
import { getUserArticles, getUserFriends } from 'middlewares/data'

export const getServerSideProps = compose(
	session,
	// let's do API calls simultaneously
	(...args) => Promise.all([
		getUserArticles(...args),
		getUserFriends(...args),
	])
)

export default function Profile({ user, articles, friends }) {
	return (
		<main>
			<Profile user={user} />
			<ArticlesList items={articles} />
			<FriendsList items={friends} />
		</main>
	)
}
```

What’s more, you can lose some of your modules that work as HOC over your pages with `getInitialProps` and you’ll have to find a proper replacement or implement it yourself.

### Redirects

Let’s start with an easy thing. In my opinion, redirects in `getInitialProps` are awful. You have to handle redirects for both server and client. The docs don’t have anything about redirects in `getInitialProps`. Just as in the example:

```js
export function getServerSideProps() {
	return {
		redirect: {
			destination: '/path/to/target',
			permanent: false,
		},
	}
}
```

For `getServerSideProps`, everything is much easier. We have the official method described in the documentation. It looks clean and we don’t need to think about where it will be called:

### Static pages

Everything is smooth here. Just use `getStaticProps` instead of `getInitialProps`. I've got an example from [the Next.js docs]():

```js
Repos.getInitialProps = async () => {
	const res = await fetch('https://api.github.com/repos/akellbl4/akellbl4')
	const repo = await res.json()

	return { stars: repo.stargazers_count }
}
```

And convert it to `getStaticProps`:

```js
export async function getStaticProps() {
	const res = await fetch('https://api.github.com/repos/akellbl4/akellbl4')
	const repo = await res.json()

	return {
		props: { start: repo.stargazers_count },
	}
}
```

Also, we can generate static pages by map. For example, articles or news. Let’s create pages with a GitHub user’s repos. We need to add `getStaticPaths`:

```js
export async function getStaticPaths() {
	const res = await fetch('https://api.github.com/users/akellbl4/repos')
	const repos = await res.json()
	const paths = repos.map(({ name }) => ({ name }))

	return {
		paths,
		fallback: false,
	}
}

export async function getStaticProps(ctx) {
	const { name } = ctx.params
	const req = await fetch(`https://api.github.com/repos/akellbl4/${name}`)
	const repo = await req.json()

	return {
		props: { repo },
	}
}
```

We created a map of params in `getStaticPaths`, and they will look like `[{ name: ‘akellbl4’, name: ‘akellbi4.github.io’ }].` Then for each element of this map, `getStaticProps` will be called and this name will be passed in ctx.params. We could fiddle with the fallback param. [Check out docs](https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required) for more on that. If you need to update these pages by time, you could specify the revalidate param and return it from `getStaticProps`. [See the docs for more](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation).

### Server-side-rendered pages

This part is much easier than the previous one. All we need here is to remove client-side code from `getInitialProps`, and that's it. `getServerSideProps` will be called during the first load of the page or upon site navigation via `next/link` or `next/router`. Next.js calls `getServerSideProps` on navigation as a lambda on the server and returns the result of the execution in JSON to the next page. After that, the page will be rendered.

### Remove `getInitialProps` from `_app.js`

If we have shared data here, we just fetch it for each page with new methods. If you have problems with a data source (e.g. your CMS or backend is slow) where it can’t serve the number of requests, I suggest reading my article on fetching shared data effectively while building.

First of all, you should check whether the logic is truly needed for every page. Then split that logic into two functions: first for the client and second for the server. I’ll give an example with authorization:

```jsx
import App from 'next/app'

async function fetchUser(ctx) {
	const headers = {}

	if (ctx.req) {
		const { token } = ctx.req.cookies

		if (token) {
			headers['Authorization'] = `Bearer ${token}`
		}
	}

	const res = await fetch('https://example.com/api/user', { headers })
	const user = await res.json()

	return user
}

function MyApp(props) {
	// Code of your app wrapper
}

MyApp.getInitialProps = async (appContext) => {
	const user = await fetchUser(appContext)
	const appProps = await App.getInitialProps(appContext)

	return { ...appProps, user }
}

export default MyApp
```

Let’s make it nice and clean and practice with two types of data-fetching.
First of all let's check an example with server-side rendering.

```jsx:lib/api.js
export async function fetchUser(params) {
	const res = await fetch('https://example.com/api/user', params)
	const data = await res.json()

	return data
}
```

```jsx:pages/profile-server-rendering.jsx
import { fetchUser } from 'lib/api'

export async function getServerSideProps(ctx) {
	const { token } = ctx.req.cookies
	const user = await fetchUser({ headers: { Authorization: `Bearer ${token}` })

	return {
		props: { user },
	}
}

export default function Profile({ user }) {
	return <div>{user.name}</div>
}
```

And the second example is statically generated page. Here we get user profile on client-side.

```jsx:pages/profile-statically-generated.jsx
import { fetchUser } from 'api/user'

export default function Profile() {
	const [user, setUser] = useState()

	useEffect(() => {
		fetchUser().then((u) => setUser(u))
	}, [])

	if (user === undefined) {
		// we may create skeleton with react-content-loader here
		return <div>Loading...</div>
	}

	return <div>{user.name}</div>
}
```

In this example, we share an API call to use it as needed — no more mixing client/server logic in one place. You can split your code from `getInitialProps` by following the same logic.

## Conclusion

Next.js currently is one of the most interesting, advanced, and promising frameworks in the modern frontend. They’ve made significant steps forward in the last year to mature into a well-supported framework. Current data-fetching methods look well thought-out and provide many advantages. You can start implementing this today, then migrate other pages one by one without rewriting your whole code base at once.

It’s a good time to begin this journey and I hope this article gives you the tools needed to get started!
