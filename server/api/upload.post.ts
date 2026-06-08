import { uploadToR2Storage } from "~/server/utils/r2";
import { setResponseStatus, createError } from "h3";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 3 * 1024 * 1024;

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const publicUrl = config.r2PublicUrl as string;

  // Workers R2 binding — only available on Cloudflare Workers runtime
  const STORAGE = (event.context as any).cloudflare?.env?.STORAGE;

  if (!STORAGE) {
    throw createError({ statusCode: 500, statusMessage: "R2 não disponível (roda em Workers?)" });
  }

  const formData = await readMultipartFormData(event);

  if (!formData || formData.length === 0) {
    setResponseStatus(event, 400);
    return { message: "Nenhum arquivo enviado" };
  }

  const file = formData[0];

  if (!file.filename) {
    setResponseStatus(event, 400);
    return { message: "Nome do arquivo não encontrado" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    setResponseStatus(event, 400);
    return { message: "Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou GIF." };
  }

  if (file.data.length > MAX_SIZE) {
    setResponseStatus(event, 400);
    return { message: "Imagem muito grande (máx 3MB)" };
  }

  try {
    const url = await uploadToR2Storage(file.data, file.filename, file.type, STORAGE, publicUrl);
    return { url };
  } catch (error) {
    console.error("Erro no upload R2:", error);
    throw createError({ statusCode: 500, statusMessage: "Erro ao fazer upload da imagem. Verifique os logs do servidor." });
  }
});
