const axios = require("axios");

const rolePlayAI = async (inputText) => {
    try {
        const response = await axios({
            method: "POST",
            url: "https://nsfw-gpt-ai.p.rapidapi.com/text-gpt.php",
            headers: {
                "Content-Type": "application/json",
                "x-rapidapi-host": "nsfw-gpt-ai.p.rapidapi.com",
                "x-rapidapi-key": "4e92d111abmshcb213e2d41c45b4p115ab7jsneb6fa354bf45"
            },
            data: { prompt: inputText }
        });

        return response.data; 
    } catch (error) {
        console.error("Error en Role Play AI:", error.response ? error.response.data : error.message);
        return "Intenta de nuevo en unos minutos.";
    }
};

module.exports = rolePlayAI;