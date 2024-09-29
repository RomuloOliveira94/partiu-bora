import db from "~/server/db";
import { NovoParticipante, participantes } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
  const publicoid = getRouterParam(event, "publicoid");
  const body = await readBody(event);
  console.log("Publicoid: ", publicoid);
  console.log("Body: ", body);

  if (!publicoid) {
    return { status: 404, body: { error: "Evento não encontrado" } };
  }

  try {
    const dados: NovoParticipante = {
      nome: body.data.nome,
      telefone: body.data.telefone,
      avatarUrl: body.data.avatarUrl,
      eventoId: parseInt(publicoid),
    };

    const salvarParticipante = await db
      .insert(participantes)
      .values(dados)
      .returning();

    if (!salvarParticipante.length) {
      return { status: 404, body: { error: "Erro ao entrar no evento" } };
    }

    return {
      status: 200,
      body: {
        message: "Participante adicionado com sucesso",
        data: salvarParticipante[0],
      },
    };
  } catch (error) {
    console.error(error);
    return { status: 500, body: { error: "Erro ao buscar evento" } };
  }
});
