import { describe, expect, it } from "vitest";
import { isRespondedWithinOneWeek } from "./dateRules";

const now = new Date("2024-06-15T12:00:00.000Z");
const testCases = [
  {
    description: "returns false when responseDateTime is null",
    responseDateTime: null,
    expected: false,
  },
  {
    description: "returns false when responseDateTime is undefined",
    responseDateTime: undefined,
    expected: false,
  },
  {
    description: "returns true when response is within 7 days",
    responseDateTime: "2024-06-14T10:00:00.000Z",
    expected: true,
  },
  {
    description: "returns false when response is older than 7 days",
    responseDateTime: "2024-06-01T10:00:00.000Z",
    expected: false,
  },
  {
    description:
      "returns true at the boundary when response is just inside one week",
    responseDateTime: "2024-06-08T12:00:00.001Z",
    expected: true,
  },
  {
    description: "returns false at the exact one week boundary",
    responseDateTime: "2024-06-08T12:00:00.000Z",
    expected: false,
  },
] as const;

describe("isRespondedWithinOneWeek", () => {
  it.each(testCases)("$description", ({ responseDateTime, expected }) => {
    expect(isRespondedWithinOneWeek(responseDateTime, now)).toBe(expected);
  });
});
