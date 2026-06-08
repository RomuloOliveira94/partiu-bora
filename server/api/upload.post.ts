import { uploadToR2 } from "~/server/utils/r2";
import { setResponseStatus, createError } from "h3";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_SIZE = 3 * 1024 * 1024; // 3MB

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Check if R2 is configured
  if (
    !config.r2AccountId ||
    !config.r2AccessKeyId ||
    !config.r2SecretAccessKey ||
    !config.r2BucketName ||
    !config.r2PublicUrl
  ) {
    throw createError({ statusCode: 500, statusMessage: "Configuração do R2 não encontrada" });
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

  // Validate MIME type
  if (!ALLOWED_TYPES.includes(file.type)) {
    setResponseStatus(event, 400);
    return { message: "Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou GIF." };
  }

  // Validate size
  if (file.data.length > MAX_SIZE) {
    setResponseStatus(event, 400);
    return { message: "Imagem muito grande (máx 3MB)" };
  }

  try {
    const url = await uploadToR2(
      file.data,
      file.filename,
      file.type,
      {
        accountId: config.r2AccountId,
        accessKeyId: config.r2AccessKeyId,
        secretAccessKey: config.r2SecretAccessKey,
        bucketName: config.r2BucketName,
        publicUrl: config.r2PublicUrl,
      }
    );

    return { url };
  } catch (error: any) {
    console.error("Erro ao fazer upload para R2:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erro ao fazer upload da imagem. Verifique os logs do servidor."
    });
  }
});