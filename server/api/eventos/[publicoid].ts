import { eq } from "drizzle-orm";
import db from "~/server/db";
import { eventos } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
  const publicoid = getRouterParam(event, "publicoid");

  if (!publicoid) {
    return { status: 404, body: { error: "Evento não encontrado" } };
  }

  try {
    const evento = await db
      .select()
      .from(eventos)
      .where(eq(eventos.linkPublico, publicoid));
    console.log(evento);

    if (!evento.length) {
      return { status: 404, body: { error: "Evento não encontrado" } };
    }

    return {
      status: 200,
      evento: evento[0],
    };
  } catch (error) {
    console.error(error);
    return { status: 500, body: { error: "Erro ao buscar evento" } };
  }
});
