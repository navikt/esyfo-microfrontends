import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addDaysToDate,
  getLongDateFormat,
  getShortDateFormat,
} from "./dateUtils";

describe("dateUtils", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("getLongDateFormat", () => {
    it("formats a long nb-NO date", () => {
      const result = getLongDateFormat(new Date(2024, 0, 5, 12));

      expect(result).toContain("5.");
      expect(result).toContain("januar");
      expect(result).toContain("2024");
    });

    it("formats an ISO string as a long nb-NO date", () => {
      expect(getLongDateFormat("2024-01-15T10:00:00.000Z")).toContain("januar");
    });
  });

  describe("getShortDateFormat", () => {
    it("formats a short nb-NO date", () => {
      const result = getShortDateFormat(new Date(2024, 0, 5, 12));

      expect(result).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
      expect(result).toContain("2024");
    });
  });

  describe("addDaysToDate", () => {
    const addDaysCases = [
      {
        description: "adds positive days",
        date: new Date(2024, 0, 10, 12),
        days: 5,
        expected: new Date(2024, 0, 15, 12),
      },
      {
        description: "adds negative days",
        date: new Date(2024, 0, 10, 12),
        days: -4,
        expected: new Date(2024, 0, 6, 12),
      },
      {
        description: "crosses month boundaries",
        date: new Date(2024, 0, 30, 12),
        days: 3,
        expected: new Date(2024, 1, 2, 12),
      },
      {
        description: "crosses year boundaries",
        date: new Date(2024, 11, 30, 12),
        days: 3,
        expected: new Date(2025, 0, 2, 12),
      },
    ];

    it.each(addDaysCases)("$description", ({ date, days, expected }) => {
      expect(addDaysToDate(date, days).getTime()).toBe(expected.getTime());
    });

    it("returns a new date unchanged when adding zero days", () => {
      const originalDate = new Date(2024, 4, 20, 12);
      const result = addDaysToDate(originalDate, 0);

      expect(result).not.toBe(originalDate);
      expect(result.getTime()).toBe(originalDate.getTime());
    });
  });
});
