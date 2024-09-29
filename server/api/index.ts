import { nanoid } from "nanoid";
import db from "../db";
import { eventos } from "../db/schema";

interface IBody {
  data: {
    evento: string;
    registrante: string;
    registranteWhatsApp: string;
    quantidadeMaxima: number;
    data: string;
    imageUrl: string;
  };
}

export default defineEventHandler<{ body: IBody }>(async (event) => {
  const body = await readBody(event);
  if (!body) {
    return {
      statusCode: 400,
      body: "Corpo da requisição não encontrado",
    };
  }

  let nome = body.data.evento;
  let registranteNome = body.data.registrante;
  let registranteWhatsApp = body.data.registranteWhatsApp;
  let quantidadeMaxima = body.data.quantidadeMaxima;
  const dataTimestamp = new Date(body.data.data).getTime();
  let imageUrl = body.data.imageUrl;
  let data = dataTimestamp;
  let linkPublico = nanoid(10);
  let linkAdmin = nanoid(20);
  let dataDaCriacao = Date.now();

  console.log("Evento: ", nome);
  console.log("Registrante: ", registranteNome);
  console.log("Whatsapp: ", registranteWhatsApp);
  console.log("Data: ", data);
  console.log("Link Publico: ", linkPublico);
  console.log("Link Admin: ", linkAdmin);
  console.log("Data de criação: ", dataDaCriacao);
  console.log("Imagem: ", imageUrl);
  console.log("Timestamp: ", dataTimestamp);

  const createEvent = await db
    .insert(eventos)
    .values({
      nome,
      registranteNome,
      registranteWhatsApp,
      quantidadeMaxima,
      imageUrl,
      data,
      linkPublico,
      linkAdmin,
      dataDaCriacao,
    })
    .execute();

  if (!createEvent) {
    return {
      statusCode: 500,
      body: "Erro ao criar evento",
    };
  }

  return {
    statusCode: 200,
    body: "Evento criado com sucesso!",
  };
});
