import { eq } from "drizzle-orm";
import db from "~/server/db";
import { eventos, participantes } from "~/server/db/schema";


export default defineEventHandler(async (event) => {
  const publicoid = getRouterParam(event, "publicoid");

  if (!publicoid) {
    return { status: 404, body: { error: "Evento não encontrado" } };
  }

  try {
    const resultado = await db
      .select({
        evento: eventos,
        participantes: participantes,
      })
      .from(eventos)
      .leftJoin(participantes, eq(eventos.id, participantes.eventoId))
      .where(eq(eventos.linkPublico, publicoid))
      .all();

    if (!resultado.length) {
      return { status: 404, body: { error: "Evento não encontrado" } };
    }

    const evento = {
      ...resultado[0].evento,
      convidados: resultado.map((row) => row.participantes).filter(Boolean),
    };

    return {
      status: 200,
      evento,
    };
  } catch (error) {
    console.error(error);
    return { status: 500, body: { error: "Erro ao buscar evento" } };
  }
});
