import axios from 'axios';

const handler = async (socket, from, text) => {
    if (!text) {
        return await socket.sendMessage(from, { text: '🪼 Por favor proporciona el nombre de una canción o artista.' });
    }

    try {
        let songInfo = await spotifyxv(text);
        if (!songInfo.length) throw "No se encontró la canción.";
        let song = songInfo[0];

        const res = await axios.get(`https://archive-ui.tanakadomp.biz.id/download/spotify?url=${song.url}`);
        if (!res.data || !res.data.result || !res.data.result.data || !res.data.result.data.download) {
            throw "No se pudo obtener el enlace de descarga.";
        }

        const info = `🪼 *Descargando:* ${res.data.result.data.title}\n\n🪽 *Artista:* ${res.data.result.data.artis}\n🪸 *Álbum:* ${song.album}\n🪷 *Duración:* ${timestamp(res.data.result.data.durasi)}\n⛓️‍💥 *Enlace:* ${song.url}`;

        await socket.sendMessage(from, { 
            text: info, 
            contextInfo: { 
                externalAdReply: {
                    showAdAttribution: true,
                    renderLargerThumbnail: true,
                    title: 'Maycol AI • Spotify Music',
                    body: 'Descarga tu música aquí',
                    mediaType: 1,
                    thumbnailUrl: res.data.result.data.image,
                    mediaUrl: res.data.result.data.download,
                    sourceUrl: res.data.result.data.download
                }
            } 
        });

        await socket.sendMessage(from, { 
            audio: { url: res.data.result.data.download }, 
            fileName: `${res.data.result.data.title}.mp3`, 
            mimetype: 'audio/mp4',
            ptt: true 
        });

    } catch (error) {
        await socket.sendMessage(from, { text: `❌ Error: ${error.message || error}` });
    }
};

export default handler;

async function spotifyxv(query) {
    let token = await tokens();
    let response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
        headers: { Authorization: 'Bearer ' + token }
    });

    return response.data.tracks.items.map(track => ({
        name: track.name,
        artista: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
        duracion: timestamp(track.duration_ms),
        url: track.external_urls.spotify,
        imagen: track.album.images.length ? track.album.images[0].url : ''
    }));
}

async function tokens() {
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from('acc6302297e040aeb6e4ac1fbdfd62c3:0e8439a1280a43aba9a5bc0a16f3f009').toString('base64')
        }
    });
    return response.data.access_token;
}

function timestamp(time) {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}