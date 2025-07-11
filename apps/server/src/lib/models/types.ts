import { LanguageModelV1 } from "ai";

export type InklateProvider = {
  id: string;
  name: string;
  icon?: React.ReactNode;
};

export type InklateModel = {
  label: string;
  provider: InklateProvider;
  disabled?: boolean;
  default?: boolean;
  priceIndicator?: PriceBracket;
};

export type PriceBracket = "lowest" | "low" | "high" | "highest";

export type InklateTextModel = InklateModel & {
  providers: (InklateProvider & {
    model: LanguageModelV1;
    getCost: ({ input, output }: { input: number; output: number }) => number;
  })[];
};
