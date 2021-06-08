// const fontInterReqular = readFileSync(path.join(__dirname, '../fonts/Inter-Regular.ttf')).toString(
// 	'base64'
// )
// const fontInterExtraBold = readFileSync(
// 	path.join(__dirname, '../fonts/Inter-ExtraBold.ttf')
// ).toString('base64')

type Props = {}

export function SharingImage() {
	return (
		<html>
			<head>
				<style>{`
					body {
						font-family: 'Inter', sans-serif;
						color: #000;
						background: #fff;
						min-height: 100vh;
					}
					h1 {
						font-size: 100px;
					}
				`}</style>
			</head>
			<body>
				<h1>Hello!</h1>
			</body>
		</html>
	)
}
