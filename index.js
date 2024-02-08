const TelegramApi = require('node-telegram-bot-api')

const token = '6378889437:AAEP0XC4QfVf_F7KqoHiu770T0kYdEy_ASw'

const victor = new TelegramApi(token, {polling: true})

const adminPass = '231d'

let admins = []
let recievedMessages = []
const maxAdminsNumber = 2

victor.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id

    if (recievedMessages.includes(chatId)) {
        await victor.sendMessage(chatId, `Спасибо, мы уже получили Вашу заявку и свяжемся с Вами если аккаунт подходит нашим требованиям.`)
        return
    }  

    if(text === 'show-admin-list' && admins.includes(chatId + '|' + msg.from.username)) {
        await victor.sendMessage(chatId, `Number of admins - ${admins.length} : ${admins}`)
        return
    } else  if (text === 'show-admin-list' && !admins.includes(chatId + '|' + msg.from.username)){
        await victor.sendMessage(chatId, 'You must have admin permisions to do that')
        }

    if (text === 'init-new-admin'+ ' ' + adminPass && admins.length < maxAdminsNumber) {
        if(!admins.includes(chatId + '|' + msg.from.username)) {
            await victor.sendMessage(chatId, `Initialisate new admin ${msg.from.username}. You will recieve user registration data`)
            admins.push(chatId + '|' + msg.from.username)
            return 
        }
        await victor.sendMessage(chatId, `Admin ${msg.from.username} already exists`)
        return
    }

    if (text ==='/start') {
        await victor.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b70/92a/b7092ae1-4b65-325e-a2c9-7a87953fec78/41.webp')
        await victor.sendMessage(chatId, `Здравствуйте, ${msg.from.username}. Для регистрации заявки на получение вакансии отправьте нам ссылку на Ваш Instagram-аккаунт.`) 
    } else if (text.includes('https://www.instagram.com')) {
        await victor.sendMessage(chatId,'Спасибо, мы рассмотрим заявку и свяжемся с Вами в ближайшее время.')
        await victor.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b70/92a/b7092ae1-4b65-325e-a2c9-7a87953fec78/106.webp')
        recievedMessages.push(chatId)
        admins.forEach((adminChatId) => {
            victor.sendMessage(adminChatId, `New employee registered: 
            Name: @${msg.from.username}
            IG account: ${msg.text}`)
        })
        
    } else {
        await victor.sendMessage(chatId, 'Упс... Похоже вы ввели не ту ссылку. Пожалуйста, убедитесь что она начинается с `https://www.instagram.com/...`')
        await victor.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b70/92a/b7092ae1-4b65-325e-a2c9-7a87953fec78/116.webp')
        }
})