import type { Response } from "./types";

export default async function useFetchPublicEvent(publicid: Ref<string | string[]>) {
  const { data: res } = await useFetch<Response>(`/api/eventos/${publicid.value}`);
  return { res };
}
