import { eq } from "drizzle-orm";
import db from "~/server/db";
import { eventos } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
  const adminid = getRouterParam(event, "adminid");
  const body = await readBody(event);

  if (!adminid) {
    setResponseStatus(event, 400);
    return { message: "ID inválido" };
  }

  try {
    const updated = await db
      .update(eventos)
      .set({
        nome: body.data.nome,
        local: body.data.local,
        descricao: body.data.descricao,
        data: body.data.data,
        quantidadeMaxima: body.data.quantidadeMaxima ? parseInt(body.data.quantidadeMaxima) : null,
        imageUrl: body.data.imageUrl || null,
      })
      .where(eq(eventos.linkAdmin, adminid))
      .returning();

    if (!updated.length) {
      setResponseStatus(event, 404);
      return { statusCode: 404, message: "Evento não encontrado" };
    }

    return { statusCode: 200, body: { data: updated[0], message: "Evento atualizado" } };
  } catch (error) {
    console.error(error);
    setResponseStatus(event, 500);
    return { statusCode: 500, message: "Erro ao atualizar evento" };
  }
});
