import type { Metadata } from "next";
import { MUNICIPALITY, SITE_NAME } from "@/config/local-site";
import { BillsListPage } from "@/features/bills/server/components/bills-list-page";
import type { BillsListSearchParams } from "@/features/bills/shared/utils/parse-bills-list-params";

export const metadata: Metadata = {
  title: `テーマを探す | ${SITE_NAME}`,
  description: `${MUNICIPALITY.name}の地域の課題テーマを探せます。気になるテーマにはAIインタビューで声を届けられます。`,
};

type Props = {
  searchParams: Promise<BillsListSearchParams>;
};

export default async function BillsPage({ searchParams }: Props) {
  return <BillsListPage searchParams={await searchParams} />;
}
