export function PulseTrace({ label = "Live infrastructure pulse" }: { label?: string }) {
  const trace = "M2 25h46l8-8 10 18 13-31 14 42 12-21h28l8-7 9 14 13-26 14 38 13-19h24l8-8 8 8h29";
  return <svg className="pulse-trace" viewBox="0 0 260 48" role="img" aria-label={label}><path className="pulse-trace-base" d={trace} /><path className="pulse-trace-live" pathLength="1" d={trace} /><circle cx="257" cy="25" r="3" /></svg>;
}
