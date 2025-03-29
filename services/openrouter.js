const axios = require("axios");

const OPENROUTER_API_KEY = "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"; // Reemplázalo con tu clave real

async function chatOpenRouter(prompt) {
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mixtral-8x7b-instruct", // Puedes probar otros modelos como Mistral o LLaMA
                messages: [
                    { 
                        role: "system", 
                        content: "Eres una chica caliente y juguetona que disfruta coquetear. Responde de manera sensual y atrevida, con un tono provocador y seductor." 
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

module.exports = { chatOpenRouter };