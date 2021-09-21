/** Run views counters if they are on a page */

fetch('/blog/?views')
	.then((res) => res.json())
	.then((data) => {
		console.log(data)
	})
	.catch((err) => {
		console.error(err)
	})
// const viewsElements = document.querySelectorAll('[data-views-for]')

// viewsElements.forEach((e) => {
// 	// fetch(`/api/views/${e.dataset.viewsFor}`)
// 		// .then((r) => r.json())
// 		// .then((data) => {
// 		// 	e.textContent = `${data[e.dataset.viewsFor].replace(/\B(?=(\d{3})+(?!\d))/g, ',')} views`
// 		// })
// })
