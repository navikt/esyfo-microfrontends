import { describe, expect, it } from "vitest";

import { createBrev } from "./__fixtures__/brev";
import { getLatestBrev, getShowDialogmotePanel } from "./brev";

describe("getLatestBrev", () => {
  it("returns null for an empty list", () => {
    expect(getLatestBrev([])).toBeNull();
  });

  it("returns the newest brev sorted by createdAt descending", () => {
    const oldest = createBrev({
      uuid: "oldest",
      createdAt: "2024-01-01T10:00:00.000Z",
    });
    const newest = createBrev({
      uuid: "newest",
      createdAt: "2024-03-01T10:00:00.000Z",
    });
    const middle = createBrev({
      uuid: "middle",
      createdAt: "2024-02-01T10:00:00.000Z",
    });

    expect(getLatestBrev([oldest, newest, middle])).toEqual(newest);
  });

  it("filters out REFERAT_ENDRET before sorting", () => {
    const newestReferatEndret = createBrev({
      uuid: "referat-endret",
      createdAt: "2024-04-01T10:00:00.000Z",
      brevType: "REFERAT_ENDRET",
    });
    const newestValid = createBrev({
      uuid: "newest-valid",
      createdAt: "2024-03-01T10:00:00.000Z",
      brevType: "NYTT_TID_STED",
    });
    const oldestValid = createBrev({
      uuid: "oldest-valid",
      createdAt: "2024-01-01T10:00:00.000Z",
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
        createdAt: "2024-03-01T10:00:00.000Z",
        brevType: "REFERAT_ENDRET",
      }),
    ];

    expect(getLatestBrev(brev)).toBeNull();
  });
});

describe("getShowDialogmotePanel", () => {
  it("returns false for null", () => {
    expect(getShowDialogmotePanel(null)).toBe(false);
  });

  it("returns true for INNKALT", () => {
    expect(getShowDialogmotePanel(createBrev({ brevType: "INNKALT" }))).toBe(
      true,
    );
  });

  it("returns true for NYTT_TID_STED", () => {
    expect(
      getShowDialogmotePanel(createBrev({ brevType: "NYTT_TID_STED" })),
    ).toBe(true);
  });

  it("returns false for AVLYST", () => {
    expect(getShowDialogmotePanel(createBrev({ brevType: "AVLYST" }))).toBe(
      false,
    );
  });

  it("returns false for REFERAT", () => {
    expect(getShowDialogmotePanel(createBrev({ brevType: "REFERAT" }))).toBe(
      false,
    );
  });
});
