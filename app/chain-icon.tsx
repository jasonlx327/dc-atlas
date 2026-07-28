export type ChainKey = "compute" | "rack" | "cooling" | "power" | "campus" | "model";

export function ChainIcon({ type, className = "chain-node-icon" }: { type: ChainKey; className?: string }) {
  const body = {
    compute: <><rect x="13" y="13" width="22" height="22" rx="3" /><path d="M18 18h12v12H18zM18 8v5m6-5v5m6-5v5M18 35v5m6-5v5m6-5v5M8 18h5m-5 6h5m-5 6h5m22-12h5m-5 6h5m-5 6h5" /></>,
    rack: <><rect x="12" y="8" width="24" height="32" rx="3" /><path d="M17 14h14M17 21h14M17 28h14M17 35h14" /><circle cx="31" cy="14" r="1" fill="currentColor" stroke="none" /><circle cx="31" cy="21" r="1" fill="currentColor" stroke="none" /><circle cx="31" cy="28" r="1" fill="currentColor" stroke="none" /></>,
    cooling: <><path d="M24 7c5 7 10 13 10 20a10 10 0 0 1-20 0c0-7 5-13 10-20Z" /><path d="M19 29c1 3 3 4 6 4" /></>,
    power: <><circle cx="24" cy="24" r="17" /><path d="m27 11-10 15h7l-3 11 10-15h-7l3-11Z" /></>,
    campus: <><path d="M8 39h32M11 39V20l10-5v24m0 0V10h16v29M15 25h3m-3 6h3m11-14h4m-4 7h4m-4 7h4" /></>,
    model: <><circle cx="13" cy="24" r="5" /><circle cx="35" cy="15" r="5" /><circle cx="35" cy="33" r="5" /><path d="m18 22 12-5m-12 9 12 5m5-11v8" /></>,
  }[type];
  return <svg className={className} viewBox="0 0 48 48" aria-hidden="true">{body}</svg>;
}
