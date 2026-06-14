import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import ManagementTable from "@/routes/profile/components/VehicleTable";
import type { VehicleType } from "@/types/VehicleType";

// Keep the current user configurable so role-based behavior can be exercised.
let mockUser: any = { roles: ["Staff"] };

// Expose navigation calls for edit and delete assertions.
const mockNavigate = vi.fn();

// Mock network calls at the table boundary.
const fetchMock = vi.fn();

// Expose toast side effects for delete assertions.
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();

// Replace router navigation with a stable test double.
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Replace the auth store hook with a selector-driven mock state.
vi.mock("@/routes/auth/userStore", () => ({
  default: (selector: (state: { user: typeof mockUser }) => unknown) =>
    selector({ user: mockUser }),
}));

// Replace toast calls with simple spies.
vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

// Replace the delete dialog with a direct action button.
vi.mock("@/components/DeleteDialog", () => ({
  DeleteDialog: ({ OnDeleteApplication }: { OnDeleteApplication: () => void }) => (
    <button type="button" onClick={OnDeleteApplication}>delete vehicle</button>
  ),
}));

// Install the global fetch stub used by delete actions.
vi.stubGlobal("fetch", fetchMock);

// Reuse one vehicle row so render and action assertions stay deterministic.
const vehicles : VehicleType[] = [
  {
    id: 42,
    brand: "Peugeot",
    model: "208",
    year: 2024,
    motorization: 2,
    mileage: 12000,
    listedAmount: 24000,
    listingType: 0,
    status: 0,
  },
];

// Reuse a minimal column set to cover both plain and mapped cells.
const columns = [
  { header: "Marque", accessor: "brand" },
  { header: "Type", accessor: "listingType" },
];

// Cover role gating and the main table actions.
describe("VehicleTable", () => {
  // Reset shared mocks between scenarios.
  beforeEach(() => {
    mockUser = { roles: ["Staff"] };
    mockNavigate.mockReset();
    fetchMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
  });

  // Restore the global fetch stub after this file completes.
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  // Verify customer users are blocked by the role guard.
  it("throws for customer users", () => {
    mockUser = { roles: ["Customer"] };

    expect(() => render(<ManagementTable vehicles={vehicles} columns={columns} />)).toThrow("Non autorisé");
  });

  // Verify the table renders mapped cell values and supports edit navigation.
  it("renders vehicle rows and navigates to the settings page", async () => {
    const user = userEvent.setup();

    render(<ManagementTable vehicles={vehicles} columns={columns} />);

    expect(screen.getByText("Marque")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Peugeot")).toBeInTheDocument();
    expect(screen.getByText("Achat")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button")[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/catalogue/vehicle/42/edition");
  });

  // Verify deleting a vehicle calls the API and navigates back on success.
  it("deletes a vehicle and navigates back on success", async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValueOnce({ ok: true });

    render(<ManagementTable vehicles={vehicles} columns={columns} />);

    await user.click(screen.getByRole("button", { name: "delete vehicle" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/vehicles/42", {
        method: "DELETE",
        credentials: "include",
      });
    });
    expect(toastSuccessMock).toHaveBeenCalledWith("Véhicule supprimé avec succès");
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});