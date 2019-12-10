import {
	JsonController,
	Get,
	Post,
	Body,
	OnUndefined,
	Param,
} from 'routing-controllers'
import { IsInterface, isString, isBoolean } from 'generic-type-guard'
import { repo } from '~/models/ToDo'

export const hasText = new IsInterface().withProperty('title', isString).get()
const hasDone = new IsInterface().withProperty('done', isBoolean).get()

@JsonController('/todos')
export class ToDos {
	@Get()
	async index() {
		return repo.list()
	}
	@Post()
	@OnUndefined(403)
	async add(@Body() body: unknown) {
		if (hasText(body) && body.title) return repo.add(body)
	}
	@Post('/:id/done')
	@OnUndefined(404)
	async setDone(@Param('id') id: number, @Body() body: unknown) {
		if (hasDone(body)) {
			const { done } = body
			return repo.setDone(id, done)
		}
	}
	@Post('/remove-done')
	async removeDone() {
		return repo.removeDone()
	}
}
