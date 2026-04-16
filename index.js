const mineflayer = require('mineflayer');
const express = require('express');

// ========== НАСТРОЙКИ ==========
const CONFIG = {
    host: process.env.SERVER_HOST || 'твой_сервер.aternos.me',
    port: 62227,
    username: process.env.BOT_NAME || 'MyVovan',
    password: process.env.BOT_PASSWORD || '12345',
    version: '1.21.4'
};

let registered = false;
const app = express();

// ========== ВЕБ-СЕРВЕР ДЛЯ RENDER ==========
const WEB_PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('✅ AFK Bot is running! Брат, бот работает!');
});

app.listen(WEB_PORT, '0.0.0.0', () => {
    console.log(`🌐 Веб-сервер запущен на порту ${WEB_PORT}`);
});

// ========== МАЙНКРАФТ БОТ ==========
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
    
    if (text.includes('register') || text.includes('регистр')) {
        console.log('📝 Регистрация...');
        bot.chat(`/register ${CONFIG.password}`);
        setTimeout(() => {
            bot.chat(`/login ${CONFIG.password}`);
        }, 500);
        registered = true;
    }
    else if (text.includes('login') || text.includes('войти')) {
        console.log('🔑 Вход...');
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
        console.log('🔄 Анти-АФК');
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
