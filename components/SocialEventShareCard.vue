<template>
  <UCard>
    <template #header>
      <h3 class="text-xl font-semibold">Compartilhar nas redes sociais:</h3>
    </template>
    <div class="flex items-center flex-wrap gap-4">
      <UButton
        variant="outline"
        color="primary"
        icon="logos:whatsapp-icon"
        @click="
          handleGoTo(
            'https://api.whatsapp.com/send?text=' +
              eventInviteText(
                evento?.nome,
                evento?.data,
                eventLink(appUrl, evento?.linkPublico)
              )
          )
        "
      >
        WhatsApp
      </UButton>
      <UButton
        variant="outline"
        color="primary"
        icon="logos:telegram"
        @click="
          handleGoTo(
            'https://t.me/share/url?url=' +
              eventInviteText(
                evento?.nome,
                evento?.data,
                eventLink(appUrl, evento?.linkPublico)
              )
          )
        "
      >
        Telegram
      </UButton>
      <UButton
        variant="outline"
        color="primary"
        icon="logos:facebook"
        @click="
          handleGoTo(
            'https://www.facebook.com/sharer/sharer.php?u=' +
              eventInviteText(
                evento?.nome,
                evento?.data,
                eventLink(appUrl, evento?.linkPublico)
              )
          )
        "
      >
        Facebook
      </UButton>
      <UButton
        variant="outline"
        color="primary"
        icon="logos:bluesky"
        @click="
          handleGoTo(
            'https://bsky.app/intent/compose?text=' +
              eventInviteText(
                evento?.nome,
                evento?.data,
                eventLink(appUrl, evento?.linkPublico)
              )
          )
        "
      >
        Bluesky
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
  import { eventInviteText } from "~/helpers/static";
  import { handleGoTo, eventLink } from "~/helpers";

  defineProps<{
    evento: any;
    appUrl: string;
  }>();
</script>

<style scoped></style>
