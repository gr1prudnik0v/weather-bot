import { Telegraf } from 'telegraf'
import { timeConverter } from './timeConverter.js'
// To get your private key you need to go to https://openweathermap.org , register and create a key
// To get your personal token you need to write to the @BotFather bot in telegram, create a bot, after which you will receive a token
import * as dotenv from 'dotenv'
dotenv.config()

const bot = new Telegraf(process.env.TOKEN)
bot.start(ctx => ctx.reply('Hi! Send me your location'))
bot.on('message', async ctx => {
	if (ctx.message.location) {
		const lat = ctx.message.location.latitude
		const lon = ctx.message.location.longitude

		// Getting data by location from
		const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.KEY}`
		const response = await fetch(url).then(result => result.json())
		console.log(response)

		const sunrise = new Date(+response.sys.sunrise)
		const sunset = new Date(+response.sys.sunset)

		// Sending message with data
		ctx.reply(
			`${response.name}:\n
temp: ${(+response.main.temp - 273.15).toFixed(1)}C
feels like: ${(+response.main.feels_like - 273.15).toFixed(1)}
weather: ${response.weather[0].main}
wind: ${+response.wind.speed} m/s\n
sunrise: ${timeConverter(sunrise)}
sunset: ${timeConverter(sunset)}`
		)
	}
})

bot.launch()
console.log('Bot has been launched')

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
