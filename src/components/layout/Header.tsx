import { AccountMenu } from "./AccountMenu";
import { Logo } from "./Logo";
import { PharmacyName } from "./PharmacyName";
import { Tabs } from "./Tabs";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ stamp }: { stamp: string }) {
  return (
    <header className="bg-pine text-on-pine">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-5 px-7 pt-[18px] max-sm:px-4">
        <div className="flex flex-wrap items-center gap-x-[18px] gap-y-3.5">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <p className="font-display text-[23px] font-[750] leading-none tracking-[-0.025em]">
                PharmaWatch
              </p>
              <PharmacyName className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-on-pine-2" />
            </div>
          </div>

          <div className="flex-1 basis-5" />

          <p className="num whitespace-nowrap rounded-lg border border-dashed border-white/20 px-2.5 py-1.5 text-[12px] text-on-pine-2">
            {stamp}
          </p>

          <AccountMenu />
          <ThemeToggle />
        </div>

        <Tabs />
      </div>
    </header>
  );
}
