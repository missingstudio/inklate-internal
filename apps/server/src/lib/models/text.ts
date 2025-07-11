import { providers } from "~/utils/providers";
import { InklateTextModel } from "./types";
import { openai } from "@ai-sdk/openai";

const million = 1000000;
const thousand = 1000;

export const textModels: Record<string, InklateTextModel> = {
  "gpt-3.5-turbo": {
    label: "GPT-3.5 Turbo",
    provider: providers.openai,
    providers: [
      {
        ...providers.openai,
        model: openai("gpt-3.5-turbo"),
        getCost: ({ input, output }: { input: number; output: number }) => {
          const inputCost = (input / million) * 0.5;
          const outputCost = (output / million) * 1.5;

          return inputCost + outputCost;
        }
      }
    ],
    priceIndicator: "lowest"
  },
  "gpt-4": {
    label: "GPT-4",
    provider: providers.openai,
    providers: [
      {
        ...providers.openai,
        model: openai("gpt-4"),
        getCost: ({ input, output }: { input: number; output: number }) => {
          const inputCost = (input / million) * 30;
          const outputCost = (output / million) * 60;

          return inputCost + outputCost;
        }
      }
    ],
    priceIndicator: "highest"
  },

  "gpt-4o": {
    label: "GPT-4o",
    provider: providers.openai,
    providers: [
      {
        ...providers.openai,
        model: openai("gpt-4o"),
        getCost: ({ input, output }: { input: number; output: number }) => {
          const inputCost = (input / million) * 2.5;
          const outputCost = (output / million) * 10;

          return inputCost + outputCost;
        }
      }
    ],
    default: true
  },
  "gpt-4o-mini": {
    label: "GPT-4o Mini",
    provider: providers.openai,
    providers: [
      {
        ...providers.openai,
        model: openai("gpt-4o-mini"),
        getCost: ({ input, output }: { input: number; output: number }) => {
          const inputCost = (input / million) * 0.15;
          const outputCost = (output / million) * 0.6;

          return inputCost + outputCost;
        }
      }
    ],
    priceIndicator: "lowest"
  },
  o1: {
    label: "O1",
    provider: providers.openai,
    providers: [
      {
        ...providers.openai,
        model: openai("o1"),
        getCost: ({ input, output }: { input: number; output: number }) => {
          const inputCost = (input / million) * 15;
          const outputCost = (output / million) * 60;

          return inputCost + outputCost;
        }
      }
    ],
    priceIndicator: "highest"
  },
  "o1-mini": {
    label: "O1 Mini",
    provider: providers.openai,
    providers: [
      {
        ...providers.openai,
        model: openai("o1-mini"),
        getCost: ({ input, output }: { input: number; output: number }) => {
          const inputCost = (input / million) * 1.1;
          const outputCost = (output / million) * 4.4;

          return inputCost + outputCost;
        }
      }
    ],
    priceIndicator: "low"
  }
};
