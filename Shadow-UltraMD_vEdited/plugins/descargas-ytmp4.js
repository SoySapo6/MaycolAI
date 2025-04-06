/*import fetch from 'node-fetch';

let handler = async(m, { conn, args, text }) => {

if (!text) return m.reply('Ingrese Un Link De YouTube\n> *Ejemplo:* https://youtube.com/shorts/ZisXJqH1jtw?si=0RZacIJU5zhoCmWh');

m.react(rwait);

let video;
try {
      video = await (await fetch(`https://api.alyachan.dev/api/ytv?url=${text}&apikey=uXxd7d`)).json();
} catch (error) {
try {
      video = await (await fetch(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${text}&quality=480p&apikey=be9NqGwC`)).json();
} catch (error) {
try {
      video = await (await fetch(`https://good-camel-seemingly.ngrok-free.app/download/mp4?url=${text}`)).json();
} catch (error) {
      video = await (await fetch(`https://dark-core-api.vercel.app/api/download/ytmp4?key=api&url=${text}`)).json();
      }
    }
 }

let link = video?.data?.url || video?.download_url || video?.result?.dl_url || video?.downloads?.link

if (!link) return m.reply('No se pudo obtener el video.');

await conn.sendMessage(m.chat, {
      video: { url: link },
      mimetype: "video/mp4",
      caption: `${dev}`,
    }, { quoted: m });
    m.react(done);
}

handler.command = ['ytmp4']

export default handler;


import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(m.chat, '🍭 Ingresa una URL válida de *Youtube*.', m);
    }

    try {
        await m.react('🕒');

        const apis = [
            `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(text)}`,
            `https://api.botcahx.eu.org/api/dowloader/yt?url=${encodeURIComponent(text)}&apikey=xenzpedo`,
            `https://mahiru-shiina.vercel.app/download/ytmp4?url=${encodeURIComponent(text)}`,
            `https://api.agungny.my.id/api/youtube-video?url=${encodeURIComponent(text)}`
        ];

        let result;
        for (const api of apis) {
            try {
                const response = await fetch(api);
                result = await response.json();
                if (result.status && result.result && result.result.downloadUrl) {
                    const { title, downloadUrl } = result.result;

                    const videoFileResponse = await fetch(downloadUrl);
                    if (videoFileResponse.ok) {
                        const buffer = await videoFileResponse.buffer();
                        const size = parseInt(videoFileResponse.headers.get('content-length'), 10) || 0;

                        if (size > 10 * 1024 * 1024) {
                            await conn.sendMessage(
                                m.chat,
                                {
                                    document: buffer,
                                    mimetype: 'video/mp4',
                                    fileName: `${title}.mp4`,
                                },
                                { quoted: m }
                            );
                        } else {
                            await conn.sendMessage(
                                m.chat,
                                {
                                    video: buffer,
                                    mimetype: 'video/mp4',
                                },
                                { quoted: m }
                            );
                        }
                    }

                    await m.react('✅');
                    return;
                }
            } catch (err) {
                console.error(`Error con API: ${api}`, err.message);
            }
        }

        throw new Error('No se pudo obtener el enlace de descarga de ninguna API.');
    } catch (error) {
        await m.react('❌');
    }
};

handler.tags = ['descargas'];
handler.command = /^(ytmp4)$/i;
handler.register = true;
export default handler;*/
