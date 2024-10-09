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

const clearNumber = (value: string) => {
  return value.replace(/\D/g, "");
};

export const adminEventLink = (url: string, id: string) => {
  return `${url}/evento/admin/${id}`;
};

export const eventLink = (url: string, id: string) => {
  return `${url}/evento/${id}`;
};

export function handleGoTo(url: string) {
  window.open(url, "_blank")?.focus();
}

export function handleCopy(text: string) {
  navigator.clipboard.writeText(text);
  alert("Copiado para a área de transferência!");
}

export function handleWhatsApp(phone: string, message?: string) {
  let clearedNumber = phone.replace(/\D/g, "");

  if (!clearedNumber.startsWith("55")) {
    clearedNumber = `55${clearedNumber}`;
  }
  
  let url: string;

  if (!message) {
    url = `https://wa.me/${clearedNumber}`;
  } else {
    url = `https://wa.me/${clearedNumber}?text=${encodeURIComponent(message)}`;
  }

  handleGoTo(url);
}
