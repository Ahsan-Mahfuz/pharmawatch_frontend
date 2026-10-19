import type { Metadata } from "next";
import { BatchDetail } from "@/components/batch/BatchDetail";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Batch ${id}`,
    description: `Risk score, shelf life, sales history and the recommended action for batch ${id}.`,
    alternates: { canonical: `/batches/${id}` },
    robots: { index: false },
  };
}

export default async function BatchPage({ params }: Props) {
  const { id } = await params;
  return <BatchDetail id={id} />;
}
