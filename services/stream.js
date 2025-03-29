const eventos = {
    transmitir: [
        "🎥 Estás transmitiendo en vivo con 50 espectadores.",
        "🔥 Tu transmisión se volvió tendencia en YouTube Gaming.",
        "💻 Problemas técnicos: tu transmisión se cortó por unos minutos.",
        "📉 Perdiste audiencia porque la calidad de tu internet bajó.",
        "🚀 ¡Tu stream llegó a 10,000 espectadores simultáneos!"
    ],
    jugar: [
        "🎮 Estás jugando y haces una jugada épica. ¡El chat explota!",
        "🕹️ Elegiste un juego aburrido y la audiencia se está yendo.",
        "🏆 Ganaste una partida increíble y te vuelves viral.",
        "😡 Tu equipo perdió y la gente empieza a criticarte en el chat.",
        "🎲 Decidiste probar un juego nuevo y a todos les encantó."
    ],
    chat: [
        "💬 *Usuario1:* ¡Bro, me encantan tus streams!",
        "💬 *Usuario2:* ¿Alguien más vio ese bug? 😂",
        "💬 *Mod:* Recuerden respetar las reglas del chat.",
        "💬 *Usuario3:* ¿Cuándo vas a hacer una colaboración con otro streamer?",
        "💬 *Hater:* Este tipo es un fraude, dejen de verlo.",
        "💬 *Fan:* ¡Doné $5, saludame porfa!",
        "💬 *Bot del chat:* Recuerden seguir el canal y activar la campanita. 🔔"
    ],
    ganar: [
        "💰 ¡Un espectador te donó $100! 😱",
        "📈 Has ganado 5,000 nuevos suscriptores.",
        "🎉 Un patrocinador quiere trabajar contigo.",
        "🎖️ YouTube te envió una placa por llegar a 1 millón de suscriptores.",
        "🏆 Ganaste un premio como mejor streamer del año."
    ],
    perder: [
        "🚨 Tu canal recibió un strike por copyright.",
        "📉 Perdiste 2,000 suscriptores por polémica en redes.",
        "🔴 Un hacker intentó entrar a tu cuenta, pero lograste recuperarla.",
        "❌ YouTube desmonetizó tu canal por problemas con las normas.",
        "💀 Una filtración reveló tu información privada. ¡Cuidado!"
    ]
};

function simularEvento(tipo) {
    if (!eventos[tipo]) return "❌ Comando inválido. Usa: transmitir, jugar, chat, ganar o perder.";
    return eventos[tipo][Math.floor(Math.random() * eventos[tipo].length)];
}

module.exports = {
    name: "stream",
    description: "Simula la vida de un streamer con diferentes opciones.",
    execute: async (socket, from, args) => {
        if (args.length === 0) {
            await socket.sendMessage(from, { text: "Comandos: transmitir,jugar,chat,ganar,perder" });
            return;
        }

        const accion = args[0].toLowerCase();
        let resultado = simularEvento(accion);
        await socket.sendMessage(from, { text: `🎮 *Simulación de Streamer*\n\n${resultado}` });
    }
};