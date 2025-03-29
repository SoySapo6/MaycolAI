const { exec } = require("child_process");
const fs = require("fs");

const defaultLang = "es";
const tempFile = "./stickers/tts.mp3"; // Guarda el audio temporalmente

async function generarTTS(text, lang = defaultLang) {
  return new Promise((resolve, reject) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    const command = `curl -s -o ${tempFile} "${url}"`;

    exec(command, (error) => {
      if (error) return reject("Error al generar el TTS.");
      resolve(tempFile);
    });
  });
}

// ✅ Exportar con module.exports para que funcione en tu bot
async function obtenerTTS(text, lang = defaultLang) {
  if (!text) return null;
  try {
    const audioPath = await generarTTS(text, lang);
    return audioPath;
  } catch (error) {
    return null;
  }
}

module.exports = { obtenerTTS };