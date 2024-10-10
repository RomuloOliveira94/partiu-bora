import type { Response } from "./types";

export default function useMetaTags(evento: Response["evento"] | undefined) {
  const config = useRuntimeConfig();
  console.log(!evento);
  if (!evento) return {};
  const image = evento.imageUrl
    ? config.public.url + "/" + evento.imageUrl
    : config.public.url + "/images/og-image.png";

  const title = ref(evento.nome);
  const description = ref(
    `${evento.nome} criado por ${evento.registranteNome}`
  );
  const ogTitle = ref(evento.nome);
  const ogDescription = ref(
    `${evento.nome} criado por ${evento.registranteNome}`
  );
  const ogType = ref<"website">("website");
  const ogImage = ref(image);
  const ogUrl = ref(config.public.url + "/" + evento.linkPublico);
  const twitterImage = ref(image);
  const twitterCard = ref<"summary_large_image">("summary_large_image");

  useSeoMeta({
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    ogType,
    twitterImage,
    twitterCard,
  });
}
