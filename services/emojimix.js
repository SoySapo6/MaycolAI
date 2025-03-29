const fs = require('fs');
const { sticker } = require('../services/sticker.js');

const handler = async (socket, from, text) => {
    if (!text.includes("&")) {
        return socket.sendMessage(from, { text: "Debes enviar dos emojis separados por '&'." });
    }

    const [emoji1, emoji2] = text.split("&");

    try {
        const response = await fetch(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&
        contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`);
        
        const anu = await response.json();
        if (!anu.results || anu.results.length === 0) {
            return socket.sendMessage(from, { text: "No se encontró una combinación para esos emojis." });
        }

        for (const res of anu.results) {
            const stiker = await sticker(false, res.url, "Maycol AI", "ChatGPT Sigma");
            socket.sendMessage(from, { sticker: stiker });
        }
    } catch (err) {
        socket.sendMessage(from, { text: "Ocurrió un error al procesar la solicitud." });
    }
};

module.exports = handler;