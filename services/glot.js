const axios = require("axios");

const GLOT_API_KEY = "a4a57a6e-8922-423a-b83b-12bced901c63"; // Reemplaza con tu API Key

async function ejecutarCodigo(lenguaje, codigo) {
    const url = "https://glot.io/api/run/" + lenguaje + "/latest";

    try {
        const response = await axios.post(url, {
            files: [{ name: "main." + getExtension(lenguaje), content: codigo }],
        }, {
            headers: {
                "Authorization": `Token ${GLOT_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        return response.data.stdout || response.data.stderr || "No hay salida.";
    } catch (error) {
        return "Error al ejecutar el código: " + error.message;
    }
}

function getExtension(lenguaje) {
    const extensiones = {
        "js": "js",
        "py": "py",
        "c": "c",
        "cpp": "cpp",
        "java": "java"
    };
    return extensiones[lenguaje] || "txt";
}

function mapearLenguaje(lenguaje) {
    const mapeo = {
        "js": "javascript",
        "py": "python",
        "c": "c",
        "cpp": "cpp",
        "java": "java"
    };
    return mapeo[lenguaje] || null;
}

module.exports = { ejecutarCodigo };