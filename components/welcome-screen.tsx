"use client";

import { ArrowUpRight } from "lucide-react";

export function WelcomeScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <main className="welcome-screen" aria-labelledby="welcome-title">
      <button className="welcome-skip" onClick={onEnter}>
        <span>跳过 · 进入工坊</span>
        <ArrowUpRight size={17} aria-hidden="true" />
      </button>
      <div className="welcome-constellation" aria-hidden="true">
        <img src="./tazeria-celestial.png" alt="" draggable={false} fetchPriority="high" />
      </div>
      <div className="welcome-message">
        <h1 id="welcome-title">欢迎转生塔泽里亚！</h1>
      </div>
      <p className="welcome-signature">秘典工坊<span aria-hidden="true"> · </span>西幻排版</p>
    </main>
  );
}
