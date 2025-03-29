const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
    name: "playaudio",
    description: "Descarga música desde SoundCloud.",
    execute: async (socket, from, args) => {
        if (!args.length) {
            await socket.sendMessage(from, { text: "🎵 *Uso correcto:* playaudio (nombre de la canción)\nEjemplo: playaudio Shape of You." });
            return;
        }

        const query = args.join(" ");
        const searchUrl = `https://apis-starlights-team.koyeb.app/starlight/soundcloud-search?text=${encodeURIComponent(query)}`;

        try {
            // Mensaje de espera
            await socket.sendMessage(from, { text: "⏳ Buscando la canción en SoundCloud..." });

            // Buscar la canción
            const searchResponse = await axios.get(searchUrl);
            const searchResults = searchResponse.data;

            if (!searchResults || !searchResults[0]?.url) {
                await socket.sendMessage(from, { text: "❌ No se encontraron resultados en SoundCloud." });
                return;
            }

            const { url, title } = searchResults[0];
            const downloadUrl = `https://apis-starlights-team.koyeb.app/starlight/soundcloud?url=${url}`;

            // Descargar el audio
            const downloadResponse = await axios.get(downloadUrl);
            const { link: dl_url, quality, image } = downloadResponse.data;

            if (!dl_url) {
                await socket.sendMessage(from, { text: "❌ No se pudo descargar la canción." });
                return;
            }

            // Guardar audio temporalmente
            const audioPath = path.join("./music", `${Date.now()}.mp3`);

            if (!fs.existsSync("./music")) {
                fs.mkdirSync("./music", { recursive: true });
            }

            const audioBuffer = await axios.get(dl_url, { responseType: "arraybuffer" });
            fs.writeFileSync(audioPath, audioBuffer.data);

            // Enviar imagen con detalles
            const caption = `🎶 *Música Descargada*\n\n📌 *Título:* ${title}\n🎧 *Calidad:* ${quality}\n🔗 *URL:* ${url}`;
            await socket.sendMessage(from, { image: { url: image }, caption });

            // Enviar audio
            await socket.sendMessage(from, { audio: { url: audioPath }, mimetype: "audio/mpeg" });

            // Eliminar audio después de enviarlo
            fs.unlinkSync(audioPath);
        } catch (error) {
            console.error("Error al descargar desde SoundCloud:", error);
            await socket.sendMessage(from, { text: "❌ Error al descargar la canción, intenta de nuevo más tarde." });
        }
    }
};