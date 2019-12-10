import { JsonController, Get } from 'routing-controllers'

@JsonController()
export class Root {
	@Get()
	index() {
		return { message: 'ok' }
	}
}
