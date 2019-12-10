import { Subject, of, ObservableInput } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import {
	flatMap,
	map,
	scan,
	shareReplay,
	catchError,
	tap,
} from 'rxjs/operators'
import { ToDo } from 'test-interface'

const _createActions = {
	fetch() {
		return { type: 'FETCH' } as const
	},
	add(title: string) {
		return { type: 'ADD', item: { title } } as const
	},
	setDone(id: ToDo['id'], done: boolean) {
		return { type: 'SET_DONE', id, done } as const
	},
	removeDone() {
		return { type: 'REMOVE_DONE' } as const
	},
}

type Action = ReturnType<typeof _createActions[keyof typeof _createActions]>

const _createMutations = {
	_setList(list: readonly ToDo[]) {
		return { type: 'SET_LIST', list } as const
	},
	_setItem(...items: readonly ToDo[]) {
		return { type: 'SET_ITEM', items } as const
	},
}

type Mutation = ReturnType<
	typeof _createMutations[keyof typeof _createMutations]
>

const actions = new Subject<Action>()

const ROOT = 'http://localhost:3000'
const headers = { 'content-type': 'application/json' }

const recover = (x: unknown) => {
	console.error(x)
	return of<Mutation>()
}

const mutations = actions.pipe(
	tap(act => console.log('act', act)),
	flatMap<Action, ObservableInput<Mutation>>(act => {
		switch (act.type) {
			case 'FETCH':
				return ajax(ROOT + '/todos').pipe(
					map(res => _createMutations._setList(res.response)),
					catchError(recover),
				)
			case 'ADD':
				return ajax({
					url: ROOT + '/todos',
					headers,
					method: 'post',
					body: act.item,
				}).pipe(
					map(res => _createMutations._setItem(res.response)),
					catchError(recover),
				)
			case 'SET_DONE':
				return ajax({
					url: ROOT + `/todos/${act.id}/done`,
					method: 'post',
					headers,
					body: { done: act.done },
				}).pipe(
					map(res => _createMutations._setItem(res.response)),
					catchError(recover),
				)
			case 'REMOVE_DONE':
				return ajax({
					url: ROOT + '/todos/remove-done',
					method: 'post',
				}).pipe(
					map(res => _createMutations._setList(res.response)),
					catchError(recover),
				)
			default:
				return of()
		}
	}),
)

export type Store = {
	list: readonly ToDo[]
}

const initStore = (): Store => ({ list: [] })
export const store = mutations.pipe(
	tap(mut => console.log('mut', mut)),
	scan<Mutation, Store>((prev, mut) => {
		switch (mut.type) {
			case 'SET_LIST':
				return { ...prev, list: mut.list }
			case 'SET_ITEM': {
				const list = [...prev.list]
				for (const m of mut.items) {
					let ok = false
					for (const [j, i] of list.entries())
						if (i.id === m.id) {
							list[j] = m
							ok = true
							break
						}
					if (!ok) list.push(m)
				}
				return { ...prev, list }
			}
			default:
				return prev
		}
	}, initStore()),
	shareReplay(1),
)

store.subscribe()

export const createActions = {
	fetch() {
		actions.next(_createActions.fetch())
	},
	add(title: string) {
		actions.next(_createActions.add(title))
	},
	setDone(id: ToDo['id'], done: boolean) {
		actions.next(_createActions.setDone(id, done))
	},
	removeDone() {
		actions.next(_createActions.removeDone())
	},
}
