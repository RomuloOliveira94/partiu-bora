import { eq, sql } from "drizzle-orm";
import db from "~/server/db";
import { Evento, eventos } from "~/server/db/schema";

interface Response {
  status: number;
  body: {
    error?: string;
    evento?: Evento;
  };
}

export default defineEventHandler(async (event): Promise<Response> => {
  const codigo = getRouterParam(event, "id");

  if (!codigo) {
    return { status: 404, body: { error: "Evento não encontrado" } };
  }

  try {
    const evento = db
      .select()
      .from(eventos)
      .where(sql`link_publico = ${codigo} or link_admin = ${codigo}`)
      .get();

    if (!evento) {
      return { status: 404, body: { error: "Evento não encontrado" } };
    }

    return {
      status: 200,
      body: {
        error: undefined,
        evento: evento,
      },
    };
  } catch (error) {
    console.error(error);
    return { status: 500, body: { error: "Erro ao buscar evento" } };
  }
});
