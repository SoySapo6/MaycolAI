const axios = require('axios');
const { API_darkstartsz, NAME_darkstartsz } = require('../config');
const { errorLog } = require('../utils/terminal');

async function simi(socket, from, text) {
  try {
    // Asegurarse de que el texto esté presente
    if (!text) {
      await socket.sendMessage(from, { text: "Por favor, escribe algo para Simsimi." });
      return;
    }

    // Crear la URL para la API de Simsimi
    const apiUrl = `https://darkstarsz-api.onrender.com/api/outros/simih?language=pt&text=${encodeURIComponent(text)}&apikey=${API_darkstartsz}&username=${NAME_darkstartsz}`;

    // Hacer la solicitud a la API
    const response = await axios.get(apiUrl);

    // Verificar si la respuesta contiene el resultado
    if (response.data.status === 404) {
      // Enviar el resultado de Simsimi si es un texto
      await socket.sendMessage(from, { text: response.data.resultado });
    } else {
      // Enviar el resultado de Simsimi
      await socket.sendMessage(from, { text: response.data.resultado });
    }
  } catch (error) {
    console.error(error);
    errorLog("Hubo un error al obtener la respuesta de Simsimi.");
    await socket.sendMessage(from, { text: "Lo siento, ocurrió un error al contactar con Simsimi. Intenta nuevamente." });
  }
}

module.exports = { simi };