import type { Response } from "./types";

export default function useMetaTags(evento: Response["evento"] | undefined) {
  const config = useRuntimeConfig();
  if (!evento) return {};

  const title = ref(evento.nome);
  const description = ref(
    `${evento.nome} criado por ${evento.registranteNome}`
  );
  const ogTitle = ref(evento.nome);
  const ogDescription = ref(
    `${evento.nome} criado por ${evento.registranteNome}`
  );
  const ogType = ref<"website">("website");
  const ogUrl = ref(`${config.public.url}/evento/${evento.linkPublico}`);
  const twitterCard = ref<"summary_large_image">("summary_large_image");

  // defineOgImageComponent("ShareEvent", {
  //   title: evento.nome,
  //   date: formatDateTime(evento.data),
  //   user: evento.registranteNome,
  //   local: evento.local,
  // });

  useSeoMeta({
    title,
    description,
    ogTitle,
    ogDescription,
    ogUrl,
    ogType,
    twitterCard,
  });
}
