import letterRaw from "@/data/letterRaw";

export type Letter = {
  day: number;
  title: string;
  images: string[];
  pageTexts?: string[];
  text: string;
  isFinal: boolean;
  textEn?: string;
  pageTextsEn?: string[];
};

const oneImageDays = [24, 25];
const threeImageDays = [4, 12, 14, 20, 22];

function getFolderIndex(day: number) {
  return String(25 - day).padStart(2, "0");
}

function getImageCount(day: number) {
  if (oneImageDays.includes(day)) return 2;
  if (threeImageDays.includes(day)) return 4;
  return 3;
}

function buildImages(day: number) {
  const folderIndex = getFolderIndex(day);
  const count = getImageCount(day);

  return Array.from({ length: count }, (_, i) => {
    const fileNumber = String(i).padStart(2, "0");
    return `/notes/day${folderIndex}/${fileNumber}.jpg`;
  });
}

function normalizeRawText(raw: string) {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[–—]/g, "-")
    .replace(/\u2028/g, "\n")
    .trim();
}

function splitByDateBlocks(raw: string) {
  const text = normalizeRawText(raw);
  const regex = /12월\s*(\d{1,2})일/g;
  const matches = [...text.matchAll(regex)];

  return matches.map((match, index) => {
    const day = Number(match[1]);
    const start = match.index ?? 0;
    const contentStart = start + match[0].length;
    const end =
      index < matches.length - 1
        ? (matches[index + 1].index ?? text.length)
        : text.length;
    const content = text.slice(contentStart, end).trim();

    return { day, content };
  });
}

function splitPages(content: string) {
  return content
    .split(/\n\s*\/\s*\n/g)
    .map((part) => part.replace(/\n\s*-\s*$/g, "").trim())
    .filter((part) => part.length > 0);
}

function parseLetters(raw: string): Letter[] {
  const blocks = splitByDateBlocks(raw);

  return blocks
    .map(({ day, content }) => {
      const cleaned = content.replace(/\n\s*-\s*$/g, "").trim();
      const pageTexts = splitPages(cleaned);
      const images = buildImages(day);

      return {
        day,
        title: "",
        images,
        pageTexts: ["", ...pageTexts],
        text: pageTexts[0] ?? "",
        isFinal: day === 25,
      };
    })
    .sort((a, b) => a.day - b.day);
}

const letters = parseLetters(letterRaw);

export default letters;