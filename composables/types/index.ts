export interface Response {
    status: number;
    evento: {
      id: number;
      nome: string;
      data: number;
      local: string;
      imageUrl: string;
      linkPublico: string;
      linkAdmin: string;
      registranteNome: string;
      registranteWhatsApp: string;
      convidados: {
        id: number;
        nome: string;
        avatarUrl: string;
        telefone: string;
      }[];
    };
  }