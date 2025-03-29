const axios = require("axios");

const YOUTUBE_API_KEY = "AIzaSyAVT6bHbEtGRkz1Imfc4rY1cE-XxzXYwss"; // Reemplázala con tu clave
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

async function buscarEnYoutube(consulta) {
    try {
        const respuesta = await axios.get(YOUTUBE_SEARCH_URL, {
            params: {
                part: "snippet",
                q: consulta,
                key: YOUTUBE_API_KEY,
                maxResults: 3, // Número de resultados a devolver
                type: "video"
            }
        });

        const videos = respuesta.data.items.map(video => {
            return {
                titulo: video.snippet.title,
                url: `https://www.youtube.com/watch?v=${video.id.videoId}`
            };
        });

        return videos;
    } catch (error) {
        console.error("Error al buscar en YouTube:", error);
        return [];
    }
}

module.exports = { buscarEnYoutube };