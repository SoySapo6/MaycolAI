const { BOT_NAME, PREFIX, OWNER_NUMBER } = require("../config");
const fs = require("fs");

// Fecha y hora en que se inició el bot
const startTime = new Date();

// Función para obtener el tiempo de actividad del bot
function getUptime() {
  const now = new Date();
  const uptimeMs = now - startTime;
  
  const uptimeSec = Math.floor(uptimeMs / 1000);
  const uptimeMin = Math.floor(uptimeSec / 60);
  const uptimeHour = Math.floor(uptimeMin / 60);
  
  return `${uptimeHour} horas, ${uptimeMin % 60} minutos, ${uptimeSec % 60} segundos`;
}

// Función para contar los archivos en la carpeta "perfiles"
function getProfileCount() {
  const directoryPath = "perfiles";
  if (fs.existsSync(directoryPath)) {
    const files = fs.readdirSync(directoryPath);
    return files.length;
  } else {
    return 0;
  }
}

const menuowner = () => {
  const date = new Date();
  const fecha = date.toLocaleDateString("es-ES");
  const hora = date.toLocaleTimeString("es-ES");

  const profileCount = getProfileCount(); // Contar archivos en "perfiles"
  const uptime = getUptime(); // Obtener el tiempo de actividad del bot

  return `
⌜────── ⋆⋅☆⋅⋆ ──────⌝

 ✨ Bienvenido a✨
    ${BOT_NAME} 
Te quiro mucho persona ^^

⌞────── ⋆⋅☆⋅⋆ ──────⌟

🎩 𝘼𝘿𝙈𝙄𝙉𝙄𝙎𝙏𝙍𝘼𝘾𝙄𝙊𝙉 🎩

    “=⌕ En Linea Desde //
${uptime}

    “=⌕ Fecha //
${fecha}

    “=⌕ Hora //
${hora}

    “=⌕ Usuarios //
${profileCount}

─────────❖───────────

🔥 𝘾𝙤𝙢𝙖𝙣𝙙𝙤𝙨 𝙂𝙧𝙪𝙥𝙖𝙡𝙚𝙨 🔥

🎭 ${PREFIX}antilink 1/0 ✦
🚫 ${PREFIX}ban ✦
🎭 ${PREFIX}hidetag ✦

─────────❖───────── ✎

🎭 𝘿𝙞𝙫𝙚𝙧𝙨𝙞𝙤𝙣 🎭

✨ ${PREFIX}attp ✦
🎭 ${PREFIX}roleplay ✦
😂 ${PREFIX}chiste ✦
🌈 ${PREFIX}gay ✦
😎 ${PREFIX}guapo ✦
👄 ${PREFIX}besar ✦
😂 ${PREFIX}dog ✦
🌈 ${PREFIX}simi ✦

─────────❖───────── ✎

💻 𝙋𝙧𝙤𝙜𝙧𝙖𝙢𝙖𝙘𝙞𝙤𝙣 💻

🖥️ ${PREFIX}ejecutar ✦
📜 ${PREFIX}ejecutarjs ✦
🐍 ${PREFIX}ejecutarpy ✦
🔵 ${PREFIX}ejecutarc ✦
🔴 ${PREFIX}ejecutarcpp ✦
☕ ${PREFIX}ejecutarjava ✦
🖥️ ${PREFIX}termux ✦
🖥️ ${PREFIX}script ✦
💻 ${PREFIX}info ✦

─────────❖───────── ✎

🛠️ 𝙃𝙚𝙧𝙧𝙖𝙢𝙞𝙚𝙣𝙩𝙖𝙨 🛠️

🔊 ${PREFIX}audio ✦
🔍 ${PREFIX}busqueda ✦
🎥 ${PREFIX}ytvideo ✦
🎶 ${PREFIX}ytaudio ✦
🔧 ${PREFIX}bug ✦
🖼️ ${PREFIX}gif ✦
✉️ ${PREFIX}tempmail ✦
📰 ${PREFIX}news ✦
🎨 ${PREFIX}dalle ✦
🔲 ${PREFIX}qr✦
🗣 ${PREFIX}tts ✦
🎶 ${PREFIX}music ✦
🎶 ${PREFIX}spotify ✦
🖥️ ${PREFIX}apk ✦

─────────❖───────── ✎

😺 𝙆𝙖𝙧𝙆𝙖𝙩 - 𝙈𝙖𝙨𝙘𝙤𝙩𝙖 𝙑𝙞𝙧𝙩𝙪𝙖𝙡 😺

🍖 ${PREFIX}karkat alimentar ✦
🎾 ${PREFIX}karkat jugar ✦
💤 ${PREFIX}karkat dormir ✦
💊 ${PREFIX}karkat curar ✦
🚿 ${PREFIX}karkat bañar ✦

─────────❖───────── ✎

🧠 𝙄𝙣𝙩𝙚𝙡𝙞𝙜𝙚𝙣𝙘𝙞𝙖 𝘼𝙧𝙩𝙞𝙛𝙞𝙘𝙞𝙖𝙡 🧠

🤖 ${PREFIX}ia ✦
🔍 ${PREFIX}deepseek ✦
🔥 ${PREFIX}nsfw ✦
🎭 ${PREFIX}cai ✦
🤖 ${PREFIX}miaai ✦
🐉 ${PREFIX}beastai ✦
🤖 ${PREFIX}duoai ✦

─────────❖───────── ✎

📡 𝙎𝙩𝙧𝙚𝙖𝙢 - 𝙎𝙞𝙢𝙪𝙡𝙖𝙙𝙤𝙧 𝙙𝙚 𝙎𝙩𝙧𝙚𝙖𝙢𝙚𝙧 📡

📡 ${PREFIX}stream transmitir ✦
🎮 ${PREFIX}stream jugar ✦
💬 ${PREFIX}stream chat ✦
🏆 ${PREFIX}stream ganar ✦
💔 ${PREFIX}stream perder ✦

─────────❖───────── ✎

👑 𝘾𝙤𝙢𝙖𝙣𝙙𝙤𝙨 𝙙𝙚𝙡 𝙊𝙬𝙣𝙚𝙧 👑

🔇 ${PREFIX}off ✦
🔊 ${PREFIX}on ✦
🤣 ${PREFIX}trolear ✦

─────────❖───────── ✎

🎤 *Creador:*  *SoyMaycol*   ⍢

Ado: Ayuda de Ideas ^^

💡 *Gracias por usar el bot!* 🚀

📩 *Correo* 📩

「 *Actualización disponible, disfruta de las nuevas funciones!* 」
`;
};

module.exports = menuowner;