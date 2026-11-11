"use client";

import { useState } from "react";
import { BookOpenText, ChevronDown, ChevronRight, Feather, Sparkles } from "lucide-react";
import { characterCategories, chronicleCharacters } from "../lib/characters";

export function CharacterChronicle({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  const selected = chronicleCharacters.find(character => character.id === selectedId) || null;
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const toggle = (id: string) => setCollapsed(previous => {
    const next = new Set(previous);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return <main className="archive-workspace character-workspace">
    <aside className="archive-index" aria-label="大陆人物志分类目录">
      <div className="archive-index-heading"><BookOpenText size={17}/><div><strong>大陆人物志</strong><span>05 RECORDS</span></div></div>
      <div className="archive-index-scroll">
        {characterCategories.map(category => {
          const entries = category.id === "special" ? chronicleCharacters : [];
          const closed = collapsed.has(category.id);
          return <section className="archive-category" key={category.id}>
            <button className="archive-category-title" aria-expanded={!closed} aria-controls={`character-category-${category.id}`} onClick={() => toggle(category.id)}>
              <span>{category.name}</span><span className="archive-category-meta"><small>{entries.length.toString().padStart(2, "0")}</small><ChevronDown size={14}/></span>
            </button>
            <div id={`character-category-${category.id}`} className="archive-category-panel" hidden={closed}>
              <p>{category.note}</p>
              {entries.length ? <div className="archive-links">{entries.map(character => <button key={character.id} className={selectedId === character.id ? "active" : ""} aria-current={selectedId === character.id ? "page" : undefined} onClick={() => onSelect(character.id)}><strong>{character.name}</strong><ChevronRight size={14}/></button>)}</div> : <div className="archive-none">尚无收录</div>}
            </div>
          </section>;
        })}
      </div>
    </aside>
    <section className="archive-reading" aria-live="polite">
      {!selected ? <div className="archive-empty"><div className="archive-empty-mark" aria-hidden="true"><Sparkles size={16}/><Feather size={30}/></div><p>我们仍追寻着前人的光辉。</p></div> : <article className="character-entry">
        <header><span>LEGENDARY ADVENTURER</span><h2>{selected.name}</h2><div><i/><Sparkles size={12}/><i/></div></header>
        <div className="character-copy">{selected.paragraphs.map((paragraph, index) => <p key={`${selected.id}-${index}`}>{paragraph.label && <strong>{paragraph.label}：</strong>}{paragraph.text}</p>)}</div>
      </article>}
    </section>
  </main>;
}
