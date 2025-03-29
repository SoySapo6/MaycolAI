const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
    name: "dalle",
    description: "Genera una imagen a partir de texto usando IA.",
    execute: async (socket, from, args) => {
        if (!args.length) {
            await socket.sendMessage(from, { text: "🎨 *Uso correcto:* dalle (descripción)\nEjemplo: dalle un gato programando." });
            return;
        }

        const prompt = args.join(" ");
        const apiUrl = `https://eliasar-yt-api.vercel.app/api/ai/text2img?prompt=${encodeURIComponent(prompt)}`;
        const outputDir = "./dalle";

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const fileName = `imagen_${Date.now()}.jpg`;
        const filePath = path.join(outputDir, fileName);

        try {
            // Mensaje de espera
            await socket.sendMessage(from, { text: "⏳ Generando imagen, espera un momento..." });

            // Descargar la imagen
            const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
            fs.writeFileSync(filePath, response.data);

            // Enviar la imagen
            await socket.sendMessage(from, { image: { url: filePath }, caption: "✅ *Imagen generada con éxito.*" });

            // Eliminar la imagen después de enviarla
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error("Error al generar la imagen:", error);
            await socket.sendMessage(from, { text: "❌ No se pudo generar la imagen, intenta nuevamente más tarde." });
        }
    }
};