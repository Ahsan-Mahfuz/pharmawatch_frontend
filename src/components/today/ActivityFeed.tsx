"use client";

import { Card, CardHead } from "@/components/ui/Card";
import { toneVar } from "@/lib/colors";
import { useAppSelector } from "@/store/hooks";
import { selectActivity } from "@/store/selectors";

export function ActivityFeed() {
  const activity = useAppSelector(selectActivity);

  return (
    <Card>
      <CardHead title="Activity" sub="Everything the shop has done today." />

      <ul className="m-0 flex list-none flex-col gap-3.5 px-[22px] pb-[22px] pt-1 max-sm:px-4">
        {activity.map((item, i) => (
          <li key={`${item.time}-${i}`} className="flex items-start gap-3">
            <i
              aria-hidden="true"
              className="mt-[7px] block size-2 shrink-0 rounded-[3px]"
              style={{ background: toneVar[item.tone] }}
            />
            <div className="min-w-0">
              <p className="m-0 text-[13.5px] text-ink text-pretty">{item.text}</p>
              <p className="num m-0 text-[11.5px] text-ink-3">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
