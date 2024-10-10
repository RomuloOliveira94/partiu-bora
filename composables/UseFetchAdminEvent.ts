import type { Response } from "./types";

export default async function useFetchAdminEvent(
  adminid: Ref<string | string[]>
) {
  const { data: res } = await useFetch<Response>(`/api/admin/${adminid.value}`);
  return { res };
}
