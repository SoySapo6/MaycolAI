const axios = require("axios");
const { onlyNumbers } = require("./utils/functions");
const { isActiveWelcomeGroup } = require("./database/db");
const { errorLog } = require("./utils/terminal");

async function welcome({ socket: lite, data }) {
  const from = data.id;
  const userJid = data.participants[0];

  if (!isActiveWelcomeGroup(from)) return;

  if (data.action === "add") {
    try {
      const numero = onlyNumbers(userJid);

      // Obtener la foto real de perfil usando Baileys
      let avatarUrl;
      try {
        avatarUrl = await lite.profilePictureUrl(userJid, "image");
      } catch {
        avatarUrl = "https://files.catbox.moe/xr2m6u.jpg"; // Avatar genérico si no tiene
      }

      // Crear URL con parámetros dinámicos
      const apiURL = `http://speedhosting.cloud:5000/api/canva/bem-vindo2?titulo=MaycolAI&avatar=${encodeURIComponent(avatarUrl)}&fundo=https://files.catbox.moe/2xuxna.png&nome=${numero}&desc=Hecho%20Por%20SoyMaycol&apikey=aa18unlhqu`;

      const response = await axios.get(apiURL, {
        responseType: "arraybuffer",
        timeout: 15000,
      });

      const buffer = Buffer.from(response.data, "binary");

      await lite.sendMessage(from, {
        image: buffer,
        caption: `┏━━━━━━━━━━━✦  
┃✧  ʜᴏʟᴀ ~ @${numero}
┃✧  ᴛᴇ ᴅᴀ ʟᴀ ʙɪᴇɴᴠᴇɴɪᴅᴀ…  
┃✧  ᴇʟ ʙᴏᴛ ᴅᴇ ʜᴀɴᴀᴋᴏ-ᴋᴜɴ  
┗━━━━━━━━━━━✦

✿ ¿𝗤𝘂𝗲́ 𝘁𝗶𝗲𝗻𝗲 𝗲𝘀𝘁𝗲 𝗕𝗼𝘁? ✿

➤ ✧ ᴛᴇᴍᴀ́ᴛɪᴄᴀ ᴅᴇ ᴀɴɪᴍᴇ 〜★  
➤ ✧ ᴄʀᴇᴀᴅᴏʀ ᴄᴏɴ ꜱᴛʏʟᴇ ✦  
➤ ✧ ᴍɪɴɪ ᴊᴜᴇɢᴏꜱ, ᴍᴀꜱᴄᴏᴛᴀꜱ, ʏ ᴍᴀ́ꜱ!

ꜱɪᴇɴᴛᴇᴛᴇ ᴄᴏ́ᴍᴏᴅ@ ʏ ᴅɪꜱꜰʀᴜᴛᴀ ~  
☁️ ᴍᴀʏᴄᴏʟᴀɪ & ʜᴀɴᴀᴋᴏ ᴛᴇ ᴄᴜɪᴅᴀɴ ☁️`,
        mentions: [userJid],
      });
    } catch (error) {
      errorLog("Alguien se unió al grupo y no pude enviar el mensaje de bienvenida.");
      console.error(error.message);
    }
  }
}

module.exports = { welcome };
