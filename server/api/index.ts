import { nanoid } from "nanoid";
import db from "../db";
import { eventos } from "../db/schema";

export default defineEventHandler(async (event) => {
  const createEvent = await db
    .insert(eventos)
    .values({
      nome: "Evento de teste",
      registranteNome: "Registrante de teste",
      linkPublico: nanoid(10),
      linkAdmin: nanoid(20),
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
