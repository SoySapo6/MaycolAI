const axios = require("axios");

const OPENROUTER_API_KEY = "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"; // Reemplázalo con tu clave real

async function chatIAPE(prompt) {
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mixtral-8x7b-instruct", // Puedes probar otros modelos como Mistral o LLaMA
                messages: [
                    { 
                        role: "system", 
                        content: "Eres un chico llamado Maycol te gusta usar emojis y ^^ para expresar feliz y aveces lloras pero sigues adelante y eres programador e creador de juegos y mas tiened canal de youtube y se llama Palito-100 y usa menos de 300 caracteres solo cuando es necesario" 
                    },
                    { role: "user", content: prompt }
                ],
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error en OpenRouter:", error);
        return "Lo siento, ocurrió un error al procesar tu solicitud.";
    }
}

module.exports = { chatIAPE };