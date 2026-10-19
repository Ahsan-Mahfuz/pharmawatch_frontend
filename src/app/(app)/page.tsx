"use client";

import { closingWindows } from "@/domain";
import { ActivityFeed } from "@/components/today/ActivityFeed";
import { DecideList } from "@/components/today/DecideList";
import { Headline } from "@/components/today/Headline";
import { Ledger } from "@/components/today/Ledger";
import { ReturnWindowAlert } from "@/components/today/ReturnWindowAlert";
import { ShelfCalendar } from "@/components/today/ShelfCalendar";
import { useAppSelector } from "@/store/hooks";
import { selectAccount, selectLedger, selectOpenBatches } from "@/store/selectors";

export default function TodayPage() {
  const ledger = useAppSelector(selectLedger);
  const open = useAppSelector(selectOpenBatches);
  const account = useAppSelector(selectAccount);

  return (
    <div className="screen flex flex-col gap-7">
      <div className="grid items-end gap-x-12 gap-y-7 [grid-template-columns:repeat(auto-fit,minmax(min(460px,100%),1fr))]">
        <Headline ledger={ledger} firstName={account?.first ?? ""} />
        <Ledger data={ledger} />
      </div>

      <ReturnWindowAlert windows={closingWindows(open)} />

      <ShelfCalendar />

      <div className="grid items-start gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(480px,100%),1fr))]">
        <DecideList />
        <ActivityFeed />
      </div>
    </div>
  );
}
