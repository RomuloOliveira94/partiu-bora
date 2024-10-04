import type { FormSubmitEvent } from "#ui/types";
import * as v from "valibot";
import type { Response } from "./types";

export default function useSubmitParticipate(
  showConfirmModal: Ref<boolean>,
  evento: Ref<Response | null>,
  isPart: Ref<string | null | undefined>
) {
  const toast = useToast();
  const schema = v.object({
    nome: v.pipe(v.string("O seu nome é obrigatório."), v.maxLength(22)),
    telefone: v.pipe(
      v.string("O seu telefone é obrigatório."),
      v.minLength(15, "O telefone está incompleto."),
      v.maxLength(15, "O telefone está incompleto.")
    ),
    avatarUrl: v.optional(v.string()),
  });

  type Schema = v.InferOutput<typeof schema>;

  const state = reactive({
    nome: undefined,
    telefone: undefined,
    avatarUrl: "",
  });

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    const { body, status } = await $fetch(
      `/api/eventos/${evento.value?.evento.id}`,
      {
        method: "POST",
        body: JSON.stringify(event),
      }
    );

    if (status === 200) {
      showConfirmModal.value = false;
      evento.value?.evento?.convidados?.push({
        id: body.data.id,
        nome: body.data.nome,
        avatarUrl: body.data.avatarUrl,
        telefone: body.data.telefone,
      });
      state.nome = undefined;
      state.telefone = undefined;
      state.avatarUrl = "";
      isPart.value = "true";
      toast.add({
        title: "Presença confirmada!",
        description: "Obrigado por confirmar sua presença!",
        icon: "i-heroicons-check-circle-20-solid",
        timeout: 5000,
      });
    }

    if (status === 404 || status === 500) {
      toast.add({
        title: "Erro",
        description:
          "Ocorreu um erro ao tentar confirmar sua presença, tente novamente.",
        icon: "i-noto:face-with-diagonal-mouth",
        timeout: 5000,
      });
    }
  }

  return {
    state,
    schema,
    onSubmit,
  };
}
