const { exec } = require("child_process");

module.exports = {
    name: "news",
    description: "Muestra 5 noticias recientes del día.",
    execute: async (socket, from) => {
        const curlCommand = `
            curl --request GET \\
                --url 'https://real-time-news-data.p.rapidapi.com/topic-news-by-section?topic=TECHNOLOGY&section=CAQiSkNCQVNNUW9JTDIwdk1EZGpNWFlTQldWdUxVZENHZ0pKVENJT0NBUWFDZ29JTDIwdk1ETnliSFFxQ2hJSUwyMHZNRE55YkhRb0FBKi4IACoqCAoiJENCQVNGUW9JTDIwdk1EZGpNWFlTQldWdUxVZENHZ0pKVENnQVABUAE&limit=500&country=US&lang=en' \\
                --header 'x-rapidapi-host: real-time-news-data.p.rapidapi.com' \\
                --header 'x-rapidapi-key: 4e92d111abmshcb213e2d41c45b4p115ab7jsneb6fa354bf45'
        `;

        exec(curlCommand, async (error, stdout) => {
            if (error) {
                await socket.sendMessage(from, { text: "📰 ❌ Error al obtener las noticias." });
                return;
            }

            try {
                const response = JSON.parse(stdout);

                if (!response.data || response.data.length === 0) {
                    await socket.sendMessage(from, { text: "📰 No se encontraron noticias recientes." });
                    return;
                }

                const noticias = response.data.slice(0, 5); // Solo las primeras 5 noticias
                let newsText = "📰 *Últimas Noticias del Día:*\n\n";

                noticias.forEach((noticia, index) => {
                    newsText += `📌 *${noticia.title}*\n🔗 ${noticia.link}\n🗞️ *Fuente:* ${noticia.source_name}\n📅 ${new Date(noticia.published_datetime_utc).toLocaleString()}\n\n`;
                });

                await socket.sendMessage(from, { text: newsText });
            } catch (err) {
                await socket.sendMessage(from, { text: "📰 ❌ No se pudo procesar la respuesta del servidor." });
            }
        });
    }
};