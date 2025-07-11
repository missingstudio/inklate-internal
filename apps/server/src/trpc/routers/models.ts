import { publicProcedure, createTRPCRouter } from "../trpc";
import { textModels } from "~/lib/models/text";

export const modelsRouter = createTRPCRouter({
  getModelList: publicProcedure.query(async () => {
    const models = Object.entries(textModels).map(([key, model]) => ({
      id: key,
      label: model.label,
      provider: model.provider.name,
      priceIndicator: model.priceIndicator,
      default: model.default,
      disabled: model.disabled
    }));
    return { models };
  })
});
