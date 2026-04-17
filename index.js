const mineflayer = require('mineflayer');
const express = require('express');

const CONFIG = {
    host: process.env.SERVER_HOST || 'Viper-SMP.aternos.me',
    port: 62227,
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

// Случайная задержка
function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

bot.on('login', () => {
    console.log('🔌 Подключен к серверу');
});

bot.on('message', (msg) => {
    const text = msg.toString().toLowerCase();
    console.log('💬', text);
    
    if (registered) return;
    
    if (text.includes('register') || text.includes('регистр')) {
        console.log('📝 Регистрируюсь...');
        bot.chat(`/register ${CONFIG.password} ${CONFIG.password}`);
        setTimeout(() => {
            bot.chat(`/login ${CONFIG.password}`);
        }, 1000);
        registered = true;
    }
    else if (text.includes('login') || text.includes('войти')) {
        console.log('🔑 Вхожу...');
        bot.chat(`/login ${CONFIG.password}`);
        registered = true;
    }
});

bot.on('spawn', () => {
    console.log('✅ БОТ В ИГРЕ, БРАТ!');
    
    // ========== МОЩНЫЙ АНТИ-АФК ==========
    
    // 1. Повороты головы каждые 15-45 секунд
    setInterval(() => {
        const yaw = bot.entity.yaw + (Math.random() - 0.5) * 0.8;
        const pitch = bot.entity.pitch + (Math.random() - 0.5) * 0.4;
        bot.look(yaw, pitch);
        console.log('👀 Поворот головы');
    }, randomDelay(15000, 45000));
    
    // 2. Случайные прыжки каждые 30-90 секунд
    setInterval(() => {
        if (Math.random() > 0.6) { // 40% шанс прыгнуть
            bot.setControlState('jump', true);
            setTimeout(() => {
                bot.setControlState('jump', false);
            }, 200);
            console.log('🦘 Прыжок!');
        }
    }, randomDelay(30000, 90000));
    
    // 3. Ходьба вперёд-назад каждые 45-120 секунд
    setInterval(() => {
        const chance = Math.random();
        
        if (chance > 0.7) { // 30% шанс
            // Идём вперёд
            bot.setControlState('forward', true);
            setTimeout(() => {
                bot.setControlState('forward', false);
            }, randomDelay(500, 1500));
            console.log('🚶 Шаг вперёд');
        }
        else if (chance > 0.4 && chance <= 0.7) { // 30% шанс
            // Идём назад
            bot.setControlState('back', true);
            setTimeout(() => {
                bot.setControlState('back', false);
            }, randomDelay(500, 1500));
            console.log('🚶 Шаг назад');
        }
        else {
            // Не двигаемся
            console.log('💤 Бездействую...');
        }
    }, randomDelay(45000, 120000));
    
    // 4. Смотрим на ближайшего игрока (если есть)
    setInterval(() => {
        const players = Object.keys(bot.players).filter(name => name !== bot.username);
        if (players.length > 0 && Math.random() > 0.7) {
            const targetName = players[Math.floor(Math.random() * players.length)];
            const target = bot.players[targetName];
            if (target && target.entity) {
                bot.lookAt(target.entity.position.offset(0, 1.5, 0));
                console.log(`👀 Смотрю на игрока ${targetName}`);
            }
        }
    }, randomDelay(30000, 60000));
    
    // 5. Руки (взмах) иногда
    setInterval(() => {
        if (Math.random() > 0.8) { // 20% шанс
            bot.swingArm('right');
            console.log('💪 Взмах рукой');
        }
    }, randomDelay(20000, 50000));
    
    console.log('🛡️ Анти-АФК система активирована!');
});

bot.on('error', (err) => {
    console.log('❌ Ошибка:', err.message);
});

bot.on('end', (reason) => {
    console.log('🔌 Отключен:', reason);
    setTimeout(() => process.exit(1), 15000);
});

console.log('🚀 Запуск бота...');

