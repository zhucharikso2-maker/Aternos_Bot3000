const mineflayer = require('mineflayer');
const express = require('express');

const CONFIG = {
    host: process.env.SERVER_HOST || 'Viper-SMP.aternos.me',
    port: 25565,
    username: process.env.BOT_NAME || 'Vovanchik777987',
    password: process.env.BOT_PASSWORD || '333555777',
    version: '1.21.4'
};

let registered = false;
const app = express();
const WEB_PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('✅ AFK Bot is running!');
});
app.listen(WEB_PORT, '0.0.0.0', () => {
    console.log(`🌐 Веб-сервер на порту ${WEB_PORT}`);
});

const bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    auth: 'offline',
    version: CONFIG.version
});

bot.on('login', () => {
    console.log('🔌 Подключен к серверу');
});

bot.on('message', (msg) => {
    const text = msg.toString().toLowerCase();
    console.log('💬', text);
    
    if (registered) return;
    
    // Если просит регистрацию
    if (text.includes('register') || text.includes('регистр')) {
        console.log('📝 Регистрируюсь...');
        // Отправляем пароль дважды через пробел
        bot.chat(`/register ${CONFIG.password} ${CONFIG.password}`);
        setTimeout(() => {
            bot.chat(`/login ${CONFIG.password}`);
        }, 1000);
        registered = true;
    }
    // Если просит логин
    else if (text.includes('login') || text.includes('войти')) {
        console.log('🔑 Вхожу...');
        bot.chat(`/login ${CONFIG.password}`);
        registered = true;
    }
});

bot.on('spawn', () => {
    console.log('✅ БОТ В ИГРЕ, БРАТ!');
    
    setInterval(() => {
        const yaw = bot.entity.yaw + (Math.random() - 0.5) * 0.5;
        const pitch = bot.entity.pitch + (Math.random() - 0.5) * 0.3;
        bot.look(yaw, pitch);
    }, 20000);
});

bot.on('error', (err) => {
    console.log('❌ Ошибка:', err.message);
});

bot.on('end', (reason) => {
    console.log('🔌 Отключен:', reason);
    setTimeout(() => process.exit(1), 15000);
});

console.log('🚀 Запуск бота...');

