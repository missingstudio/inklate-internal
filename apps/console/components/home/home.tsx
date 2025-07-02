import { useTRPC } from "~/providers/query-provider";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export function Home() {
  const trpc = useTRPC();
  const { t, i18n } = useTranslation();

  const { data: hello, isLoading: isLoadingLabels } = useQuery(trpc.hello.queryOptions());
  return <div>{t("hello")}</div>;
}
