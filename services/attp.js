const axios = require('axios');
const fs = require('fs');
const path = require('path');

const pathToSave = path.join(__dirname, '../assets/images');
if (!fs.existsSync(pathToSave)) fs.mkdirSync(pathToSave, { recursive: true });

module.exports = async function(socket, from, args, info) {
  const texto = args.join(" ");
  if (!texto) {
    return socket.sendMessage(from, {
      text: "Escribe un texto para convertirlo en sticker."
    });
  }

  const textoCodificado = encodeURIComponent(texto);
  const imagenUrl = `https://res.cloudinary.com/dgsqkqjx6/image/upload/l_text:Arial_500_bold:${textoCodificado},co_rgb:FFFFFF/fl_preserve_transparency/v1743086353/7_sin_t%C3%ADtulo_20250327093853_sh1ypf.jpg`;

  try {
    const response = await axios.get(imagenUrl, { responseType: 'arraybuffer' });
    const outputPath = path.join(pathToSave, 'imagen_con_texto.png');
    fs.writeFileSync(outputPath, response.data);

    await stickerFromFile(outputPath);

    fs.unlinkSync(outputPath); // Limpieza
  } catch (err) {
    console.error("Error generando sticker:", err);
    socket.sendMessage(from, { text: "Ocurrió un error generando el sticker." });
  }
};
