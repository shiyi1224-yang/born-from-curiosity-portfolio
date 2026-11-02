import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Home from "../app/page";
import { works } from "../app/workData";
import WorkDetailView from "../app/WorkDetailView";
import "../app/globals.css";

function WorkDetail({ slug }: { slug: string }) {
  const work = works.find((item) => item.slug === slug) ?? works[0];
  useEffect(() => {
    document.title = `${work.title} — SY Portfolio`;
  }, [work.title]);
  return <WorkDetailView slug={work.slug} root="../../" />;
}

function StaticPortfolio() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const workPosition = parts.lastIndexOf("work");
  const slug = workPosition >= 0 ? parts[workPosition + 1] : undefined;

  useEffect(() => {
    if (!slug) document.title = "SY — Born from Curiosity";
  }, [slug]);

  return slug ? <WorkDetail slug={slug} /> : <Home />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StaticPortfolio />
  </StrictMode>,
);
