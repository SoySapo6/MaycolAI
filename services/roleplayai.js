const { exec } = require('child_process');

async function chatRolePlayAI(input) {
    return new Promise((resolve, reject) => {
        const command = `curl --request POST \
            --url https://role-play-ai-llm-chat.p.rapidapi.com/flash.php \
            --header 'Content-Type: application/json' \
            --header 'x-rapidapi-host: role-play-ai-llm-chat.p.rapidapi.com' \
            --header 'x-rapidapi-key: 4e92d111abmshcb213e2d41c45b4p115ab7jsneb6fa354bf45' \
            --data '{"input":"${input}"}'`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error al ejecutar curl:', error);
                return resolve('Hubo un error al procesar tu solicitud.');
            }
            if (stderr) {
                console.warn('Advertencia de curl:', stderr);
            }

            try {
                const data = JSON.parse(stdout);
                return resolve(data.response || 'No entendí tu mensaje.');
            } catch (parseError) {
                console.error('Error al parsear la respuesta de la API:', stdout);
                return resolve('Hubo un problema con la respuesta de la IA.');
            }
        });
    });
}

module.exports = { chatRolePlayAI };