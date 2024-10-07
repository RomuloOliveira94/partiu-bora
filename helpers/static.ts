import { formatDateTime } from ".";

const maleSeeds = [
  "George",
  "Chase",
  "Brian",
  "Robert",
  "Oliver",
  "Christian",
  "Wyatt",
];

const femaleSeeds = ["Jade", "Eliza", "Kimberly", "Easton", "Jameson", "Aiden"];

const hair = [
  "variant01",
  "variant02",
  "variant03",
  "variant04",
  "variant05",
  "variant06",
  "variant07",
  "variant08",
  "variant09",
  "variant10",
  "variant11",
  "variant12",
  "variant13",
  "variant14",
  "variant15",
  "variant16",
  "variant17",
  "variant18",
  "variant19",
  "variant20",
  "variant21",
  "variant22",
  "variant23",
  "variant24",
  "variant25",
  "variant26",
  "variant27",
  "variant28",
  "variant29",
  "variant30",
  "variant31",
  "variant32",
  "variant33",
  "variant34",
  "variant35",
  "variant36",
  "variant37",
  "variant38",
  "variant39",
  "variant40",
  "variant41",
  "variant42",
  "variant43",
  "variant44",
  "variant45",
];

const mouth = [
  "happy01",
  "happy02",
  "happy03",
  "happy04",
  "happy05",
  "happy06",
  "happy07",
  "happy08",
  "happy09",
  "happy10",
  "happy11",
  "happy12",
  "happy13",
  "happy14",
  "happy15",
  "happy16",
  "happy17",
  "happy18",
  "sad01",
  "sad02",
  "sad03",
  "sad04",
  "sad05",
  "sad06",
  "sad07",
  "sad08",
  "sad09",
];

const noses = [
  "variant01",
  "variant02",
  "variant03",
  "variant04",
  "variant05",
  "variant06",
];

const glasses = [
  "variant01",
  "variant02",
  "variant03",
  "variant04",
  "variant05",
];

const eyes = [
  "variant01",
  "variant02",
  "variant03",
  "variant04",
  "variant05",
  "variant06",
  "variant07",
  "variant08",
  "variant09",
  "variant10",
  "variant11",
  "variant12",
  "variant13",
  "variant14",
  "variant15",
  "variant16",
  "variant17",
  "variant18",
  "variant19",
  "variant20",
  "variant21",
  "variant22",
  "variant23",
  "variant24",
];

export const images = [
  "images/event-01.jpeg",
  "images/event-02.webp",
  "images/event-03.webp",
  "images/event-04.jpeg",
  "images/event-05.jpeg",
  "images/event-06.jpeg",
  "images/event-07.jpeg",
  "images/event-08.jpeg",
  "images/event-09.jpeg",
  "images/event-10.jpeg",
  "images/event-11.jpeg",
  "images/event-12.jpeg",
  "images/event-13.jpeg",
  "images/event-14.jpeg",
  "images/event-15.jpeg",
  "images/event-16.jpeg",
  "images/event-17.jpeg",
  "images/event-18.jpeg",
  "images/event-19.jpeg",
  "images/event-20.jpeg",
  "images/event-21.jpeg",
  "images/event-22.jpeg",
  "images/event-23.jpeg",
  "images/event-24.jpeg",
  "images/event-25.jpeg",
  "images/event-26.jpeg",
  "images/event-27.jpeg",
  "images/event-28.jpeg",
  "images/event-29.jpeg",
  "images/event-30.jpeg",
  "images/event-31.jpeg",
  "images/event-32.jpeg",
  "images/event-33.jpeg",
  "images/event-34.jpeg",
  "images/event-35.jpeg",
  "images/event-36.jpeg",
  "images/event-37.jpeg",
  "images/event-38.jpeg"
];

export function gerarCorHexClara(): string {
  const letras = "89ABCDEF"; // Usar apenas letras e números que geram cores mais claras
  let cor = "";
  for (let i = 0; i < 6; i++) {
    cor += letras[Math.floor(Math.random() * letras.length)];
  }
  return cor;
}

export function gerarAvataresAleatorios(quantidade: number): string[] {
  const avatares = [];
  const metade = Math.floor(quantidade / 2);

  for (let i = 0; i < metade; i++) {
    const randomSeed = Math.floor(Math.random() * maleSeeds.length);
    const randomMouth = Math.floor(Math.random() * mouth.length);
    const randomHair = Math.floor(Math.random() * hair.length);
    const randomNose = Math.floor(Math.random() * noses.length);
    const randomGlasses = Math.floor(Math.random() * glasses.length);
    const randomEyes = Math.floor(Math.random() * eyes.length);
    avatares.push(
      `https://api.dicebear.com/9.x/lorelei/svg?seed=${
        maleSeeds[randomSeed]
      }&backgroundColor=${gerarCorHexClara()}&hair=${hair[randomHair]}&mouth=${
        mouth[randomMouth]
      }&nose=${noses[randomNose]}&glasses=${glasses[randomGlasses]}&eyes=${
        eyes[randomEyes]
      }`
    );
  }

  for (let i = 0; i < quantidade - metade; i++) {
    const randomSeed = Math.floor(Math.random() * femaleSeeds.length);
    const randomMouth = Math.floor(Math.random() * mouth.length);
    const randomHair = Math.floor(Math.random() * hair.length);
    const randomNose = Math.floor(Math.random() * noses.length);
    const randomGlasses = Math.floor(Math.random() * glasses.length);
    const randomEyes = Math.floor(Math.random() * eyes.length);
    avatares.push(
      `https://api.dicebear.com/9.x/lorelei/svg?seed=${
        femaleSeeds[randomSeed]
      }&backgroundColor=${gerarCorHexClara()}&hair=${hair[randomHair]}&mouth=${
        mouth[randomMouth]
      }&nose=${noses[randomNose]}&glasses=${glasses[randomGlasses]}&eyes=${
        eyes[randomEyes]
      }`
    );
  }

  return avatares;
}

export const eventInviteText = (nome: string, data: number, link: string) => {
  return `Olá! Confirme a presença para o evento ${nome} que acontecerá no dia ${formatDateTime(
    data
  )}, segue link: ${link}`;
};
