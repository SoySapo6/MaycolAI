const axios = require("axios");
const fs = require("fs").promises; // Usa fs.promises para mejor manejo de archivos
const path = require("path");
const { APIKEY_SPEEDHOSTING } = require("../config");
const { getAdReplyScript } = require("./AdReply");

async function descargarAPK(socket, from, enlace) {
    try {
        if (!enlace || !enlace.startsWith("https://apkpure.com/")) {
            await socket.sendMessage(from, { text: "⚠️ Enlace inválido. Debe ser un enlace de APKPure." });
            return;
        }

        // Limpia el enlace si contiene "/downloading" o "/es/"
        let urlLimpia = enlace.replace("/downloading", "").replace("/es/", "/").trim();
        const apiUrl = `http://speedhosting.cloud:5000/api/download/apkpure?url=${encodeURIComponent(urlLimpia)}&apikey=${APIKEY_SPEEDHOSTING}`;
        console.log("📡 URL de la API generada:", apiUrl); 

        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data || data.status !== "true" || !data.resultado || !data.resultado.file || !data.resultado.file.url) {
            await socket.sendMessage(from, { text: "⚠️ No se pudo obtener la APK. Verifica el enlace." });
            return;
        }

        const apkInfo = data.resultado;
        const apkUrl = apkInfo.file.url;
        const apkFileName = apkInfo.file.filename || "archivo.apk";
        const apkPath = path.join(__dirname, "../apks/", apkFileName);

        // Enviar información con AdReply
        const adReply = getAdReplyScript();
        const infoMensaje = `📲 *APK Descargada*\n\n📌 *Nombre:* ${apkInfo.name}\n📦 *ID:* ${apkInfo.id}\n📏 *Tamaño:* ${apkInfo.size}\n📅 *Versión:* ${apkInfo.version}\n👨‍💻 *Desarrollador:* ${apkInfo.developer}`;
        await socket.sendMessage(from, { text: infoMensaje, ...adReply });

        // Descargar el archivo APK
        const apkBuffer = await axios.get(apkUrl, {
    responseType: "arraybuffer",
    headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 11; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
        "Referer": "https://apkpure.com/",
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
    }
});

        // Guardar el archivo
        await fs.writeFile(apkPath, apkBuffer.data);

        // Enviar el AP
        await socket.sendMessage(from, {
            document: { url: `file://${apkPath}` }, // Enviar como archivo local
            mimetype: "application/vnd.android.package-archive",
            fileName: apkFileName
        });

    } catch (error) {
        console.error(error);
        await socket.sendMessage(from, { text: "Enviando APK... Espere ^^" });
    }
}

module.exports = { descargarAPK };