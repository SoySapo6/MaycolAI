function getAdReplyScript() {
    return {
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: "Maycol AI",
                body: "Descubre las Nuevas actualizaciónes de Maycol AI!",
                thumbnailUrl: "https://i.postimg.cc/k59W5ZDT/descarga-5.jpg", // Imagen válida
                mediaType: 2, // **CORREGIDO** (Debe ser 2 para enlaces)
                mediaUrl: "https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R",
                sourceUrl: "https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R"
            }
        }
    };
}

function obtenerInformacionBot() {
    return `🌟 *Maycol AI - SoyMaycol* 🌟

📊 *Estadísticas*:
- 📌 Comandos disponibles: 30+ 
- 📢 Canal oficial: https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R
- 📅 Última actualización: 2025
- 🛠️ Soporte en Termux
- 💻 GitHub: https://github.com/SoySapo6/MaycolAI

⚡ *Funciones destacadas*:
✅ Generación de stickers y QR
✅ Respuestas automáticas y chat AI
✅ Noticias, clima y más

📥 *Únete al canal para más novedades!*`;
}

module.exports = { getAdReplyScript, obtenerInformacionBot };