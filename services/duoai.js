const axios = require("axios");
const { exec } = require("child_process");

const OPENROUTER_API_KEY = "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";
const GEMINI_API_KEY = "AIzaSyCYWNbM2ZgdDSp9NlFxTgp0Wtwaaw7dyRc";

async function chatOpenRouter(prompt) {
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mixtral-8x7b-instruct",
                messages: [
                    { role: "system", content: "Eres Kanaya Maryam tu mejor amiga es Roxy Lalonde y usas <3, ^^, :3 y más. Hablas directo, y te gusta Rose Lalonde. Usa muchos emojis y responde en menos de 300 caracteres y eres un personaje de homestuck." },
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

        if (response.status === 401) {
            return "⚠️ *Error 401:* La API Key de OpenRouter no es válida o ha caducado.";
        }

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error en OpenRouter:", error.response?.status, error.response?.data);
        return "⚠️ *Error en OpenRouter:* No se pudo obtener una respuesta.";
    }
}

async function chatGemini(userMessage, openRouterResponse) {
    return new Promise((resolve, reject) => {
        const formattedPrompt = `Humano: ${userMessage}\nKanaya Maryam: ${openRouterResponse}\nTú: Comportate como una chica feliz pero tu novio es Kanaya Maryam Hablarás con Kanaya Maryam y El Humano. Eres súper cute, usas :3, <3 y más. Usa máximo 300 caracteres y te llamas Roxy Lalonde y eres un personaje de homestuck.`;

        const command = `curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}" \
        -H "Content-Type: application/json" \
        -X POST \
        -d '{ "contents": [{ "parts": [{"text": "${formattedPrompt}"}] }] }'`;

        exec(command, (error, stdout, stderr) => {
            if (error) return reject("⚠️ *Error en Gemini:* No se pudo ejecutar la solicitud.");
            if (stderr) return reject("⚠️ *Error en Gemini:* Respuesta con errores.");

            try {
                const response = JSON.parse(stdout);
                const reply = response.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ *Gemini no respondió.*";
                resolve(reply);
            } catch (err) {
                reject("⚠️ *Error en Gemini:* No se pudo interpretar la respuesta.");
            }
        });
    });
}

async function duoAI(userMessage) {
    const respuestaOR = await chatOpenRouter(userMessage);
    const respuestaGemini = await chatGemini(userMessage, respuestaOR);

    // Ahora OpenRouter recibe la respuesta de Gemini para contexto, pero no se envía al usuario
    await chatOpenRouter(`MiaIA dijo: ${respuestaGemini}`);

    return `👤 *Tu:* ${userMessage}\n👨 *John Egbert:* ${respuestaOR}\n👱‍♀ *Roxy Lalonde:* ${respuestaGemini}`;
}

module.exports = { duoAI };

