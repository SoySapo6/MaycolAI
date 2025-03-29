// services/AdReply.js
function getAdReplyScript(title, body, thumbnailUrl, mediaUrl) {
    return {
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,  // Mostrar atribución del anuncio
                title: title || "Maycol AI",  // Título del mensaje de AdReply (se puede personalizar)
                body: body || "No olvides seguirme <3",  // Cuerpo del mensaje
                thumbnailUrl: thumbnailUrl || "https://i.postimg.cc/k59W5ZDT/descarga-5.jpg",  // Imagen (miniatura)
                mediaType: 2,  // Tipo de medio (2 para enlaces, 1 para imágenes, etc.)
                mediaUrl: mediaUrl || "https://github.com/SoySapo6/MaycolAI",  // Enlace al canal o cualquier URL
                sourceUrl: mediaUrl || "https://youtu.be/HFNhMzYmA5Y?si=A_TvnaF41fU9_hXw"  // Fuente del enlace
            }
        }
    };
}

module.exports = { getAdReplyScript };