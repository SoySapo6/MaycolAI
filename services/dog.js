const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const dogFolder = "./dogs/";
if (!fs.existsSync(dogFolder)) fs.mkdirSync(dogFolder, { recursive: true });

module.exports = async (socket, from) => {
    try {
        let response = await axios.get("https://dog.ceo/api/breeds/image/random");
        let imageUrl = response.data.message;

        let fileName = `${Date.now()}.jpg`;
        let filePath = path.join(dogFolder, fileName);

        exec(`curl -o ${filePath} ${imageUrl}`, async (error) => {
            if (error) {
                await socket.sendMessage(from, { text: "🐶 Error al descargar la imagen del perro." });
                return;
            }

            await socket.sendMessage(from, { image: { url: filePath }, caption: "Aquí tienes un perro 🐕" });
        });

    } catch (error) {
        await socket.sendMessage(from, { text: "🐶 Ocurrió un error al obtener la imagen del perro." });
    }
};