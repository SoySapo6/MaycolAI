const axios = require("axios");
const { onlyNumbers } = require("./utils/functions");
const { isActiveWelcomeGroup } = require("./database/db");
const { errorLog } = require("./utils/terminal");

async function welcome({ socket: lite, data }) {
  const from = data.id;
  const userJid = data.participants[0];

  if (!isActiveWelcomeGroup(from)) {
    return;
  }

  if (data.action === "add") {
    try {
      const numero = onlyNumbers(userJid); // Extraer el número del usuario

      // URL de Cloudinary con el número dinámico
      const apiUrl = `https://res.cloudinary.com/dgsqkqjx6/image/upload/l_text:Arial_50_bold:${numero},co_rgb:FFFFFF/fl_preserve_transparency/v1742996754/6_sin_t%C3%ADtulo_20250326084529_widprx.jpg`;

      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data, "binary");

      // Enviar la imagen de bienvenida con el mensaje personalizado
      await lite.sendMessage(from, {
        image: buffer,
        caption: `Hola @${numero} ¡Bienvenido al grupo!  
Si quieres usar el bot, utiliza .menu  
Estoy feliz de que estés aquí ^^  
😉 SoyMaycol`,
        mentions: [userJid],
      });
    } catch (error) {
      errorLog("Alguien se unió al grupo y no pude enviar el mensaje de bienvenida.");
    }
  }
}

module.exports = { welcome };