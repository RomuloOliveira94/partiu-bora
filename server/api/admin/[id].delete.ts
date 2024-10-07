import { eq } from "drizzle-orm";
import db from "~/server/db";
import { participantes } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
  console.log("Deletar convidado");
  const id = getRouterParam(event, "adminid");

  if (!id) {
    return { status: 404, body: { error: "Evento não encontrado" } };
  }

  try {
    const deletarConvidado = await db
      .delete(participantes)
      .where(eq(participantes.id, parseInt(id)))
      .returning();

    if (!deletarConvidado) {
      return { status: 404, body: { error: "Erro deletar usuário" } };
    }

    return {
      status: 200,
      body: {
        message: "Convidado deletado com sucesso",
        data: deletarConvidado[0],
      },
    };
  } catch (error) {
    console.error(error);
    return { status: 500, body: { error: "Erro deletar usuário" } };
  }
});
