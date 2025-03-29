const chistes = [
    "— ¡Camarero! Este filete tiene muchos nervios.\n— Normal, es la primera vez que se lo comen.",
    "¿Por qué el libro de matemáticas estaba triste?\nPorque tenía demasiados problemas.",
    "— Mamá, en el colegio me llaman distraído…\n— Juanito, tu casa es la de enfrente.",
    "¿Qué le dice un gusano a otro gusano?\nVoy a dar una vuelta a la manzana.",
    "— ¿Qué hace una abeja en el gimnasio?\n— Zum-ba.",
    "— ¿Qué le dice una impresora a otra?\n— ¿Esa hoja es tuya o es una impresión mía?",
    "¿Cómo maldice un pollito a otro pollito?\n¡Cal-citra!",
    "¿Cómo se despiden los químicos?\nÁcido un placer.",
    "¿Cuál es el colmo de Aladdín?\nTener mal genio.",
    "¿Qué le dijo un jardinero a otro?\nDisfrutemos mientras podamos."
];

function obtenerChiste() {
    return chistes[Math.floor(Math.random() * chistes.length)];
}

// 📌 Función para la miniatura del chiste
function getAdReplyChiste() {
    return {
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                renderLargerThumbnail: true,
                title: "Chistes XD",
                body: "Chistes de Calidad Cheee",
                mediaType: 1,
                thumbnailUrl: "https://i.postimg.cc/gkNjvybs/18-sin-t-tulo-20250317222535.png",
                mediaUrl: "https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R",
                sourceUrl: "https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R"
            }
        }
    };
}

module.exports = { obtenerChiste, getAdReplyChiste };