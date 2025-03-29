const axios = require("axios");

const API_KEY = "AIzaSyBzIdW3NsxmAuknqqwG50th5mfd5bC0vMY"; // Reemplaza con tu clave
const CX = "8260aecbf169043d0"; // Reemplaza con tu ID de motor de búsqueda

async function buscarEnGoogle(consulta) {
    try {
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(consulta)}&key=${API_KEY}&cx=${CX}`;
        const response = await axios.get(url);
        const resultados = response.data.items;

        if (!resultados) return "No encontré resultados.";

        return resultados.slice(0, 3).map((item, index) => 
            `${index + 1}. *${item.title}*\n${item.snippet}\n${item.link}`
        ).join("\n\n");
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        return "Hubo un problema con la búsqueda.";
    }
}

module.exports = { buscarEnGoogle };