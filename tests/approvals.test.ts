import { describe, expect, it } from "vitest";
import { approvalQueue, approvalView, canDecide } from "@/domain";
import type { Approval } from "@/domain";

const base: Approval = {
  id: "REQ-300", ref: "req-300", type: "Return", batchId: "NPX-4417", med: "Napa Extra 500mg",
  qty: 88, unit: "strips", value: 3344, by: "Rafiq Ahmed", date: "19 Oct 2026",
  status: "pending", decidedBy: "",
};

describe("canDecide — the two person rule", () => {
  it("lets the owner decide a request raised by staff", () => {
    expect(canDecide(base, "owner", "Mahmuda Khatun")).toBe(true);
  });

  it("stops a pharmacist deciding anything", () => {
    expect(canDecide(base, "pharmacist", "Rafiq Ahmed")).toBe(false);
  });

  it("stops the owner approving their own request", () => {
    const own = { ...base, by: "Mahmuda Khatun" };
    expect(canDecide(own, "owner", "Mahmuda Khatun")).toBe(false);
  });

  it("stops a request being decided twice", () => {
    const done = { ...base, status: "approved" as const, decidedBy: "Mahmuda Khatun" };
    expect(canDecide(done, "owner", "Mahmuda Khatun")).toBe(false);
  });
});

describe("approvalView", () => {
  it("explains why a pharmacist cannot decide", () => {
    expect(approvalView(base, "pharmacist", "Rafiq Ahmed").why).toContain("Only the owner");
  });

  it("explains the self-approval block in the owner's own words", () => {
    const own = { ...base, by: "Mahmuda Khatun" };
    expect(approvalView(own, "owner", "Mahmuda Khatun").why).toContain("someone else");
  });

  it("gives no reason when the decision is available", () => {
    expect(approvalView(base, "owner", "Mahmuda Khatun").why).toBe("");
  });

  it("formats the quantity and value for the row", () => {
    const view = approvalView(base, "owner", "Mahmuda Khatun");
    expect(view.qtyText).toBe("88 strips");
    expect(view.valueText).toBe("৳3,344");
  });
});

describe("approvalQueue", () => {
  it("splits waiting from decided", () => {
    const list = [base, { ...base, id: "REQ-301", status: "approved" as const }];
    const { pending, done } = approvalQueue(list, "owner", "Mahmuda Khatun");
    expect(pending.map((r) => r.id)).toEqual(["REQ-300"]);
    expect(done.map((r) => r.id)).toEqual(["REQ-301"]);
  });
});
