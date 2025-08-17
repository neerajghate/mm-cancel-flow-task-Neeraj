"use client";

import React from "react";
import CancelModal from "./CancelModal";

export default function CancelStart({
  open,
  onClose,
  onYes,
  onNo,
  imageUrl = "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1600&auto=format&fit=crop",
}: {
  open: boolean;
  onClose: () => void;
  onYes?: () => void;
  onNo?: () => void;
  imageUrl?: string;
}) {
  return (
    <CancelModal open={open} onClose={onClose} ariaLabel="Subscription Cancellation">
      <div className="wrap">
        <header className="topbar">
          <div />
          <div className="title">Subscription Cancellation</div>
          <button className="close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="content">
          <section className="left">
            <h1 className="hey">Hey mate,</h1>
            <h1 className="quick">Quick one before you go.</h1>
            <h2 className="question"><em>Have you found a job yet?</em></h2>

            <p className="blurb">
              Whatever your answer, we just want to help you take the next step.
              <br />
              With visa support, or by hearing how we can do better.
            </p>

            <div className="divider" />

            <div className="cta">
              <button className="btn primary" onClick={onYes}>Yes, I’ve found a job</button>
              <button className="btn ghost" onClick={onNo}>Not yet – I’m still looking</button>
            </div>
          </section>

          <aside className="right">
            <img src={imageUrl} alt="City skyline" className="hero" />
          </aside>
        </div>
      </div>

      <style jsx>{`
        .wrap { display: grid; grid-template-rows: auto 1fr; background: #fff; }
        .topbar {
          display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
          padding: 14px 18px; border-bottom: 1px solid #eef0f2;
        }
        .title { text-align: center; font-size: 14px; color: #4b5563; letter-spacing: .2px; font-weight: 600; }
        .close { justify-self: end; border: 0; background: transparent; font-size: 22px; line-height: 1;
          cursor: pointer; padding: 4px 8px; border-radius: 8px; color: #6b7280; }
        .close:hover { background: #f3f4f6; }

        .content { display: grid; grid-template-columns: 1.2fr 1fr; gap: 28px; padding: 24px; }
        .left { padding: 6px; }
        .hey, .quick { margin: 0 0 8px 0; font-size: 34px; line-height: 1.1; font-weight: 700; color: #1f2937; }
        .quick { margin-bottom: 16px; }
        .question { margin: 0 0 14px 0; font-size: 30px; line-height: 1.15; font-weight: 700; color: #1f2937; font-style: italic; }
        .blurb { margin: 0 0 18px 0; color: #6b7280; font-size: 15px; }
        .divider { height: 1px; background: #eef0f2; margin: 10px 0 16px 0; }
        .cta { display: grid; gap: 12px; }
        .btn { width: 100%; border-radius: 12px; padding: 14px 16px; font-weight: 600; cursor: pointer;
          border: 1px solid #d1d5db; background: #fff; color: #111827; }
        .btn.primary { background: #111827; color: #fff; border-color: #111827; }
        .btn.primary:hover { filter: brightness(1.05); }
        .btn.ghost:hover { background: #f9fafb; }
        .right { display: grid; place-items: center; }
        .hero { width: 100%; height: 320px; object-fit: cover; border-radius: 16px; }

        @media (min-width: 1120px) { .content { gap: 36px; padding: 28px; } .hero { height: 360px; } }
        @media (max-width: 780px) { .content { grid-template-columns: 1fr; } .hero { height: 220px; } .title { justify-self: center; } }
      `}</style>
    </CancelModal>
  );
}
