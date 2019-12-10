import 'reflect-metadata'
import Koa from 'koa'
import { useKoaServer } from 'routing-controllers'
import { Root } from '~/controllers/Root'
import { ToDos } from '~/controllers/ToDos'

const main = async () => {
	const app = new Koa()
	app.use(async (ctx, next) => {
		ctx.set('Access-Control-Allow-Origin', '*')
		ctx.set(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept',
		)
		ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
		await next()
	})
	useKoaServer(app, { controllers: [Root, ToDos] })
	app.listen(3000, () => console.log('start'))
}

main().catch(x => {
	console.error(x)
})
