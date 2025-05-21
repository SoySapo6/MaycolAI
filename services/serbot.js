const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const pino = require('pino');
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
  isJidNewsletter,
  delay
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
    // Determinar si se usa código o QR
    const usarCode = args && ['code', 'sercode'].includes(args[0]);
    const usarQR = args && ['qr'].includes(args[0]) || (!args || args.length === 0);
    
    // Configurar directorios
    const sessionDir = path.join(__dirname, "../subbots");
    const sessionPath = path.join(sessionDir, from.split("@")[0]);

    // Crear directorio si no existe
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    // Mostrar reacción de procesando
    await conn.sendMessage(from, { react: { text: '⌛', key: { remoteJid: from } } });
    
    // Si hay sesión anterior y se solicita código/QR nuevo, eliminar la sesión
    if ((usarCode || usarQR) && fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, { recursive: true, force: true });
      console.log(`Sesión anterior eliminada para ${from.split("@")[0]}`);
    }

    // Enviar mensaje inicial
    await conn.sendMessage(from, { 
      text: `🔄 *Iniciando subbot...*\n\n${usarCode ? "Generando código de vinculación..." : "Preparando QR..."}\n\nPor favor espere.` 
    });

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
          printQRInTerminal: usarQR, // Mostrar QR en terminal si es modo QR
          browser: ['SoyMaycol', 'Chrome', '4.0'],
          defaultQueryTimeoutMs: 60000,
          connectTimeoutMs: 60000,
          shouldIgnoreJid: (jid) =>
            isJidBroadcast(jid) || isJidStatusBroadcast(jid) || isJidNewsletter(jid),
          keepAliveIntervalMs: 30000,
          markOnlineOnConnect: true,
          syncFullHistory: false,
          msgRetryCounterCache,
          patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
              message.buttonsMessage || 
              message.listMessage || 
              message.templateMessage
            );
            if (requiresPatch) {
              message = {
                viewOnceMessage: {
                  message: {
                    messageContextInfo: {
                      deviceListMetadata: {},
                      deviceListMetadataVersion: 2
                    },
                    ...message
                  }
                }
              };
            }
            return message;
          },
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
          console.log(`Subbot ${from.split("@")[0]} - Estado de conexión: ${connection || "Actualizando"}`);
          
          // Si hay QR y estamos en modo QR
          if (qr && usarQR) {
            try {
              // Generar la imagen QR
              const qrImage = await QRCode.toBuffer(qr);
              await conn.sendMessage(from, {
                image: qrImage,
                caption: "📲 *Escanea este QR desde WhatsApp > Vincular dispositivo*\n\nEste QR expira en 30 segundos. Si expira, envía .serbot qr nuevamente."
              });
              console.log(`QR enviado a ${from.split("@")[0]}`);
            } catch (qrError) {
              console.error("Error al generar QR:", qrError);
              await conn.sendMessage(from, { text: `❌ Error al generar QR: ${qrError.message}` });
            }
          }

          // Si se conectó exitosamente
          if (connection === "open") {
            // Notificar conexión exitosa
            await conn.sendMessage(from, {
              text: `✅ *¡Subbot conectado con éxito!*\n\n👉 Usa *#menu* para ver los comandos disponibles.\n\n📢 Canal: https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R`
            });

            // Reacción de éxito
            await conn.sendMessage(from, { react: { text: '✅', key: { remoteJid: from } } });

            // Actualizar biografía del subbot
            try {
              await delay(2000); // Esperar un poco antes de actualizar la bio
              const nuevaBio = "★彡[sᴜʙʙᴏᴛ]彡★ ᴴᵉᶜʰᵒ ᵖᵒʳ ˢᵒʸᴹᵃʸᶜᵒˡ";
              await sock.updateProfileStatus(nuevaBio);
              console.log("✅ Biografía del subbot actualizada a: " + nuevaBio);
            } catch (bioError) {
              console.error("Error al actualizar biografía:", bioError.message);
            }
          }

          // Si se desconectó
          if (connection === "close") {
            // Obtener el código de estado de desconexión
            const statusCode = lastDisconnect?.error?.output?.statusCode || 0;
            const reasonName = DisconnectReason[statusCode] || "unknown";
            
            console.log(`Subbot ${from.split("@")[0]} desconectado. Código: ${statusCode}, Razón: ${reasonName}`);

            // Si se desconectó por cierre de sesión
            if (statusCode === DisconnectReason.loggedOut) {
              if (fs.existsSync(sessionPath)) {
                fs.rmSync(sessionPath, { recursive: true, force: true });
                console.log(`Sesión eliminada para ${from.split("@")[0]} debido a cierre de sesión`);
              }
              
              await conn.sendMessage(from, {
                text: `❌ *Subbot desconectado permanentemente*\n\nSesión cerrada desde otro dispositivo.\nPara crear un nuevo subbot, usa .serbot qr o .serbot code`
              });
              
              subbotIniciado = false;
              return;
            }

            // Si debe reconectar automáticamente
            const debeReconectar = [
              DisconnectReason.connectionClosed,
              DisconnectReason.connectionLost,
              DisconnectReason.connectionReplaced, 
              DisconnectReason.timedOut,
              DisconnectReason.restartRequired
            ].includes(statusCode);

            if (debeReconectar) {
              await conn.sendMessage(from, {
                text: `🔄 *Reconectando subbot...*\n\nMotivo: ${reasonName}\nEspere un momento.`
              });
              
              subbotIniciado = false;
              setTimeout(startSubbot, 3000); // Esperar 3 segundos antes de reconectar
              return;
            }

            // Para otros errores
            await conn.sendMessage(from, {
              text: `❌ *Error en el subbot*\n\nMotivo: ${reasonName}\nCódigo: ${statusCode}\n\nIntente nuevamente con .serbot qr o .serbot code`
            });
            
            subbotIniciado = false;
          }
        });

        // Solicitar código de vinculación si se especificó
        if (usarCode) {
          try {
            // Esperar un poco para asegurar que el socket esté listo
            await delay(1000);
            
            // Solicitar el código de vinculación
            const phoneNumber = from.split("@")[0];
            console.log(`Generando código para ${phoneNumber}...`);
            
            // Notificar al usuario que se está generando el código
            await conn.sendMessage(from, { text: "🔐 *Generando código de vinculación...*" });
            
            // Esperar un poco más
            await delay(2000);
            
            // Solicitar el código
            const code = await sock.requestPairingCode(phoneNumber);
            
            // Enviar el código al usuario
            await conn.sendMessage(from, {
              text: `🔐 *Código de vinculación:*\n\n\`\`\`${code}\`\`\`\n\nIntroduce este código en WhatsApp > Vincular dispositivo > Vincular con número de teléfono`
            });
            
            console.log(`Código generado para ${phoneNumber}: ${code}`);
          } catch (codeError) {
            console.error("Error al generar código:", codeError);
            
            // Mensaje de error más detallado
            let errorMsg = `❌ *Error al generar código*\n\n`;
            
            if (codeError.message.includes("not-authorized")) {
              errorMsg += "Este número ya tiene un dispositivo vinculado. Intente con .serbot qr";
            } else if (codeError.message.includes("code request timed out")) {
              errorMsg += "La solicitud de código expiró. Intente nuevamente.";
            } else {
              errorMsg += `Error: ${codeError.message}\n\nIntente con .serbot qr como alternativa.`;
            }
            
            await conn.sendMessage(from, { text: errorMsg });
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

    await startSubbot().catch(async (error) => {
      console.error("Error crítico al iniciar subbot:", error);
      
      // Mensaje de error amigable
      let errorMsg = `❌ *Error al iniciar subbot*\n\n`;
      
      if (error.message.includes("auth")) {
        errorMsg += "Error de autenticación. Los archivos de sesión podrían estar corruptos.";
        // Intentar eliminar sesión corrupta
        if (fs.existsSync(sessionPath)) {
          fs.rmSync(sessionPath, { recursive: true, force: true });
          errorMsg += "\n\nSesión eliminada. Por favor intente nuevamente.";
        }
      } else {
        errorMsg += `${error.message}\n\nPor favor intente nuevamente en unos momentos.`;
      }
      
      await conn.sendMessage(from, { text: errorMsg });
    });

  } catch (e) {
    console.error("Error general:", e);
    
    // Mensaje de error detallado
    let errorMsg = `❌ *Error al conectar subbot*\n\n`;
    
    if (e.message.includes("ENOENT") || e.message.includes("no such file or directory")) {
      errorMsg += "Error al acceder a los archivos de sesión. Intente nuevamente.";
    } else if (e.message.includes("timeout")) {
      errorMsg += "Tiempo de espera agotado. La red puede estar lenta o inestable.";
    } else {
      errorMsg += e.message || "Error desconocido";
    }
    
    await conn.sendMessage(from, { text: errorMsg });
  }
};
