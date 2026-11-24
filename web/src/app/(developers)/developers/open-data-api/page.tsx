import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OPEN_DATA_ENABLED } from "@/config/local-site";
import { OpenDataApiReference } from "@/features/open-data/client/components/open-data-api-reference";

export const metadata: Metadata = {
  title: "オープンデータAPI | みらい議会",
  description:
    "みらい議会のAIインタビューデータをオープンデータとして取得できるAPIのリファレンスです。",
};

export default function OpenDataApiPage() {
  if (!OPEN_DATA_ENABLED) notFound();
  return <OpenDataApiReference />;
}
