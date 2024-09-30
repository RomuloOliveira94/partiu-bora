export interface Response {
    status: number;
    evento: {
      id: number;
      nome: string;
      data: number;
      descricao: string;
      local: string;
      endereco: string;
      cidade: string;
      estado: string;
      pais: string;
      imageUrl: string;
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