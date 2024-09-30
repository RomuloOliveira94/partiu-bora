import type { Response } from "./types";

export default function useFetchPublicEvent(publicid: Ref<string | string[]>) {
  const { data: res } = useFetch<Response>(`/api/eventos/${publicid.value}`);
  return { res };
}
