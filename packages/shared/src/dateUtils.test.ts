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

  it("formats a long nb-NO date", () => {
    const result = getLongDateFormat(new Date(2024, 0, 5, 12));

    expect(result).toContain("5.");
    expect(result).toContain("januar");
    expect(result).toContain("2024");
  });

  it("formats an ISO string as a long nb-NO date", () => {
    expect(getLongDateFormat("2024-01-15T10:00:00.000Z")).toContain("januar");
  });

  it("formats a short nb-NO date", () => {
    const result = getShortDateFormat(new Date(2024, 0, 5, 12));

    expect(result).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
    expect(result).toContain("2024");
  });

  it("adds positive days to a date", () => {
    const result = addDaysToDate(new Date(2024, 0, 10, 12), 5);

    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(15);
  });

  it("adds negative days to a date", () => {
    const result = addDaysToDate(new Date(2024, 0, 10, 12), -4);

    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(6);
  });

  it("returns a new date unchanged when adding zero days", () => {
    const originalDate = new Date(2024, 4, 20, 12);
    const result = addDaysToDate(originalDate, 0);

    expect(result).not.toBe(originalDate);
    expect(result.getTime()).toBe(originalDate.getTime());
  });

  it("crosses month boundaries when adding days", () => {
    const result = addDaysToDate(new Date(2024, 0, 30, 12), 3);

    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(2);
  });

  it("crosses year boundaries when adding days", () => {
    const result = addDaysToDate(new Date(2024, 11, 30, 12), 3);

    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(2);
  });
});
