const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const pino = require('pino');
const { delay } = require('delay');
const NodeCache = require('node-cache');

// Importaciones actualizadas de @whiskeysockets/baileys
const { 
  default: makeWASocket, 
  DisconnectReason, 
  useMultiFileAuthState, 
  fetchLatestBaileysVersion, 
  isJidBroadcast, 
  isJidStatusBroadcast, 
  proto, 
  isJidNewsletter
} = require("@whiskeysockets/baileys");

// Importar el manejador de comandos
const manejarComando = require("../index.js");

// Crear una caché para los reintentos de mensajes
const msgRetryCounterCache = new NodeCache();

// Función para eliminar acentos y caracteres especiales
function removeAccentsAndSpecialCharacters(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "");
}

// Función para crear un almacén simple en memoria
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

module.exports = async (conn, from, args) => {
  try {
    const usarCode = args && ['code', 'sercode'].includes(args[0]);
    const sessionDir = path.join(__dirname, "../subbots");
    const sessionPath = path.join(sessionDir, from.split("@")[0]);

    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    await conn.sendMessage(from, { react: { text: '⌛', key: { remoteJid: from } } });

    let subbotIniciado = false;

    const startSubbot = async () => {
      if (subbotIniciado) return;
      subbotIniciado = true;

      try {
        // Obtener el estado de autenticación
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        // Obtener la versión más reciente de Baileys
        const { version } = await fetchLatestBaileysVersion();
        // Crear un logger silencioso
        const logger = pino({ level: "silent" });
        // Crear el store simple
        const store = createSimpleStore();

        // Crear el socket con las configuraciones actualizadas
        const sock = makeWASocket({
          version,
          logger,
          auth: state,
          printQRInTerminal: false,
          browser: ['SoyMaycol', 'Chrome', '1.0'],
          defaultQueryTimeoutMs: 60 * 1000,
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

        // Enlazar el store con el socket
        store.bind(sock.ev);

        // Manejar actualizaciones de credenciales
        sock.ev.on("creds.update", saveCreds);

        // Manejar mensajes entrantes
        sock.ev.on('messages.upsert', async ({ messages, type }) => {
          const m = messages[0];
          if (!m || !m.message || m.key.fromMe) return;

          // Extraer el texto del mensaje
          let texto = '';
          const msgType = Object.keys(m.message)[0];
          
          if (msgType === 'conversation') texto = m.message.conversation;
          else if (msgType === 'extendedTextMessage') texto = m.message.extendedTextMessage.text;
          else if (msgType === 'imageMessage' && m.message.imageMessage.caption) texto = m.message.imageMessage.caption;
          else if (msgType === 'videoMessage' && m.message.videoMessage.caption) texto = m.message.videoMessage.caption;

          texto = texto.trim();
          const jid = m.key.remoteJid;

          // Verificar el prefijo
          const prefix = ['.', '/', '#', '!', '?'].find(p => texto.startsWith(p));
          if (!prefix) return;

          const args = texto.slice(1).trim().split(/ +/);
          const command = args.shift().toLowerCase();
          const cleanCommand = removeAccentsAndSpecialCharacters(command);

          try {
            // Registrar el comando en la consola
            console.log(`
╔════════════════════╗
║ 🤖 ✧ 𝑪𝒐𝒎𝒂𝒏𝒅𝒐 𝑺𝒖𝒃𝒃𝒐𝒕 ✧ 🤖 ║
╚════════════════════╝

⌨️ Comando: ${cleanCommand}
🔧 Argumentos: ${args.join(' ')}
👤 Usuario: ${jid.split('@')[0]}
━━━━━༺༻━━━━━
`);
            
            // Ejecutar el comando
            await manejarComando(sock, jid, cleanCommand, args);
          } catch (err) {
            console.error("Error al ejecutar comando:", err);
            await sock.sendMessage(jid, { text: "❌ Ocurrió un error al ejecutar el comando." });
          }
        });

        // Manejar actualizaciones de conexión
        sock.ev.on("connection.update", async ({ connection, qr, lastDisconnect }) => {
          if (qr && !usarCode) {
            // Generar la imagen QR
            const qrImage = await QRCode.toBuffer(qr);
            await conn.sendMessage(from, {
              image: qrImage,
              caption: "📲 Escanea el QR desde *WhatsApp > Vincular dispositivo*"
            });
          }

          if (connection === "open") {
            // Notificar conexión exitosa
            await conn.sendMessage(from, {
              text: `✅ *Subbot conectado con éxito.*\n\nUsa *#menu* para ver los comandos disponibles.\n\nCanal: https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R`
            });

            // Actualizar biografía del subbot
            try {
              const nuevaBio = "★彡[sᴜʙʙᴏᴛ]彡★ ᴴᵉᶜʰᵒ ᵖᵒʳ ˢᵒʸᴹᵃʸᶜᵒˡ";
              await sock.updateProfileStatus(nuevaBio);
              console.log("✅ Biografía del subbot actualizada a: " + nuevaBio);
            } catch (error) {
              console.error("❌ Error al actualizar la biografía del subbot:", error.message);
            }
          }

          if (connection === "close") {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const reasonCode = DisconnectReason[statusCode] || "Desconocido";
            
            console.log(`Subbot desconectado. Motivo: ${reasonCode} (Código: ${statusCode})`);

            if (reasonCode !== 'loggedOut') {
              await conn.sendMessage(from, {
                text: `❌ *Subbot desconectado.* Motivo: ${reasonCode}.`
              });
            }

            const debeReconectar = ['restartRequired', 'connectionClosed', 'timedOut'].includes(reasonCode);

            if (usarCode) {
              subbotIniciado = false;
              return;
            }

            if (debeReconectar) {
              subbotIniciado = false;
              setTimeout(startSubbot, 1000);
              return;
            }

            if (reasonCode === 'loggedOut') {
              // Borrar la sesión si se cerró sesión
              if (fs.existsSync(sessionPath)) fs.rmSync(sessionPath, { recursive: true, force: true });
              await conn.sendMessage(from, {
                text: `❌ *Subbot desconectado permanentemente.* Motivo: Sesión cerrada.`
              });
            }
          }
        });

        // Solicitar código de vinculación si se especificó
        if (usarCode) {
          try {
            const code = await sock.requestPairingCode(from.split("@")[0]);
            await conn.sendMessage(from, {
              text: `🔐 *Código generado:*\n\n${code}`
            });
          } catch (e) {
            await conn.sendMessage(from, {
              text: `❌ Error al generar código: ${e.message}`
            });
            subbotIniciado = false;
          }
        }
      } catch (error) {
        console.error("Error al iniciar subbot:", error);
        await conn.sendMessage(from, {
          text: `❌ Error al iniciar subbot: ${error.message || error}`
        });
        subbotIniciado = false;
      }
    };

    await startSubbot();

  } catch (e) {
    console.error("Error al conectar subbot:", e);
    await conn.sendMessage(from, {
      text: `❌ Error al conectar subbot: ${e.message || e}`
    });
  }
};
