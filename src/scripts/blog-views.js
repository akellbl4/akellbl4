/** Get list of posts and put their views to DOM */
fetch('/blog/?views')
	.then((res) => res.json())
	.then(setViewsToPosts)
	.catch((err) => {
		console.error(err)
	})

function setViewsToPosts(posts) {
	posts.forEach((post) => {
		const element = document.querySelector(`[data-views-for="${post.slug}"]`)
		const content = `${post.views} view${post.views > 1 ? 's' : ''}`

		element.textContent = content
	})
}
