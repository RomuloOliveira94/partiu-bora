<template>
  <div class="grid">
    <div>
      <h2 class="text-2xl">Convidados:</h2>
      <div class="grid lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-4">
        <div
          v-if="
            convidados && convidados.length > 0
          "
          v-for="convidado in convidados"
          :key="convidado.id"
          class="relative"
        >
          <UCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="w-full" @click="desconvidar(convidado.id)">
                  <span class="block"> Nome: </span>
                  <strong>{{ convidado.nome.slice(0, 18) }}</strong>
                </p>
                <p
                  class="mt-1.5 flex items-center gap-1 hover:cursor-pointer hover:text-blue-500 hover:underline"
                  @click="handleWhatsApp(convidado.telefone)"
                >
                  <UIcon name="i-logos:whatsapp-icon" class="w-5 h-5" />
                  <strong>{{ convidado.telefone }}</strong>
                </p>
              </div>
              <div class="grid gap-2">
                <UTooltip
                  text="Desconvidar Usuário"
                  class="absolute -top-2 -right-3 rounded-full z-30"
                  v-if="isAdmin"
                >
                  <UButton
                    color="red"
                    icon="i-heroicons-x-circle-20-solid"
                    size="xs"
                    class="text-sm rounded-full"
                    @click="desconvidar(convidado.id)"
                  />
                </UTooltip>
                <UAvatar
                  @click="desconvidar(convidado.id)"
                  :src="
                    convidado.avatarUrl
                      ? convidado.avatarUrl
                      : `https://ui-avatars.com/api/?name=${convidado.nome}&background=random`
                  "
                  size="xl"
                />
              </div>
            </div>
          </UCard>
        </div>
      </div>
      <div v-if="convidados && convidados.length <= 0">
        <h2 class="text-lg font-bold mt-4">
          Nenhum convidado confirmado ainda, convide alguém!
        </h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    convidados:
      | {
          id: number;
          nome: string;
          telefone: string;
          avatarUrl?: string;
        }[]
      | undefined
      | null;
    isAdmin?: Boolean;
  }>();
  const emit = defineEmits(["desconvidar", "handleWhatsApp"]);
  const desconvidar = (id: number) => emit("desconvidar", id);
  const handleWhatsApp = (telefone: string) => emit("handleWhatsApp", telefone);
</script>

<style scoped></style>
