<template>
  <div class="mb-4" :class="class">
    <UAlert
      v-if="isPart && config.public.environment === 'production'"
      icon="i-heroicons-check-circle-20-solid"
      title="Presença confirmada!"
      color="primary"
      variant="solid"
      class="text-lg w-full mt-2 md:w-72 p-2"
      :ui="{ title: 'text-lg', icon: { base: 'h-8 w-8' } }"
    />

    <UButton
      v-else
      color="primary"
      icon="i-heroicons-check-circle-20-solid"
      size="lg"
      class="text-lg w-full mt-2 md:w-auto"
      @click="confirmPresence"
    >
      Marcar Presença!
    </UButton>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    isPart?: string | null | undefined;
    config: any;
    class?: string;
  }>();

  const emit = defineEmits(["confirmPresence"]);

  const confirmPresence = () => {
    emit("confirmPresence", true);
  };
</script>

<style scoped></style>
