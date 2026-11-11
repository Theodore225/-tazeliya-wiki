"use client";

import { useState } from "react";
import { BookMarked, ChevronDown, ChevronRight, Feather, MapPin, Sparkles } from "lucide-react";
import { creatureGroups, creatures, sightingNote } from "../lib/creatures";

export function CreatureBestiary({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  const selected = creatures.find(creature => creature.id === selectedId) || null;
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());

  function toggleCategory(id: string) {
    setCollapsed(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main className="creature-workspace">
      <aside className="creature-index" aria-label="大陆幻想种分类目录">
        <div className="creature-index-heading">
          <BookMarked size={17} />
          <div>
            <strong>幻想种图鉴</strong>
            <span>12 ENTRIES</span>
          </div>
        </div>
        <div className="creature-index-scroll">
          {creatureGroups.map(group => (
            <section className="creature-category" key={group.id}>
              <button
                className="creature-category-title"
                aria-expanded={!collapsed.has(group.id)}
                aria-controls={`creature-category-${group.id}`}
                onClick={() => toggleCategory(group.id)}
              >
                <span>{group.name}</span>
                <span className="creature-category-meta">
                  <small>{group.creatures.length.toString().padStart(2, "0")}</small>
                  <ChevronDown size={14} aria-hidden="true" />
                </span>
              </button>
              <div id={`creature-category-${group.id}`} className="creature-category-panel" hidden={collapsed.has(group.id)}>
                <p>{group.note}</p>
                <div className="creature-links">
                  {group.creatures.map(creature => (
                    <button
                      key={creature.id}
                      className={selectedId === creature.id ? "active" : ""}
                      aria-current={selectedId === creature.id ? "page" : undefined}
                      onClick={() => onSelect(creature.id)}
                    >
                      <span>
                        <strong>{creature.name}</strong>
                        <small>{creature.kind}</small>
                      </span>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </aside>

      <section className="creature-reading" aria-live="polite">
        {!selected ? (
          <div className="creature-empty">
            <div className="creature-empty-mark" aria-hidden="true">
              <Sparkles size={17} />
              <Feather size={31} />
            </div>
            <p>这片大陆仍在孕育新的可爱生灵。</p>
            <small>——感谢各位积极的创作让这个世界变得更加完善</small>
          </div>
        ) : (
          <article className="creature-entry">
            <header>
              <span className="creature-entry-kind">{selected.kind}</span>
              <h2>{selected.name}</h2>
              <div className="creature-entry-rule"><span /><Sparkles size={12} /><span /></div>
              <p><MapPin size={13} />{creatureGroups.find(group => group.id === selected.category)?.name}</p>
            </header>
            <div className="creature-copy">
              {selected.paragraphs.map((paragraph, index) => (
                <p key={`${selected.id}-${index}`}>
                  {paragraph.label && <strong>{paragraph.label}：</strong>}
                  {paragraph.text}
                </p>
              ))}
              <p className="sighting-note"><strong>影像记录：</strong>{sightingNote.replace("影像记录：", "")}</p>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
