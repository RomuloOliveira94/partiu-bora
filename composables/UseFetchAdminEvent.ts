import type { Response } from "./types";

export default function useFetchAdminEvent(adminid: Ref<string | string[]>) {
  const { data: res } = useFetch<Response>(`/api/admin/${adminid.value}`);
  return { res };
}
