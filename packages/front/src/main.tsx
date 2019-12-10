import { h, render } from 'preact'
import { App } from './App'

const main = async () => {
	const el = document.querySelector('main')
	el && render(<App />, el)
}

main().catch(x => {
	console.error(x)
})
