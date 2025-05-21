// ╔══════════════════════════════════════════════════════════╗
// ║ 👻 ✧ 𝐇𝐚𝐧𝐚𝐤𝐨-𝐤𝐮𝐧 𝐌𝐚𝐲𝐜𝐨𝐥𝐀𝐈 𝐁𝐨𝐭 ✧ 👻 ║
// ║ Hecho por Maycol - Adaptado con temática Hanako-kun   ║
// ╚══════════════════════════════════════════════════════════╝

// Importaciones principales de @whiskeysockets/baileys 
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, isJidBroadcast, isJidStatusBroadcast, proto, isJidNewsletter, delay } = require("@whiskeysockets/baileys");

const config = require("./config"); 
const moment = require("moment"); 
const NodeCache = require("node-cache"); 
const pino = require("pino"); 
const { BAILEYS_CREDS_DIR } = require("./config"); 
const { runLite } = require("./index"); 
const { onlyNumbers } = require("./utils/functions"); 
const { 
  textInput, 
  infoLog, 
  warningLog, 
  errorLog, 
  successLog, 
  tutorLog, 
  bannerLog, 
} = require("./utils/terminal");
const { welcome } = require("./welcome");
const chalk = require('chalk'); // Para textos de colores

const msgRetryCounterCache = new NodeCache();

// Crear un logger silencioso para el store 
const storeLogger = pino({ level: 'fatal' });

// Función para crear un almacén en memoria simple 
function createSimpleStore() { 
  const messages = {};

  return { 
    loadMessage: async (jid, id) => { 
      return messages[`${jid}:${id}`] || null; 
    },

    storeMessage: async (msg) => {
      if (msg.key && msg.key.remoteJid && msg.key.id) {
        messages[`${msg.key.remoteJid}:${msg.key.id}`] = msg;
      }
    },

    bind: (ev) => {
      ev.on('messages.upsert', ({ messages: newMessages }) => {
        for (const msg of newMessages) {
          if (msg.key && msg.key.remoteJid && msg.key.id) {
            messages[`${msg.key.remoteJid}:${msg.key.id}`] = msg;
          }
        }
      });
    }
  }; 
}

// Crear un almacén simple 
const store = createSimpleStore();

// Función para generar texto arcoíris
const rainbowText = (text) => {
  const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const color = colors[i % colors.length];
    result += chalk[color](text[i]);
  }
  return result;
};

// Banner personalizado de Hanako-kun
const customBanner = () => {
  console.log(`
╔═════════════════════════════════════════════════════════════════╗
║  👻 ♥‿♥ 𝐇𝐚𝐧𝐚𝐤𝐨-𝐤𝐮𝐧 𝐌𝐚𝐲𝐜𝐨𝐥𝐀𝐈 𝐁𝐨𝐭 ♥‿♥ 👻  ║
╠═════════════════════════════════════════════════════════════════╣
║  ◦•●◉✿ "𝘌𝘷𝘦𝘳𝘺 𝘭𝘦𝘨𝘦𝘯𝘥 𝘩𝘢𝘴 𝘪𝘵𝘴 𝘰𝘸𝘯 𝘣𝘰𝘶𝘯𝘥𝘢𝘳𝘪𝘦𝘴" ✿◉●•◦  ║
║  ⋆｡°✩ 𝗘𝗹 𝗯𝗼𝘁 𝗱𝗲𝗹 𝗯𝗮𝗻̃𝗼 𝗲𝘀𝘁𝗮́ 𝗹𝗶𝘀𝘁𝗼 𝗽𝗮𝗿𝗮 𝗰𝘂𝗺𝗽𝗹𝗶𝗿 𝘁𝘂𝘀 𝗱𝗲𝘀𝗲𝗼𝘀! ✩°｡⋆ ║
╚═════════════════════════════════════════════════════════════════╝
  `);
};

// En lugar de reasignar bannerLog (que es una constante), 
// llamamos directamente a nuestro banner personalizado

// Mostrar el banner personalizado al inicio
customBanner();

let pairingInProgress = false;

async function startConnection() { 
  try { 
    const { state, saveCreds } = await useMultiFileAuthState(BAILEYS_CREDS_DIR); 
    const { version } = await fetchLatestBaileysVersion();

    const socket = makeWASocket({
      version,
      logger: pino({ level: "error" }), // solo muestra errores importantes
      printQRInTerminal: false,
      defaultQueryTimeoutMs: 60 * 1000,
      auth: state,
      shouldIgnoreJid: (jid) =>
        isJidBroadcast(jid) || isJidStatusBroadcast(jid) || isJidNewsletter(jid),
      keepAliveIntervalMs: 60 * 1000,
      markOnlineOnConnect: true,
      msgRetryCounterCache,
      shouldSyncHistoryMessage: () => false,
      getMessage: async (key) => {
        try {
          const msg = await store.loadMessage(key.remoteJid, key.id);
          return msg ? msg.message : undefined;
        } catch (error) {
          return proto.Message.fromObject({});
        }
      },
    });

    // Enlazar nuestra store personalizada con el socket
    store.bind(socket.ev);

    // Configurar los manejadores de eventos primero
    socket.ev.on("creds.update", saveCreds);
    
    socket.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;

        if (statusCode === DisconnectReason.loggedOut) {
          console.log(`
╭» 👻 ¡𝕆𝕙 𝕟𝕠! 👻
│→ ${rainbowText("El espíritu de Hanako-kun ha abandonado el baño...")}
│➫ Borre la carpeta baileys, Bot desconectado Permanentemente
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
          process.exit(1);
        } else {
          console.log(`
╭» 👻 𝔸𝕕𝕧𝕖𝕣𝕥𝕖𝕟𝕔𝕚𝕒 👻
│→ ${rainbowText("Conexión perdida. El espíritu está inquieto...")}
│➫ Intentando reconectar en el menor tiempo posible...
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
          setTimeout(startConnection, 300); // Espera 300ms antes de reconectar
        }
      } else if (connection === "open") {
        console.log(`
╭» 💫 ¡𝕊𝕦𝕔𝕖𝕤𝕠! 💫
│→ ${rainbowText("¡El espíritu de Hanako-kun ha respondido a tu llamado!")}
│➫ El bot está conectado exitosamente
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);

        try {
          // Cambiar la biografía del perfil del bot
          const nuevaBio = "👻⋆｡°✩ [ʜᴀɴᴀᴋᴏ-ᴋᴜɴ ᴍᴀʏᴄᴏʟᴀɪ]✩°｡⋆ ᴴᵉᶜʰᵒ ᵖᵒʳ ˢᵒʸᴹᵃʸᶜᵒˡ";
          await socket.updateProfileStatus(nuevaBio);
          console.log(`
╭» 💫 ¡ℂ𝕒𝕞𝕓𝕚𝕠 𝕖𝕩𝕚𝕥𝕠𝕤𝕠! 💫
│→ ${rainbowText("Biografía del bot actualizada a:")} 
│➫ ${nuevaBio}
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
        } catch (error) {
          console.log(`
╭» 👻 𝔼𝕣𝕣𝕠𝕣 👻
│→ ${rainbowText("No pude cambiar mi biografía...")}
│➫ Error al actualizar la biografía del bot
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
        }

        // Configurar manejadores de eventos para mensajes cuando la conexión está abierta
        socket.ev.on("messages.upsert", async ({ messages, type }) => {
          const msg = messages[0];
          if (!msg.message) return;

          const hora = moment().format("HH:mm:ss");
          const isGroup = msg.key.remoteJid.endsWith("@g.us");
          const senderID = isGroup ? msg.key.participant : msg.key.remoteJid;
          const mensajeTexto = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
          const tipoMensaje = mensajeTexto ? mensajeTexto : "Contenido Multimedia o Corrupto";
          const destino = isGroup ? `Grupo: ${msg.key.remoteJid}` : `Privado: ${senderID.replace(/@s\.whatsapp\.net/, "")}`;

          console.log(`
╔══════════════════════════════════════╗
║ 👻 ✧ 𝓗𝓪𝓷𝓪𝓴𝓸-𝓴𝓾𝓷 𝓡𝓮𝓬𝓲𝓫𝓲𝓸́ 𝓜𝓮𝓷𝓼𝓪𝓳𝓮 ✧ 👻 ║
╚══════════════════════════════════════╝

⏰ (っ◔◡◔)っ ${rainbowText("𝑯𝒐𝒓𝒂:")}: ${hora}
✉️ ⊂(◉‿◉)つ ${rainbowText("𝑻𝒊𝒑𝒐 𝒅𝒆 𝑴𝒆𝒏𝒔𝒂𝒋𝒆:")}: ${tipoMensaje}
༄ ₊˚ ${rainbowText("𝑵𝒖́𝒎𝒆𝒓𝒐/𝑮𝒓𝒖𝒑𝒐:")}: ${destino} ˚₊ ༄

━━━━━༻✧༺━━━━━
👻 *${config.BOT_NAME}* te observa desde el baño del tercer piso...
"${rainbowText("¡Concede mi deseo, Hanako-kun!")}" ₊˚✧
━━━━━༻✧༺━━━━━
`);

          runLite({ socket, data: { messages, type } });
        });
        
        socket.ev.on("group-participants.update", (data) => welcome({ socket, data }));
      }
    });

    // Proceso de vinculación (si es necesario)
    if (!socket.authState.creds.registered && !pairingInProgress) {
      pairingInProgress = true;
      
      console.log(`
╭» 👻 𝔸𝕕𝕧𝕖𝕣𝕥𝕖𝕟𝕔𝕚𝕒 👻
│→ ${rainbowText("¡Hanako-kun necesita ser invocado!")}
│➫ Archivos necesarios no Encontrados.
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);

      // Mostrar el banner personalizado de nuevo para asegurarnos que esté visible
      customBanner();

      const startPairing = async () => {
        try {
          const enableTutor = await textInput(`[👻 ${rainbowText("𝕄𝕒𝕪𝕔𝕠𝕝𝔸𝕀")}: INPUT] ¿Deseas un tutorial? s/n : `);
          
          if (!["s", "n"].includes(enableTutor.toLowerCase())) {
            console.log(`
╭» 👻 𝔼𝕣𝕣𝕠𝕣 👻
│→ ${rainbowText("Opción inválida, debes escribir 's' o 'n'")}
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
            return await startPairing();
          }

          const phoneNumber = await textInput(`[👻 ${rainbowText("𝕄𝕒𝕪𝕔𝕠𝕝𝔸𝕀")}: INPUT] Ingrese su número: `);

          if (!phoneNumber || !onlyNumbers(phoneNumber)) {
            console.log(`
╭» 👻 𝔼𝕣𝕣𝕠𝕣 👻
│→ ${rainbowText("Número incorrecto, Ejemplo: 51921826291.")}
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
            process.exit(1);
          }

          if (enableTutor.toLowerCase() === "s") {
            await delay(1000);
            console.log(`
╭» 👻 𝕋𝕦𝕥𝕠𝕣𝕚𝕒𝕝 👻
│→ ${rainbowText("Estamos invocando a Hanako-kun... Recuerda:")}
│➫ Para invocar correctamente, golpea la puerta del baño 3 veces y di su nombre
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
            await delay(5000);
            console.log(`
╭» 👻 ℙ𝕣𝕠𝕘𝕣𝕖𝕤𝕠 👻
│→ ${rainbowText("⌛ Preparando ritual de invocación...")} 
│➫ 25% completado
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
            await delay(8000);
            console.log(`
╭» 👻 ℙ𝕣𝕠𝕘𝕣𝕖𝕤𝕠 👻
│→ ${rainbowText("⌛ Buscando a Hanako-kun en el baño...")}
│➫ 50% completado
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
            await delay(8000);
            console.log(`
╭» 👻 ℙ𝕣𝕠𝕘𝕣𝕖𝕤𝕠 👻
│→ ${rainbowText("⌛ Hanako-kun está escuchando...")}
│➫ 75% completado
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
            await delay(8000);
            console.log(`
╭» 👻 ¡𝕊𝕦𝕔𝕖𝕤𝕠! 👻
│→ ${rainbowText("✅ ¡Hanako-kun ha sido invocado!")}
│➫ Enviando código de vinculación...
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
            await delay(3000);
          }

          const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));
          console.log(`
╭» 👻 ℂ𝕠́𝕕𝕚𝕘𝕠 𝕕𝕖 𝕧𝕚𝕟𝕔𝕦𝕝𝕒𝕔𝕚𝕠́𝕟 👻
│→ ${rainbowText("Tu código para invocar a Hanako-kun es:")}
│➫ ${code}
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
          
          console.log(`
╭» 👻 𝕀𝕟𝕤𝕥𝕣𝕦𝕔𝕔𝕚𝕠𝕟𝕖𝕤 👻
│→ ${rainbowText("Por favor, complete el proceso de vinculación")}
│➫ Ingresa el código en tu WhatsApp para completar el ritual
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
          console.log(`
╭» 👻 𝔼𝕤𝕡𝕖𝕣𝕒𝕟𝕕𝕠 👻
│→ ${rainbowText("Esperando a que se complete la invocación...")}
│➫ Hanako-kun está ansioso por conocerte
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
          
        } catch (error) {
          console.log(`
╭» 👻 𝔼𝕣𝕣𝕠𝕣 𝕕𝕦𝕣𝕒𝕟𝕥𝕖 𝕧𝕚𝕟𝕔𝕦𝕝𝕒𝕔𝕚𝕠́𝕟 👻
│→ ${rainbowText("Algo ha interrumpido la invocación:")}
│➫ ${error.message}
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
          pairingInProgress = false;
        }
      };

      await startPairing();
      pairingInProgress = false;
    }

    return socket;
  } catch (error) { 
    console.log(`
╭» 👻 𝔼𝕣𝕣𝕠𝕣 𝕕𝕖 𝕔𝕠𝕟𝕖𝕩𝕚𝕠́𝕟 👻
│→ ${rainbowText("Hanako-kun no responde:")} 
│➫ ${error.message}
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
    console.log(`
╭» 👻 ℝ𝕖𝕚𝕟𝕥𝕖𝕟𝕥𝕒𝕟𝕕𝕠 👻
│→ ${rainbowText("Intentando invocar nuevamente en 1 segundo...")}
│➫ Recuerda: "Para cada deseo, hay un precio que pagar"
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
    setTimeout(startConnection, 1000);
    return null; 
  } 
}

// Iniciar el bot
const mainBot = startConnection();

// Manejo global de errores para evitar que el bot se cierre 
process.on("uncaughtException", function (err) { 
  if (!err.message.includes("No SenderKeyRecord found")) { 
    console.log(`
╭» 👻 𝔼𝕩𝕔𝕖𝕡𝕔𝕚𝕠́𝕟 𝕟𝕠 𝕔𝕠𝕟𝕥𝕣𝕠𝕝𝕒𝕕𝕒 👻
│→ ${rainbowText("Hanako-kun encontró un problema:")}
│➫ ${err}
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
  } 
});

process.on("unhandledRejection", function (reason) { 
  if (!String(reason).includes("No SenderKeyRecord found")) { 
    console.log(`
╭» 👻 ℝ𝕖𝕔𝕙𝕒𝕫𝕠 𝕟𝕠 𝕔𝕠𝕟𝕥𝕣𝕠𝕝𝕒𝕕𝕠 👻
│→ ${rainbowText("Hanako-kun no pudo cumplir un deseo:")}
│➫ ${reason}
╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺`);
  } 
});
