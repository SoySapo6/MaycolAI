const axios = require("axios");

const { SPIDER_API_TOKEN, SPIDER_API_BASE_URL } = require("../config");
const { DangerError } = require("../errors");

const tokenErrorMessage = `Token da API do Spider X não configurado!\n
Para configurar, acesse o arquivo \`config.js\` 
e adicione o token da API do Spider X!\n
Não tem o token? Crie sua conta
em: https://api.spiderx.com.br.
na variável \`SPIDER_API_TOKEN\`.`;

function hasToken(token) {
  return token && token !== "seu_token_aqui";
}

async function playAudio(search) {
  if (!search) {
    throw new DangerError("Você precisa informar o que deseja buscar!");
  }

  if (!hasToken(SPIDER_API_TOKEN)) {
    throw new DangerError(tokenErrorMessage);
  }

  const { data } = await axios.get(
    `${SPIDER_API_BASE_URL}/downloads/play-audio?search=${encodeURIComponent(
      search
    )}&api_key=${SPIDER_API_TOKEN}`
  );

  return data;
}

async function playVideo(search) {
  if (!search) {
    throw new DangerError("Você precisa informar o que deseja buscar!");
  }

  if (!hasToken(SPIDER_API_TOKEN)) {
    throw new DangerError(tokenErrorMessage);
  }

  const { data } = await axios.get(
    `${SPIDER_API_BASE_URL}/downloads/play-video?search=${encodeURIComponent(
      search
    )}&api_key=${SPIDER_API_TOKEN}`
  );

  return data;
}

async function gpt4(text) {
  if (!text) {
    throw new DangerError("Você precisa informar o parâmetro de texto!");
  }

  if (!hasToken(SPIDER_API_TOKEN)) {
    throw new DangerError(tokenErrorMessage);
  }

  const { data } = await axios.post(
    `${SPIDER_API_BASE_URL}/ai/gpt-4?api_key=${SPIDER_API_TOKEN}`,
    {
      text,
    }
  );

  return data.response;
}

async function attp(text) {
  if (!text) {
    throw new DangerError("Você precisa informar o parâmetro de texto!");
  }

  if (!hasToken(SPIDER_API_TOKEN)) {
    throw new DangerError(tokenErrorMessage);
  }

  return `${SPIDER_API_BASE_URL}/stickers/attp?text=${encodeURIComponent(
    text
  )}&api_key=${SPIDER_API_TOKEN}`;
}

async function ttp(text) {
  if (!text) {
    throw new DangerError("Você precisa informar o parâmetro de texto!");
  }

  if (!hasToken(SPIDER_API_TOKEN)) {
    throw new DangerError(tokenErrorMessage);
  }

  return `${SPIDER_API_BASE_URL}/stickers/ttp?text=${encodeURIComponent(
    text
  )}&api_key=${SPIDER_API_TOKEN}`;
}

async function welcome(text, description, imageURL) {
  if (!text || !description || !imageURL) {
    throw new DangerError(
      "Você precisa informar o texto, descrição e URL da imagem!"
    );
  }

  if (!hasToken(SPIDER_API_TOKEN)) {
    throw new DangerError(tokenErrorMessage);
  }

  return `${SPIDER_API_BASE_URL}/canvas/welcome?text=${encodeURIComponent(
    text
  )}&description=${encodeURIComponent(
    description
  )}&image_url=${encodeURIComponent(imageURL)}&api_key=${SPIDER_API_TOKEN}`;
}

module.exports = {
  attp,
  gpt4,
  playAudio,
  playVideo,
  ttp,
  welcome,
};
