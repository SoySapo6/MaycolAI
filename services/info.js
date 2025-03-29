const fs = require("fs");
const os = require("os");
const { performance } = require("perf_hooks");

module.exports = async (socket, from) => {
  try {
    const uptime = clockString(process.uptime() * 1000);
    const rutaPerfiles = "./perfiles/";
    let totalUsuarios = 0;

    // Verifica si la carpeta /perfiles/ existe y cuenta los archivos
    if (fs.existsSync(rutaPerfiles)) {
      totalUsuarios = fs.readdirSync(rutaPerfiles).length;
    }

    const chats = Object.entries(socket.chats || {}).filter(([id, data]) => id && data.isChats);
    const grupos = chats.filter(([id]) => id.endsWith("@g.us"));
    const usedRam = (os.totalmem() - os.freemem()) / 1024 / 1024; // RAM real usada en MB
    const rtime = (performance.now() - performance.now()).toFixed(7);

    const info = `💻 *Estado del Bot* 💻\n
🌐 *Desarrollador:* Maycol AI

🚀 *Tiempo activo:* ${uptime}

⚡ *Tiempo de respuesta:* ${rtime} ms

👤 *Usuarios registrados:* ${totalUsuarios}

👥 *Grupos:* ${grupos.length}

🖥️ *Uso de RAM:* ${usedRam.toFixed(2)} MB

🤖 *SerBot:* No Disponible
`;

    socket.sendMessage(from, { text: info });
  } catch (err) {
    console.error("❌ Error ejecutando el comando info:", err);
    socket.sendMessage(from, { text: "❌ Error al obtener información del bot." });
  }
};

function clockString(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
}