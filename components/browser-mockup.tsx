"use client";

import { useState } from "react";
import {
  ChevronRight, ChevronDown, Share2, Rocket, Users, Plus, MessageSquare,
  Clock, LayoutTemplate, Settings, Paperclip, ArrowUp, Check, Loader2,
  Folder, FileCode, FileJson, ArrowLeft, ArrowRight, RotateCw, Monitor,
  Tablet, Smartphone, ExternalLink, Flame,
} from "lucide-react";

type FileNode = {
  name: string;
  type: "folder" | "file";
  status?: "new" | "modified";
  children?: FileNode[];
};

const fileTree: FileNode[] = [
  { name: "app", type: "folder", children: [
    { name: "page.tsx", type: "file", status: "new" },
    { name: "layout.tsx", type: "file" },
    { name: "globals.css", type: "file", status: "modified" },
  ]},
  { name: "components", type: "folder", children: [
    { name: "StreakCard.tsx", type: "file", status: "new" },
    { name: "CalendarHeatmap.tsx", type: "file", status: "new" },
    { name: "CheckInButton.tsx", type: "file", status: "new" },
  ]},
  { name: "lib", type: "folder", children: [
    { name: "streaks.ts", type: "file", status: "new" },
  ]},
  { name: "package.json", type: "file", status: "modified" },
  { name: "tailwind.config.ts", type: "file" },
];

const filesWritten = [
  { path: "app/page.tsx", status: "done" },
  { path: "components/StreakCard.tsx", status: "done" },
  { path: "components/CalendarHeatmap.tsx", status: "done" },
  { path: "components/CheckInButton.tsx", status: "done" },
  { path: "lib/streaks.ts", status: "writing" },
] as const;

const heat = [0,1,2,0,3,1,0,2,3,3,1,0,2,1,0,3,3,2,1,0,1,2,3,3,0,1,2,0,3,1,2,3,3,2,1,0];
const heatColor = (v: number) =>
  ["bg-surface-raised", "bg-forge-violet/30", "bg-forge-violet/60", "bg-forge-violet"][v];

function FileRow({ node, depth }: { node: FileNode; depth: number }) {
  const [open, setOpen] = useState(true);
  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          style={{ paddingLeft: 8 + depth * 12 }}
          className="w-full flex items-center gap-1.5 py-1 pr-2 text-[12.5px] text-ink2-secondary hover:text-ink2-primary hover:bg-surface-raised rounded-md"
        >
          {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          <Folder size={13} className="text-forge-violet shrink-0" />
          <span className="truncate">{node.name}</span>
        </button>
        {open && node.children?.map((c) => <FileRow key={c.name} node={c} depth={depth + 1} />)}
      </div>
    );
  }
  const Icon = node.name.endsWith("json") ? FileJson : FileCode;
  return (
    <div style={{ paddingLeft: 8 + depth * 12 }} className="w-full flex items-center gap-1.5 py-1 pr-2 text-[12.5px] text-ink2-secondary hover:text-ink2-primary hover:bg-surface-raised rounded-md cursor-default">
      <span className="w-3.25 shrink-0" />
      <Icon size={13} className="text-ink2-dim shrink-0" />
      <span className="truncate font-mono">{node.name}</span>
      <span className="ml-auto">
        {node.status && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${node.status === "new" ? "bg-forge-green" : "bg-forge-amber"}`} />}
      </span>
    </div>
  );
}

export default function BrowserMockup() {
  return (
    <div className="mx-auto flex min-h-160 w-full max-w-6xl flex-col overflow-hidden rounded-[24px] border border-white/10 bg-ink font-sans text-ink2-primary shadow-2xl shadow-black/30">
      {/* top bar */}
      <header className="shrink-0 border-b border-border bg-surface px-3 py-3 sm:px-4 sm:py-0 sm:h-14 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-6 w-6 rounded-md bg-logo-gradient flex items-center justify-center">
              <span className="font-display text-[13px] font-bold text-ink leading-none">A</span>
            </div>
            <span className="font-display text-[15px] tracking-tight">VibeCode</span>
          </div>
          <ChevronRight size={14} className="text-ink2-dim shrink-0" />
          <div className="flex items-center gap-1.5 min-w-0 rounded-md px-2 py-1 hover:bg-surface-raised cursor-text">
            <span className="text-[13px] text-ink2-secondary truncate">projects /</span>
            <span className="text-[13px] font-medium truncate">habit-tracker</span>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2 py-0.5 text-[11px] text-ink2-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-forge-green" /> Live
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center -space-x-2 mr-1">
            <div className="h-6 w-6 rounded-full bg-forge-violet border-2 border-surface flex items-center justify-center text-[10px] font-medium text-ink">JD</div>
            <div className="h-6 w-6 rounded-full bg-forge-amber border-2 border-surface flex items-center justify-center text-[10px] font-medium text-ink">RS</div>
          </div>
          <button className="hidden sm:flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[13px] text-ink2-secondary hover:text-ink2-primary hover:border-border-strong transition-colors">
            <Users size={14} /> Invite
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[13px] text-ink2-secondary hover:text-ink2-primary hover:border-border-strong transition-colors">
            <Share2 size={14} /> Share
          </button>
          <button className="flex items-center gap-1.5 rounded-md bg-forge-amber px-3 py-1.5 text-[13px] font-medium text-ink hover:brightness-110 transition">
            <Rocket size={14} /> Deploy
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0 flex-col lg:flex-row">
        {/* history rail */}
        <nav className="flex w-full flex-row items-center justify-between border-b border-border bg-surface px-3 py-2 lg:w-14 lg:min-w-14 lg:flex-col lg:justify-between lg:border-b-0 lg:border-r lg:py-3">
          <div className="flex flex-col items-center gap-1.5">
            {[
              { icon: Plus, label: "New build" },
              { icon: MessageSquare, label: "Chats", active: true },
              { icon: Clock, label: "History" },
              { icon: LayoutTemplate, label: "Templates" },
            ].map(({ icon: Icon, label, active }) => (
              <button key={label} title={label} aria-label={label} className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${active ? "bg-forge-violet/15 text-forge-violet" : "text-ink2-secondary hover:bg-surface-raised hover:text-ink2-primary"}`}>
                <Icon size={18} />
              </button>
            ))}
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <button title="Settings" aria-label="Settings" className="h-9 w-9 rounded-lg flex items-center justify-center text-ink2-secondary hover:bg-surface-raised hover:text-ink2-primary transition-colors">
              <Settings size={18} />
            </button>
            <div className="h-8 w-8 rounded-full bg-forge-violet flex items-center justify-center text-[11px] font-medium text-ink mt-1">JD</div>
          </div>
        </nav>

        {/* chat panel */}
        <section className="relative flex min-w-0 flex-1 flex-col border-b border-border bg-ink lg:min-w-[320px] lg:w-105 lg:border-b-0 lg:border-r">
          <div className="h-11 shrink-0 border-b border-border flex items-center justify-between px-4">
            <span className="text-[12px] font-medium uppercase tracking-wide text-ink2-secondary">Build</span>
            <button className="flex items-center gap-1 text-[12px] text-ink2-secondary hover:text-ink2-primary">
              Claude Sonnet 4.5 <ChevronDown size={13} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-surface-raised border border-border px-3.5 py-2.5 text-[13.5px] leading-relaxed">
                Build a habit tracker with daily check-ins, streaks, and a calendar heatmap. Dark theme, minimal.
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-md bg-logo-gradient flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-display text-[10px] font-bold text-ink">A</span>
                </div>
                <div className="text-[13.5px] leading-relaxed text-ink2-primary">
                  On it. Scaffolding a Next.js app with a streak tracker, check-in button, and a GitHub-style heatmap calendar.
                </div>
              </div>

              <div className="ml-7 rounded-lg border border-border bg-surface px-3 py-2.5">
                <p className="text-[11px] uppercase tracking-wide text-ink2-dim mb-2">Picking packages</p>
                <div className="flex flex-wrap gap-1.5">
                  {["next", "react", "tailwindcss", "date-fns", "framer-motion"].map((pkg) => (
                    <span key={pkg} className="font-mono text-[11px] rounded-md bg-surface-raised border border-border px-2 py-0.5 text-ink2-secondary">{pkg}</span>
                  ))}
                </div>
              </div>

              <div className="ml-7 rounded-lg border border-border bg-surface px-3 py-2.5">
                <p className="text-[11px] uppercase tracking-wide text-ink2-dim mb-2">Writing files</p>
                <ul className="space-y-1.5">
                  {filesWritten.map((f) => (
                    <li key={f.path} className="flex items-center gap-2 font-mono text-[12px]">
                      {f.status === "done" ? <Check size={13} className="text-forge-green shrink-0" /> : <Loader2 size={13} className="text-forge-amber shrink-0 animate-spin" />}
                      <span className={f.status === "done" ? "text-ink2-secondary" : "text-ink2-primary"}>{f.path}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-md bg-logo-gradient flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-display text-[10px] font-bold text-ink">A</span>
                </div>
                <div className="text-[13.5px] leading-relaxed text-ink2-primary">
                  Preview is live on the right. Streaks update automatically at midnight — want me to wire up reminders next?
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-border px-3 pt-3 pb-3.5 space-y-2.5 bg-ink">
            <div className="flex flex-wrap gap-1.5">
              {["Add reminders", "Add auth", "Dark mode toggle"].map((s) => (
                <button key={s} className="rounded-full border border-border px-2.5 py-1 text-[12px] text-ink2-secondary hover:border-border-strong hover:text-ink2-primary transition-colors">{s}</button>
              ))}
            </div>
            <div className="rounded-xl border border-border-strong bg-surface focus-within:border-forge-violet/60 transition-colors">
              <textarea rows={2} placeholder="Describe a change, or what to build next..." className="w-full resize-none bg-transparent px-3.5 pt-3 pb-1 text-[13.5px] placeholder:text-ink2-dim focus:outline-none" />
              <div className="flex items-center justify-between px-2.5 pb-2">
                <button className="h-7 w-7 rounded-md flex items-center justify-center text-ink2-secondary hover:bg-surface-raised hover:text-ink2-primary transition-colors">
                  <Paperclip size={15} />
                </button>
                <button className="h-7 w-7 rounded-md bg-forge-violet flex items-center justify-center text-ink hover:brightness-110 transition">
                  <ArrowUp size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-px top-1/2 -translate-y-1/2 h-40 w-px bg-beam-gradient animate-pulse-beam" />
        </section>

        {/* file tree */}
        <aside className="w-full border-b border-border bg-surface-sunken flex flex-col lg:w-55 lg:min-w-55 lg:border-b-0 lg:border-r">
          <div className="h-11 shrink-0 border-b border-border flex items-center px-3">
            <span className="text-[12px] font-medium uppercase tracking-wide text-ink2-secondary">Files</span>
          </div>
          <div className="flex-1 overflow-y-auto py-2 px-1.5">
            {fileTree.map((node) => <FileRow key={node.name} node={node} depth={0} />)}
          </div>
          <div className="shrink-0 border-t border-border p-3">
            <p className="text-[11px] uppercase tracking-wide text-ink2-dim mb-2">Packages</p>
            <div className="flex flex-wrap gap-1.5">
              {["next", "react", "tailwindcss", "date-fns"].map((pkg) => (
                <span key={pkg} className="font-mono text-[10.5px] rounded border border-border px-1.5 py-0.5 text-ink2-secondary">{pkg}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* preview panel */}
        <div className="flex min-w-0 flex-1 flex-col bg-surface-sunken">
          <div className="shrink-0 border-b border-border flex flex-wrap items-center gap-2 px-3 py-2 sm:h-11 sm:gap-3 sm:py-0">
            <div className="flex items-center gap-0.5">
              <button className="flex items-center h-7 px-3 rounded-md bg-surface-raised text-[12.5px] font-medium text-ink2-primary">Preview</button>
              <button className="flex items-center h-7 px-3 rounded-md text-[12.5px] text-ink2-secondary hover:text-ink2-primary">Code</button>
            </div>
            <div className="flex items-center gap-1 text-ink2-dim">
              <button className="h-6 w-6 rounded flex items-center justify-center hover:bg-surface-raised hover:text-ink2-secondary"><ArrowLeft size={13} /></button>
              <button className="h-6 w-6 rounded flex items-center justify-center hover:bg-surface-raised hover:text-ink2-secondary"><ArrowRight size={13} /></button>
              <button className="h-6 w-6 rounded flex items-center justify-center hover:bg-surface-raised hover:text-ink2-secondary"><RotateCw size={12} /></button>
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-surface px-3 h-7">
              <span className="h-1.5 w-1.5 rounded-full bg-forge-green shrink-0" />
              <span className="font-mono text-[12px] text-ink2-secondary truncate">VibeCode/preview/habit-tracker</span>
            </div>
            <div className="hidden md:flex items-center gap-0.5 rounded-md border border-border p-0.5">
              <button className="h-6 w-6 rounded flex items-center justify-center bg-surface-raised text-ink2-primary"><Monitor size={13} /></button>
              <button className="h-6 w-6 rounded flex items-center justify-center text-ink2-dim hover:text-ink2-secondary"><Tablet size={13} /></button>
              <button className="h-6 w-6 rounded flex items-center justify-center text-ink2-dim hover:text-ink2-secondary"><Smartphone size={13} /></button>
            </div>
            <button className="h-6 w-6 rounded flex items-center justify-center text-ink2-dim hover:bg-surface-raised hover:text-ink2-secondary"><ExternalLink size={13} /></button>
          </div>

          <div className="flex-1 overflow-auto p-3 sm:p-6">
            <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-border-strong bg-ink shadow-2xl shadow-black/40">
              <div className="h-9 flex items-center gap-1.5 px-3 border-b border-border bg-surface">
                <span className="h-2.5 w-2.5 rounded-full bg-forge-red/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-forge-amber/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-forge-green/70" />
              </div>
              <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="font-display text-lg font-medium">Good evening, Jordan</h1>
                    <p className="text-[13px] text-ink2-secondary">Tuesday, 22 July — 4 of 5 habits done</p>
                  </div>
                  <button className="flex items-center gap-1.5 rounded-md bg-forge-violet px-3 py-1.5 text-[12.5px] font-medium text-ink">
                    <Plus size={14} /> New habit
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { label: "Current streak", value: "12 days", icon: Flame },
                    { label: "Longest streak", value: "31 days" },
                    { label: "This week", value: "18 / 21" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg border border-border bg-surface p-3">
                      <p className="text-[11px] text-ink2-dim mb-1">{s.label}</p>
                      <p className="font-display text-base flex items-center gap-1.5">
                        {s.icon && <s.icon size={14} className="text-forge-amber" />}
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-border bg-surface p-4">
                  <p className="text-[12px] text-ink2-secondary mb-3">Last 5 weeks</p>
                  <div className="grid grid-cols-12 gap-1">
                    {heat.map((v, i) => <span key={i} className={`h-3.5 w-3.5 rounded-[3px] ${heatColor(v)}`} />)}
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { name: "Morning run", done: true },
                    { name: "Read 20 pages", done: true },
                    { name: "No sugar", done: false },
                  ].map((h) => (
                    <div key={h.name} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5">
                      <span className="text-[13.5px]">{h.name}</span>
                      <span className={`h-5 w-5 rounded-full border flex items-center justify-center ${h.done ? "bg-forge-green/20 border-forge-green text-forge-green" : "border-border-strong"}`}>
                        {h.done && <span className="h-2 w-2 rounded-full bg-forge-green" />}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}