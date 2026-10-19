import type { ReactNode } from "react";

export function AuthCard({
  eyebrow,
  title,
  sub,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  sub: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="card flex flex-col gap-4 px-7 pt-6 pb-7 max-sm:px-5">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="h2 mt-1.5 text-[28px]">{title}</h1>
        <p className="sub text-pretty">{sub}</p>
      </div>

      {children}

      {footer ? (
        <p className="m-0 border-t border-line pt-4 text-center text-[13.5px] text-ink-2">
          {footer}
        </p>
      ) : null}
    </section>
  );
}
