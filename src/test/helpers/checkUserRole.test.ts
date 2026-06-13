import { describe, expect, it } from "vitest";

import checkIsStaff from "@/helpers/checkUserRole";

describe("checkIsStaff", () => {
  it("returns false when user is missing", () => {
    expect(checkIsStaff(null)).toBe(false);
    expect(checkIsStaff(undefined)).toBe(false);
  });

  it("returns false when roles are missing", () => {
    expect(checkIsStaff({})).toBe(false);
    expect(checkIsStaff({ roles: null })).toBe(false);
  });

  it("returns true for staff users", () => {
    expect(checkIsStaff({ roles: ["Staff"] })).toBe(true);
  });

  it("returns true for admin users", () => {
    expect(checkIsStaff({ roles: ["Admin"] })).toBe(true);
  });

  it("returns false for non-staff roles", () => {
    expect(checkIsStaff({ roles: ["Customer"] })).toBe(false);
    expect(checkIsStaff({ roles: ["Guest", "Customer"] })).toBe(false);
  });
});