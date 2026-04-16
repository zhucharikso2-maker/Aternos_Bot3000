const mineflayer = require('mineflayer');

const CONFIG = {
    host: process.env.SERVER_HOST || 'Viper-SMP.aternos.me',
    port: 62227,
    username: process.env.BOT_NAME || 'Vovanchik1000245',
    password: process.env.BOT_PASSWORD || '123454321',
    version: '1.21.4'
};

let loggedIn = false;

const bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    auth: 'offline',
    version: CONFIG.version
});

// КАК ТОЛЬКО ПОДКЛЮЧИЛСЯ - ПЫТАЕМСЯ ВОЙТИ
bot.on('login', () => {
    console.log('🔌 Подключен к серверу, жду приветствие...');
});

// Обрабатываем каждое сообщение
bot.on('message', (msg) => {
    const text = msg.toString().toLowerCase();
    console.log('💬', text);
    
    if (loggedIn) return;
    
    // Если просит зарегистрироваться
    if (text.includes('register') || text.includes('регистр')) {
        console.log('📝 Регистрируюсь...');
        bot.chat(`/register ${CONFIG.password}`);
        setTimeout(() => {
            bot.chat(`/login ${CONFIG.password}`);
        }, 500);
        loggedIn = true;
    }
    // Если просит войти
    else if (text.includes('login') || text.includes('войти')) {
        console.log('🔑 Вхожу...');
        bot.chat(`/login ${CONFIG.password}`);
        loggedIn = true;
    }
});

bot.on('spawn', () => {
    console.log('✅ БОТ В ИГРЕ!');
    
    // Анти-АФК
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

console.log('🚀 Запуск...');
