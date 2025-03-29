import axios from "axios";

export default async (socket, from, text) => {
  if (!text) {
    await socket.sendMessage(from, { text: "❌ *Debes ingresar un término para generar una imagen.*" });
    return;
  }

  await socket.sendMessage(from, { text: "⏳ *Generando imagen con Flux AI...*" });

  try {
    const result = await fluximg.create(text);
    if (result && result.imageLink) {
      await socket.sendMessage(from, {
        image: { url: result.imageLink },
        caption: `🎨 *Imagen generada para:* ${text}`,
      });
    } else {
      throw new Error("No se pudo crear la imagen. Inténtalo de nuevo.");
    }
  } catch (error) {
    console.error(error);
    await socket.sendMessage(from, { text: "❌ Error al generar la imagen." });
  }
};

const fluximg = {
  defaultRatio: "2:3",

  create: async (query) => {
    const config = {
      headers: {
        accept: "*/*",
        authority: "1yjs1yldj7.execute-api.us-east-1.amazonaws.com",
        "user-agent": "Postify/1.0.0",
      },
    };

    try {
      const response = await axios.get(
        `https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image?prompt=${encodeURIComponent(
          query
        )}&aspect_ratio=${fluximg.defaultRatio}`,
        config
      );
      return {
        imageLink: response.data.image_link,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};