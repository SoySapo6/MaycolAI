const axios = require('axios');
const fs = require('fs');
const path = require('path');

// URL base de Cloudinary
const cloudinaryBaseUrl = 'https://res.cloudinary.com/dgsqkqjx6/image/upload/';

// Función para generar la imagen con el texto en el fondo transparente
async function generarImagenConTexto(texto) {
  const textoCodificado = encodeURIComponent(texto);  // Codificar el texto para pasarlo en la URL
  const url = `${cloudinaryBaseUrl}fl_preserve_transparency/v1742996754/6_sin_t%C3%ADtulo_20250326084529_widprx.jpg`;

  // Construir la URL completa con el texto
  const imagenUrl = `https://res.cloudinary.com/dgsqkqjx6/image/upload/l_text:Arial_500_bold:${textoCodificado},co_rgb:FFFFFF/fl_preserve_transparency/v1743086353/7_sin_t%C3%ADtulo_20250327093853_sh1ypf.jpg`;

  try {
    // Descargar la imagen con el texto sobre el fondo transparente
    const response = await axios.get(imagenUrl, { responseType: 'arraybuffer' });

    // Guardar la imagen en el directorio temporal
    const outputPath = path.join(__dirname, '../assets/images', 'imagen_con_texto.png');
    fs.writeFileSync(outputPath, response.data);

    return outputPath;
  } catch (error) {
    console.error('Error generando la imagen:', error);
    throw new Error('No se pudo generar la imagen con el texto.');
  }
}

module.exports = { generarImagenConTexto };