<template>
  <header class="border-b border-gray-200 border-opacity-10 bg-transparent">
    <div class="container mx-auto py-8 sm:px-6 sm:py-12 p-8">
      <div
        class="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 class="text-2xl font-bold sm:text-3xl">
            Partiu Bora?
          </h1>

          <p class="mt-1.5 text-sm">
            Organize seus eventos de forma simples e rápida, e convide seus
            amigos para participar.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <UButton
            class="inline-flex items-center justify-center gap-1.5 rounded border border-gray-200 bg-white px-3 py-3 text-gray-900 transition hover:text-gray-700 focus:outline-none focus:ring"
            variant="solid"
            color="black"
          >
            <span class="text-sm font-medium"> Já tenho um evento </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </UButton>

          <UButton
            class="inline-block rounded px-3 py-3 text-sm font-medium text-white transition  focus:outline-none focus:ring"
            type="button"
          >
            Criar um evento
          </UButton>
        </div>
      </div>
    </div>
  </header>
</template>
