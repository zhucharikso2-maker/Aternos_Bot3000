const mineflayer = require('mineflayer');

// ========== НАСТРОЙКИ - ИЗМЕНИ НА СВОИ, БРАТ! ==========
const CONFIG = {
    host: 'Viper-SMP.aternos.me',  // IP твоего Атерноса
    port: 62227,
    username: 'Vova777',        // Любой ник
    password: '11233455',           // Пароль для регистрации
    version: '1.21.4'                  // Версия Minecraft
};
// =====================================================

let registered = false;
let reconnectTimeout = null;

// Случайная задержка (для имитации человека)
function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Создаём бота
const bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    auth: 'offline',
    version: CONFIG.version,
    viewDistance: 'far'
});

// Обработка сообщений (регистрация)
bot.on('message', (msg) => {
    const text = msg.toString().toLowerCase();
    console.log(`[ЧАТ] ${text}`);
    
    if (!registered) {
        // Регистрация
        if (text.includes('register') || text.includes('регистр') || text.includes('придумай пароль')) {
            console.log('🔐 Прохожу регистрацию...');
            setTimeout(() => {
                bot.chat(`/register ${CONFIG.password}`);
            }, randomDelay(500, 1500));
            setTimeout(() => {
                bot.chat(`/login ${CONFIG.password}`);
            }, randomDelay(2000, 3500));
            registered = true;
        }
        // Логин
        else if (text.includes('login') || text.includes('войти') || text.includes('введите пароль')) {
            console.log('🔑 Вхожу на сервер...');
            setTimeout(() => {
                bot.chat(`/login ${CONFIG.password}`);
            }, randomDelay(500, 1500));
            registered = true;
        }
    }
});

// Когда бот появился в мире
bot.once('spawn', () => {
    console.log(`✅ Бот ${CONFIG.username} зашёл на сервер!`);
    console.log(`📍 Координаты: X=${bot.entity.position.x.toFixed(1)}, Y=${bot.entity.position.y.toFixed(1)}, Z=${bot.entity.position.z.toFixed(1)}`);
    
    // Анти-АФК: случайные движения и повороты
    setInterval(() => {
        const action = Math.random();
        
        if (action < 0.6) {
            // Поворот головы
            const yaw = bot.entity.yaw + (Math.random() - 0.5) * 0.6;
            const pitch = bot.entity.pitch + (Math.random() - 0.5) * 0.3;
            bot.look(yaw, pitch);
            console.log('👀 Поворот головы');
        }
        else if (action < 0.8) {
            // Короткий шаг вперёд-назад
            bot.setControlState('forward', true);
            setTimeout(() => bot.setControlState('forward', false), randomDelay(200, 800));
            console.log('🚶 Маленький шаг');
        }
        else {
            // Просто ничего не делаем (имитация AFK)
            console.log('💤 Бездействую...');
        }
    }, randomDelay(15000, 45000));
});

// Обработка ошибок
bot.on('error', (err) => {
    console.log(`❌ Ошибка: ${err.message}`);
});

// Переподключение при отключении
bot.on('end', (reason) => {
    console.log(`🔌 Отключён: ${reason || 'неизвестная причина'}`);
    console.log('🔄 Переподключение через 30 секунд...');
    
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    reconnectTimeout = setTimeout(() => {
        console.log('🚀 Перезапуск бота...');
        process.exit(1);
    }, 30000);
});

console.log(`🚀 Бот запущен! Сервер: ${CONFIG.host}:${CONFIG.port}`);
console.log(`👤 Ник: ${CONFIG.username}`);
