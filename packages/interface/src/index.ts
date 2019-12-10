export type ToDo = {
	id: number
	title: string
	done: boolean
}

export type NewTodo = Omit<ToDo, 'id' | 'done'>
