/**  Enable animations */
document.body.classList.remove('disable-transitions')

/** Run views counters if they are on a page */
const viewsElements = document.querySelectorAll('[data-views-for]')

viewsElements.forEach((e) => {
	fetch(`/api/views/${e.dataset.viewsFor}`)
		.then((r) => r.json())
		.then((data) => {
			e.textContent = `${data[e.dataset.viewsFor].replace(/\B(?=(\d{3})+(?!\d))/g, ',')} views`
		})
})
