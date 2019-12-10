import { ToDo, NewTodo } from 'test-interface'

export const repo = new (class {
	_list: ToDo[] = []
	_cur = 0
	async list() {
		return this._list
	}
	async add(todo: NewTodo) {
		const id = ++this._cur
		const done = false
		const { title } = todo
		const item = { id, title, done }
		this._list.push(item)
		return item
	}
	async setDone(id: number, done: boolean) {
		for (const tmp of this._list) {
			if (tmp.id !== id) continue
			tmp.done = done
			return tmp
		}
	}
	async removeDone() {
		return (this._list = this._list.filter(i => !i.done))
	}
})()
