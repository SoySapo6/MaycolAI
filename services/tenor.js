const TENOR_API_KEY = "AIzaSyCvq6XcbdjjMn7kVuv9bc0eLbUK90qFi6E";
const TENOR_API_URL = "https://tenor.googleapis.com/v2/search";

async function getTenorGif(query) {
    try {
        let response = await fetch(`${TENOR_API_URL}?q=${encodeURIComponent(query)}&key=${TENOR_API_KEY}&limit=1`);
        let data = await response.json();

        if (data.results && data.results.length > 0) {
            return data.results[0].media_formats.gif.url;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error al obtener el GIF de Tenor:", error);
        return null;
    }
}

module.exports = { getTenorGif };