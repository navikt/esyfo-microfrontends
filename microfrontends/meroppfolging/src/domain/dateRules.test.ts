import { describe, expect, it } from "vitest";
import { isRespondedWithinOneWeek } from "./dateRules";

const now = new Date("2024-06-15T12:00:00.000Z");

describe("isRespondedWithinOneWeek", () => {
  it("returns false when responseDateTime is null", () => {
    expect(isRespondedWithinOneWeek(null, now)).toBe(false);
  });

  it("returns false when responseDateTime is undefined", () => {
    expect(isRespondedWithinOneWeek(undefined, now)).toBe(false);
  });

  it("returns true when response is within 7 days", () => {
    expect(isRespondedWithinOneWeek("2024-06-14T10:00:00.000Z", now)).toBe(
      true,
    );
  });

  it("returns false when response is older than 7 days", () => {
    expect(isRespondedWithinOneWeek("2024-06-01T10:00:00.000Z", now)).toBe(
      false,
    );
  });

  it("returns true at the boundary when response is just inside one week", () => {
    expect(isRespondedWithinOneWeek("2024-06-08T12:00:00.001Z", now)).toBe(
      true,
    );
  });

  it("returns false at the exact one week boundary", () => {
    expect(isRespondedWithinOneWeek("2024-06-08T12:00:00.000Z", now)).toBe(
      false,
    );
  });
});
