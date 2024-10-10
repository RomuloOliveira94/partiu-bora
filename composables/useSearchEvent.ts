import type { FormSubmitEvent } from "#ui/types";
import * as v from "valibot";

export default function useSearchEvent() {
  const toast = useToast();

  const showEventSearch = ref(false);

  const schema = v.object({
    codigo: v.pipe(
      v.string("O código é obrigatório"),
      v.minLength(10, "O código deve ter no mínimo 10 caracteres"),
      v.maxLength(10, "O código deve ter no máximo 10 caracteres")
    ),
  });

  type Schema = v.InferOutput<typeof schema>;

  const state = reactive({
    codigo: undefined,
  });

  const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    const { body, status } = await $fetch(`/api/search/${event.data.codigo}`);
    if (status === 200) {
      const url =
        body.evento?.linkPublico === state.codigo
          ? body.evento?.linkPublico
          : `admin/${body.evento?.linkAdmin}`;
      await navigateTo(`/evento/${url}`);
      showEventSearch.value = false;
    } else {
      toast.add({
        title: "Erro",
        description: "Evento não encontrado",
        icon: "i-noto:face-with-diagonal-mouth",
        timeout: 2000,
      });
      showEventSearch.value = false;
    }
  };

  return {
    schema,
    state,
    onSubmit,
    showEventSearch,
  };
}
