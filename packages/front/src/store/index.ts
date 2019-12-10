import { useMemo, useState, useEffect } from 'preact/hooks'
import { createActions, store, Store } from './store'

export const useActions = () => {
	return useMemo(() => ({ ...createActions }), [])
}

let current: Store = { list: [] }
store.subscribe(s => (current = s))

export const useStore = () => {
	const [s, set] = useState<Store>(current)
	useEffect(() => {
		const s = store.subscribe(set)
		return () => s.unsubscribe()
	}, [set])
	return s
}

export { ToDo } from 'test-interface'
