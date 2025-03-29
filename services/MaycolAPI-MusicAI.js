const axios = require('axios');

const MUSIC_HERO_API_URL = 'https://musichero.ai/api/generate-music'; // URL de la API de MusicHero

async function generarMusica(prompt) {
    try {
        const response = await axios.post(MUSIC_HERO_API_URL, {
            prompt: prompt,
            // Puedes añadir parámetros adicionales según la documentación de MusicHero
        });

        if (response.data && response.data.musicUrl) {
            return response.data.musicUrl; // URL de la música generada
        } else {
            throw new Error('Respuesta de la API inválida');
        }
    } catch (error) {
        console.error('Error al generar música:', error);
        throw error;
    }
}

module.exports = { generarMusica };