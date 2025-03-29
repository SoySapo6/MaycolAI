/**
 * Menú del Dueño - Maycol AI
 * @author Dev Gui </>
 */
const { BOT_NAME, PREFIX, OWNER_NUMBER } = require("../config");

function menuowner() {
  const date = new Date();
  const fecha = date.toLocaleDateString("es-ES");
  const hora = date.toLocaleTimeString("es-ES");

  return `
╔════════════════╗
  🔥 *${BOT_NAME} - Owner Menu* 🔥
╚════════════════╝

📌 *Estadísticas:*
┏━━━━━━━━━━━━━━┓
┃📅 Fecha: ${fecha}
┃⏰ Hora: ${hora}
┃📌 Prefijo: ${PREFIX}
┃👤 Creador: [SoyMaycol](https://api.whatsapp.com/send?phone=+${OWNER_NUMBER}&text=!menu)
┗━━━━━━━━━━━━━━┛

🚀 *Comandos Grupales:*
🛑 ${PREFIX}antilink 1/0
🔨 ${PREFIX}ban
👥 ${PREFIX}hidetag

🎮 *Diversión:*
✨ ${PREFIX}attp
🎭 ${PREFIX}roleplay
😂 ${PREFIX}chiste
🌈 ${PREFIX}gay
😎 ${PREFIX}guapo
👄 ${PREFIX}besar

💻 *Programación:*
🖥️ ${PREFIX}ejecutar
📜 ${PREFIX}ejecutarjs
🐍 ${PREFIX}ejecutarpy
🔵 ${PREFIX}ejecutarc
🔴 ${PREFIX}ejecutarcpp
☕ ${PREFIX}ejecutarjava

🛠️ *Herramientas:*
🔊 ${PREFIX}audio
🔍 ${PREFIX}busqueda
🎥 ${PREFIX}ytvideo
🎶 ${PREFIX}ytaudio
🔧 ${PREFIX}bug
🖼️ ${PREFIX}gif
✉️ ${PREFIX}tempmail
📰 ${PREFIX}news
🎨 ${PREFIX}dalle

🐱 *KarKat - Mascota Virtual:*
🍖 ${PREFIX}karkat alimentar
🎾 ${PREFIX}karkat jugar
💤 ${PREFIX}karkat dormir
💊 ${PREFIX}karkat curar
🚿 ${PREFIX}karkat bañar

🤖 *Inteligencia Artificial:*
🧠 ${PREFIX}ia
🔍 ${PREFIX}deepseek
🔥 ${PREFIX}nsfw
🎭 ${PREFIX}cai
🤖 ${PREFIX}miaai
🐉 ${PREFIX}beastai

🎥 *Stream - Simulador de Streamer:*
📡 ${PREFIX}stream transmitir
🎮 ${PREFIX}stream jugar
💬 ${PREFIX}stream chat
🏆 ${PREFIX}stream ganar
💔 ${PREFIX}stream perder

👑 *Comandos del Owner - Exclusivo:*

🔇${PREFIX}off
🔊${PREFIX}on
🤣${PREFIX}trolear

🎤 *Creadores/Saludos:*
💖 *SoyMaycol*
💡 *Ado*
🎭 *Grupo de HomeStuck*
  `;
};