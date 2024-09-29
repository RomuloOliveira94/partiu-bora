import { relations } from "drizzle-orm";
import { text, integer, sqliteTable, numeric } from "drizzle-orm/sqlite-core";

export const eventos = sqliteTable("eventos", {
  id: integer("id").primaryKey(),
  nome: text("nome").notNull(),
  registranteNome: text("registrante_nome").notNull(),
  registranteWhatsApp: text("registrante_whatsapp").notNull(),
  imageUrl: text("imagem_url"),
  quantidadeMaxima: integer("quantidade_maxima"),
  linkPublico: text("link_publico").unique().notNull(),
  linkAdmin: text("link_admin").unique().notNull(),
  data: integer("data").notNull(),
  dataDaCriacao: integer("data_da_criacao").notNull(),
});

export const eventosRelations = relations(eventos, ({ many }) => ({
  participantes: many(participantes),
}));

export const participantes = sqliteTable("participantes", {
  id: integer("id").primaryKey(),
  nome: text("nome").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  telefone: text("telefone").notNull(),
  eventoId: integer("evento_id").notNull(),
});

export const participantesRelations = relations(participantes, ({ one }) => ({
  evento: one(eventos, {
    fields: [participantes.eventoId],
    references: [eventos.id],
  }),
}));

export type Evento = typeof eventos.$inferSelect;
export type NovoEvento = typeof eventos.$inferInsert;
export type Participante = typeof participantes.$inferSelect;
export type NovoParticipante = typeof participantes.$inferInsert;
