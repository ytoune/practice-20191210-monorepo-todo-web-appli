import { h } from 'preact'

import { useStore, useActions, ToDo } from '~/store'
import { useState, useCallback, useEffect } from 'preact/hooks'
import { take } from 'rxjs/operators'

const useTextBox = (init: string) => {
	const [text, set] = useState(init)
	const onInput = useCallback(
		(e: Event) => {
			if (e.target instanceof HTMLInputElement) {
				set(e.target.value)
			}
		},
		[set],
	)
	const reset = useCallback(() => set(init), [init, set])
	return { text, onInput, reset }
}

const OnEnter = (fn: () => void) => {
	return useCallback(
		(e: Event) => {
			if (e instanceof KeyboardEvent) {
				if (e.isComposing) return
				if ('Enter' === e.key) fn()
			}
		},
		[fn],
	)
}

const Line = ({ todo }: { todo: ToDo }) => {
	const acts = useActions()
	const onChange = useCallback(
		(e: Event) => {
			if (e.target instanceof HTMLInputElement) {
				acts.setDone(todo.id, e.target.checked)
			}
		},
		[todo.id],
	)
	return (
		<li>
			<input type="checkbox" checked={todo.done} onChange={onChange} />
			<span>{todo.title}</span>
		</li>
	)
}

export const App = () => {
	const store = useStore()
	const acts = useActions()

	useEffect(() => {
		acts.fetch()
	}, [acts.fetch])

	const { text, onInput, reset } = useTextBox('')
	const add = useCallback(() => {
		acts.add(text)
		reset()
	}, [text, acts.add, reset])
	const onKeyDown = OnEnter(add)

	return (
		<div>
			<h4>todo list</h4>
			<ul>
				{store.list.map(todo => (
					<Line key={todo.id} todo={todo} />
				))}
			</ul>
			<p>
				<input
					type="text"
					value={text}
					onInput={onInput}
					onKeyDown={onKeyDown}
				/>
				<button onClick={add}>add</button>
			</p>
			<p>
				<button onClick={acts.removeDone}>remove done items</button>
			</p>
		</div>
	)
}
