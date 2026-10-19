import { Logo } from "@/components/layout/Logo";

export function AuthMark() {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="text-pine dark:text-mint">
        <Logo />
      </span>
      <span>
        <span className="block font-display text-[23px] leading-none font-[750] tracking-[-0.025em]">
          PharmaWatch
        </span>
        <span className="mt-1.5 block font-mono text-[10.5px] tracking-[0.14em] text-ink-3 uppercase">
          Batch level expiry control
        </span>
      </span>
    </div>
  );
}
