const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// URL base de Cloudinary
const cloudinaryBaseUrl = 'https://res.cloudinary.com/dgsqkqjx6/image/upload/';

// Función para generar imágenes con texto de colores diferentes y combinarlas en un video
async function generarGifConTexto(textogif) {
  const colores = ["FF0000", "00FF00", "0000FF", "FFFF00", "FF00FF", "00FFFF", "FFFFFF", "000000", "808080", "800080"]; // Colores para el texto
  const imagenes = [];

  // Generamos 10 imágenes con el mismo texto, pero con diferentes colores
  for (let i = 0; i < 10; i++) {
    const color = colores[i];
    const textoCodificado = encodeURIComponent(textogif); // Codificar el texto
    const url = `${cloudinaryBaseUrl}l_text:Arial_500_bold:${textoCodificado},co_rgb:${color}/fl_preserve_transparency/v1743086353/7_sin_t%C3%ADtulo_20250327093853_sh1ypf.jpg`;

    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      const imagenPath = path.join(__dirname, '../assets/images', `imagen_${i}.png`);
      fs.writeFileSync(imagenPath, response.data);
      imagenes.push(imagenPath);

      console.log(`Imagen ${i} generada y guardada en: ${imagenPath}`);  // Log para verificar la ruta de las imágenes
    } catch (error) {
      console.error('Error generando la imagen:', error);
      throw new Error('No se pudo generar la imagen con el texto.');
    }
  }

  // Usamos ffmpeg para combinar las imágenes en un video con fondo transparente
  const videoPath = path.join(__dirname, '../assets/images', 'video_con_texto.mp4');
  const ffmpegCommand = `ffmpeg -framerate 10 -i ${path.join(__dirname, '../assets/images', 'imagen_%d.png')} -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 ${videoPath}`;
  
  try {
    console.log('Ejecutando comando ffmpeg:', ffmpegCommand);  // Log para verificar el comando generado
    execSync(ffmpegCommand);
    console.log('Video generado correctamente en:', videoPath);

    // Limpiar las imágenes temporales
    imagenes.forEach(imagen => fs.unlinkSync(imagen));
  } catch (error) {
    console.error('Error generando el video:', error);
    throw new Error('No se pudo generar el video.');
  }

  return videoPath;
}

module.exports = { generarGifConTexto };