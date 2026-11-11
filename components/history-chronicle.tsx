"use client";

import { Fragment, useState } from "react";
import { BookOpenCheck, ChevronRight, Library } from "lucide-react";
import { historyEras, type HistoryEvent } from "../lib/history";

function emphasized(text: string, phrases: string[] = []) {
  if (!phrases.length) return text;
  const escaped = phrases.map(phrase => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const matcher = new RegExp(`(${escaped.join("|")})`, "g");
  return text.split(matcher).map((part, index) => phrases.includes(part) ? <strong key={`${part}-${index}`}>{part}</strong> : <Fragment key={`${part}-${index}`}>{part}</Fragment>);
}

function TimelineEvent({ event, index }: { event: HistoryEvent; index: number }) {
  const [open, setOpen] = useState(false);
  const hasDetail = !!event.detail?.length;
  return <article className={`timeline-event ${index % 2 ? "timeline-left" : "timeline-right"} ${hasDetail ? "has-detail" : ""}`}>
    <button className="timeline-dot" aria-label={hasDetail ? `${event.date}，查看详细记载` : `${event.date}，无详细记载`} aria-expanded={hasDetail ? open : undefined} disabled={!hasDetail} onClick={() => hasDetail && setOpen(value => !value)}><span/></button>
    <div className="timeline-card">
      <button className="timeline-card-summary" disabled={!hasDetail} aria-expanded={hasDetail ? open : undefined} onClick={() => hasDetail && setOpen(value => !value)}>
        <time>{event.date}</time><p>{emphasized(event.summary, event.emphasis)}</p>{hasDetail && <span className="timeline-more">{open ? "收起馆藏" : "展开馆藏"}<ChevronRight size={12}/></span>}
      </button>
      {open && event.detail && <div className="timeline-detail">{event.detail.map((paragraph, detailIndex) => <p key={`${event.id}-detail-${detailIndex}`}>{emphasized(paragraph, event.emphasis)}</p>)}</div>}
    </div>
  </article>;
}

export function HistoryChronicle({ selectedEraId, onSelectEra }: { selectedEraId: string | null; onSelectEra: (id: string) => void }) {
  const selectedEra = historyEras.find(era => era.id === selectedEraId) || null;
  return <main className="archive-workspace history-workspace">
    <aside className="archive-index" aria-label="大陆有旧事历史分区">
      <div className="archive-index-heading"><Library size={17}/><div><strong>大陆有旧事</strong><span>04 ARCHIVES</span></div></div>
      <div className="archive-index-scroll history-index-scroll">
        <p className="history-index-note">请选择一段纪年，循着光点阅览。</p>
        <div className="history-era-links">{historyEras.map(era => <button key={era.id} className={selectedEraId === era.id ? "active" : ""} aria-current={selectedEraId === era.id ? "page" : undefined} onClick={() => onSelectEra(era.id)}><span><small>{era.events.length.toString().padStart(2, "0")}</small><strong>【{era.name}】</strong></span><ChevronRight size={15}/></button>)}</div>
      </div>
    </aside>
    <section className="archive-reading history-reading" aria-live="polite">
      {!selectedEra ? <div className="archive-empty history-empty"><div className="archive-empty-mark" aria-hidden="true"><BookOpenCheck size={30}/></div><p>以下记载来自莱恩维亚中心图书馆</p></div> : <div className="history-scroll">
        <header className="history-era-heading"><span>LYNNVIA CENTRAL LIBRARY</span><h2>【{selectedEra.name}】</h2><p>光点可展开处，藏有《新纪年史-大陆通用版》的详细记载。</p></header>
        <div className="timeline"><svg className="timeline-line" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M50 0 C39 105 61 190 49 285 S39 465 51 570 S62 755 49 845 S44 945 50 1000"/></svg>{selectedEra.events.map((event, index) => <TimelineEvent key={event.id} event={event} index={index}/>)}</div>
      </div>}
    </section>
  </main>;
}
