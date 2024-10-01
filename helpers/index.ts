export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDateTime = (date: number | undefined) => {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function gerarCorHexClara(): string {
  const letras = "89ABCDEF"; // Usar apenas letras e números que geram cores mais claras
  let cor = "#";
  for (let i = 0; i < 6; i++) {
    cor += letras[Math.floor(Math.random() * letras.length)];
  }
  return cor;
}