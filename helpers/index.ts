export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
