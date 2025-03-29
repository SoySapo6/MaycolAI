const { exec } = require("child_process");

module.exports = {
    name: "tempmail",
    description: "Obtiene correos temporales desde la API de Temporary Gmail Account.",
    execute: async (socket, from, args) => {
        if (!args.length) {
            await socket.sendMessage(from, { text: "❌ Debes proporcionar un ID de mensaje. Ejemplo: tempmail [messageId], Correo: maryparkermax09+556593@gmail.com" });
            return;
        }

        const messageId = args[0];
        const email = "maryparkermax09+556593@gmail.com"; // Reemplaza con el email generado
        const token = "p5KR5gr3fu3RdqsgXwCG8uP4H5JhbVc7HrXLKf4cp3fNlkrwpgkEqGnbge9t7oXF"; // Reemplaza con el token generado

        const curlCommand = `
            curl --request POST \\
                --url https://temporary-gmail-account.p.rapidapi.com/GmailGetMessage \\
                --header 'Content-Type: application/json' \\
                --header 'x-rapidapi-host: temporary-gmail-account.p.rapidapi.com' \\
                --header 'x-rapidapi-key: 4e92d111abmshcb213e2d41c45b4p115ab7jsneb6fa354bf45' \\
                --data '{"messageId":"${messageId}","address":"${email}","token":"${token}"}'
        `;

        exec(curlCommand, async (error, stdout) => {
            if (error) {
                await socket.sendMessage(from, { text: "📩 ❌ Error al obtener el correo." });
                return;
            }

            try {
                const response = JSON.parse(stdout);

                if (!response.body) {
                    await socket.sendMessage(from, { text: "📩 No se encontró ningún mensaje con ese ID." });
                    return;
                }

                const emailContent = `📧 *Correo Recibido*\n\n📝 *De:* ${response.from}\n📅 *Fecha:* ${response.date}\n📨 *Asunto:* ${response.subject}\n\n${response.body}`;

                await socket.sendMessage(from, { text: emailContent });
            } catch (err) {
                await socket.sendMessage(from, { text: "📩 ❌ No se pudo procesar la respuesta del servidor." });
            }
        });
    }
};