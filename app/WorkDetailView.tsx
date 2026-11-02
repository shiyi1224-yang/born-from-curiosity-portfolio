import type { CSSProperties } from "react";
import { works, type Media } from "./workData";

// `root` is the path from this page back to the site root ("/" on the server build,
// "../../" on the static GitHub Pages build), used for media, home and next-project links.
function Figure({ item, root }: { item: Media; root: string }) {
  const src = `${root}media/${item.src}`;
  return <figure className={`gallery-item${item.failed ? " is-failed" : ""}`} style={{ "--ar": item.w / item.h, maxWidth: `${Math.round(item.w * 1.5)}px` } as CSSProperties}>
    {item.video
      ? <video src={`${root}media/${item.video}`} poster={src} controls playsInline preload="none" aria-label={item.alt} />
      : <img src={src} alt={item.alt} width={item.w} height={item.h} loading="lazy" decoding="async" />}
    {item.failed && <span className="failed-tag">FAILED</span>}
    <figcaption>{item.caption}</figcaption>
  </figure>;
}

export default function WorkDetailView({ slug, root }: { slug: string; root: string }) {
  const index = Math.max(0, works.findIndex((item) => item.slug === slug));
  const work = works[index];
  const next = works[(index + 1) % works.length];
  return <main className="work-detail">
    <nav><a href={root}>← RETURN TO THE NETWORK</a><span>{work.n} / {String(works.length).padStart(2, "0")}</span></nav>
    <section className="detail-hero">
      <figure className="detail-art" style={{ aspectRatio: `${work.cover.w} / ${work.cover.h}` }}>
        <img src={`${root}media/${work.cover.src}`} alt={work.cover.alt} style={{ objectPosition: work.coverPosition }} />
        <figcaption>{work.cover.caption}</figcaption>
      </figure>
      <div className="detail-copy">
        <p className="eyebrow light">{work.type}</p>
        <h1>{work.title}</h1>
        <p className="detail-lede">{work.statement[0]}</p>
        {work.statement.slice(1).map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
        <dl className="detail-facts">
          <div><dt>ROLE</dt><dd>{work.role}</dd></div>
          <div><dt>CONTEXT</dt><dd>{work.school} · {work.year}</dd></div>
          <div><dt>MEDIUM</dt><dd>{work.medium}</dd></div>
          {work.credits && <div><dt>CREDITS</dt><dd>{work.credits}</dd></div>}
        </dl>
      </div>
    </section>
    {work.sections.map((section) => <section className="process" key={section.label}>
      <header><p className="eyebrow light">{section.label.toUpperCase()}</p><p>{section.note}</p></header>
      {section.rows.map((row, r) => <div className="gallery-row" key={r}>{row.map((item) => <Figure item={item} root={root} key={item.src} />)}</div>)}
    </section>)}
    <div className="detail-meta"><a href={root}>← NETWORK</a><a href={`${root}work/${next.slug}/`}>NEXT NODE / {next.n} · {next.title} →</a></div>
  </main>;
}
