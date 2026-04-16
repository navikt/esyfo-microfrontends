import { describe, expect, it } from "vitest";
import { getLatestBrev, shouldShowDialogmotePanel } from "./brev";
import { createBrev } from "./test-utils/brev";

describe("getLatestBrev", () => {
  it("returns null for an empty list", () => {
    expect(getLatestBrev([])).toBeNull();
  });

  it("returns the newest brev sorted by createdAt descending", () => {
    const oldest = createBrev({
      uuid: "oldest",
      createdAt: new Date("2024-01-01T10:00:00.000Z"),
    });
    const newest = createBrev({
      uuid: "newest",
      createdAt: new Date("2024-03-01T10:00:00.000Z"),
    });
    const middle = createBrev({
      uuid: "middle",
      createdAt: new Date("2024-02-01T10:00:00.000Z"),
    });

    expect(getLatestBrev([oldest, newest, middle])).toEqual(newest);
  });

  it("filters out REFERAT_ENDRET before sorting", () => {
    const newestReferatEndret = createBrev({
      uuid: "referat-endret",
      createdAt: new Date("2024-04-01T10:00:00.000Z"),
      brevType: "REFERAT_ENDRET",
    });
    const newestValid = createBrev({
      uuid: "newest-valid",
      createdAt: new Date("2024-03-01T10:00:00.000Z"),
      brevType: "NYTT_TID_STED",
    });
    const oldestValid = createBrev({
      uuid: "oldest-valid",
      createdAt: new Date("2024-01-01T10:00:00.000Z"),
      brevType: "INNKALT",
    });

    expect(
      getLatestBrev([oldestValid, newestReferatEndret, newestValid]),
    ).toEqual(newestValid);
  });

  it("returns null when only REFERAT_ENDRET brev are provided", () => {
    const brev = [
      createBrev({
        uuid: "referat-endret-1",
        brevType: "REFERAT_ENDRET",
      }),
      createBrev({
        uuid: "referat-endret-2",
        createdAt: new Date("2024-03-01T10:00:00.000Z"),
        brevType: "REFERAT_ENDRET",
      }),
    ];

    expect(getLatestBrev(brev)).toBeNull();
  });
});

describe("shouldShowDialogmotePanel", () => {
  it("returns false for null", () => {
    expect(shouldShowDialogmotePanel(null)).toBe(false);
  });

  const shouldShowCases = [
    { brevType: "INNKALT", expected: true },
    { brevType: "NYTT_TID_STED", expected: true },
    { brevType: "AVLYST", expected: false },
    { brevType: "REFERAT", expected: false },
  ] as const;

  it.each(shouldShowCases)("returns $expected for $brevType", ({
    brevType,
    expected,
  }) => {
    expect(shouldShowDialogmotePanel(createBrev({ brevType }))).toBe(expected);
  });
});
