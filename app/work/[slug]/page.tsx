import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { works } from "../../workData";
import WorkDetailView from "../../WorkDetailView";

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const work = works.find((item) => item.slug === slug);
  if (!work) return {};
  const image = `/media/${work.cover.src}`;
  return {
    title: `${work.title} — SY Portfolio`,
    description: work.note,
    openGraph: { title: `${work.title} — SY Portfolio`, description: work.note, images: [image] },
    twitter: { title: `${work.title} — SY Portfolio`, description: work.note, images: [image] },
  };
}

export default async function WorkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!works.some((item) => item.slug === slug)) notFound();
  return <WorkDetailView slug={slug} root="/" />;
}
