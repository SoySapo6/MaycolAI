module.exports = async (socket, from, text) => {
  // Verifica que 'text' esté definido
  if (!text) return socket.reply(from, 'Por favor, ingresa un texto para cambiar la fuente.');

  const fonts = {
    "font1": "𝗙𝗼𝗻𝘁 𝟭",   // Fuente 1
    "font2": "𝒻𝑜𝓃𝓉 2",   // Fuente 2
    "font3": "𝔽𝕠𝕟𝕥 3",   // Fuente 3
    "font4": "f𝒐𝓃𝓉 4",   // Fuente 4
    "font5": "Ｆｏｎｔ ５",  // Fuente 5
  };

  // Mensaje inicial con botones
  const response = `
💬 *¿Qué tipo de fuente te gustaría usar?*
Elige una opción para cambiar la frase:
  `;

  const buttons = [
    { buttonText: { displayText: 'Fuente 1' }, type: 1 },
    { buttonText: { displayText: 'Fuente 2' }, type: 1 },
    { buttonText: { displayText: 'Fuente 3' }, type: 1 },
    { buttonText: { displayText: 'Fuente 4' }, type: 1 },
    { buttonText: { displayText: 'Fuente 5' }, type: 1 },
  ];

  // Enviar los botones con el mensaje
  await socket.sendButtonMessage(from, response, buttons);

  // Lógica para manejar la respuesta cuando el usuario elija una fuente (en este caso simulado)
  // Esto se deberá ajustar para capturar la respuesta real de los botones, ya que los botones no devuelven un texto directamente
  const selectedFont = fonts["font1"]; // Ejemplo de respuesta de botón
  const changedText = `${selectedFont} ${text}`;

  await socket.reply(from, `Texto cambiado: ${changedText}`);
};