const { Scenes: { Stage}, session} = require('telegraf')
const text = require('./modules/const')
const studentsScene = require('./modules/addStudent')
const resultScene = require('./modules/resultForAdmin')
const factOPScene = require('./modules/factOP')
const addOpScene = require('./modules/addOp')
const deleteOpScene = require('./modules/deleteOp')
require('dotenv').config()

const bot = text.bot

const stage = new Stage([studentsScene, resultScene, factOPScene, addOpScene, deleteOpScene])
bot.use(session())
bot.use(stage.middleware())

bot.start(async (ctx) => {
    try {
        const gsapi = text.gsapi
        const optUpdateOpId = text.optUpdateOpId
        let opId = ((await gsapi.spreadsheets.values.get(optUpdateOpId)).data.values).flat()
        if(ctx.chat.id === 400336335 || ctx.chat.id === 256177977 || ctx.chat.id === 275028553) {
            bot.telegram.sendMessage(ctx.chat.id, 'Привет 🤟️', {
                reply_markup: {
                    keyboard: [
                        ['Добавить ученика ✅', 'Общий результат 👀'],
                        ['Факт ОП 🤑'],
                        ['Добавить ОПшника ➕', 'Кикнуть ОПшника ➖'],
                        ['Отмена 🚫']
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            })
        } else if(opId.find(item => item === (ctx.chat.id).toString())) {
            bot.telegram.sendMessage(ctx.chat.id, `Привет, ${ctx.message.from.first_name} ${ctx.message.from.last_name ? ctx.message.from.last_name: ''} ✌`, {
                reply_markup: {
                    keyboard: [['Добавить ученика ✅'],
                        ['Отмена 🚫']],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            })
        } else {
            bot.telegram.sendMessage(ctx.chat.id, `Привет, ${ctx.message.from.first_name} ${ctx.message.from.last_name ? ctx.message.from.last_name: ''}    \nОбратитесь к администратору для доступа`)
        }
    } catch (e) {
        await ctx.reply("что то пошло не так, обратитесь к администратору")
        console.error(e)
    }
})

bot.hears('Добавить ученика ✅', async (ctx)=> {try {ctx.scene.enter('StudentWizard')} catch (e) {await ctx.reply("что то пошло не так, обратитесь к разработчику")}})
bot.hears('Общий результат 👀', async(ctx)=> {try {ctx.scene.enter('resultWizard')} catch (e) {await ctx.reply("что то пошло не так, обратитесь к разработчику")}})
bot.hears('Факт ОП 🤑', async (ctx)=> {try {ctx.scene.enter('factOPWizard')} catch (e) {await ctx.reply("что то пошло не так, обратитесь к разработчику")}})
bot.hears('Добавить ОПшника ➕', async(ctx)=> {try {ctx.scene.enter('addOpWizard')} catch (e) {await ctx.reply("что то пошло не так, обратитесь к разработчику")}})
bot.hears('Кикнуть ОПшника ➖', async(ctx)=> {try {ctx.scene.enter('deleteOpWizard')} catch (e) {await ctx.reply("что то пошло не так, обратитесь к разработчику")}})

bot.help((ctx) => ctx.reply('Если возникли вопросы по разработке, пишите сюда: @zhassulannuradil'))

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))