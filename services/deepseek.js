const { exec } = require("child_process");

module.exports = {
    name: "deepseek",
    description: "Realiza consultas a DeepSeek AI.",
    execute: async (socket, from, args) => {
        if (!args.length) {
            await socket.sendMessage(from, { text: "❌ Debes escribir una pregunta. Ejemplo: deepseek ¿Qué es la inteligencia artificial?" });
            return;
        }

        const query = args.join(" ");
        const curlCommand = `
            curl --request POST \\
                --url https://deepseek-v3-websearch.p.rapidapi.com/deepseek-v3/completion \\
                --header 'Content-Type: application/json' \\
                --header 'X-RapidAPI-Key: 4e92d111abmshcb213e2d41c45b4p115ab7jsneb6fa354bf45' \\
                --header 'x-rapidapi-host: deepseek-v3-websearch.p.rapidapi.com' \\
                --data '{"messages":[{"role":"user","content":"${query}"}],"max_tokens":2048,"temperature":0.7,"top_p":0.9,"stream":false}'
        `;

        exec(curlCommand, async (error, stdout) => {
            if (error) {
                await socket.sendMessage(from, { text: "🤖 ❌ Error al obtener la respuesta de DeepSeek." });
                return;
            }

            try {
                const response = JSON.parse(stdout);
                const result = response.model_response.choices[0].message.content;

                await socket.sendMessage(from, { text: `🤖 *DeepSeek AI*\n\n${result}` });
            } catch (err) {
                await socket.sendMessage(from, { text: "🤖 ❌ No se pudo procesar la respuesta de DeepSeek. Intentalo mas Tarde." });
            }
        });
    }
};