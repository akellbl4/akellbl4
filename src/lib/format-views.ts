export function formatViews(num: string | undefined) {
	if (num === undefined) {
		return '––– views'
	}

	const formattedNum = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

	return `${formattedNum} views`
}
