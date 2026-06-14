import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import VehicleSettings from "@/routes/vehicleDetails/VehicleSettings";

// Keep router values configurable so tests can drive customer and edit branches.
let mockPathname = "/catalogue/vehicle/42/edition";
let mockParams = { id: "42" };

// Keep the current user configurable for role-gated behavior.
let mockUser: any = { roles: ["Staff"] };

// Expose navigation calls for breadcrumb and delete assertions.
const mockNavigate = vi.fn();

// Mock network calls at the page boundary.
const fetchMock = vi.fn();

// Expose toast side effects for update and delete assertions.
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();

// Replace router hooks and Link with simple test doubles.
vi.mock("react-router", () => ({
  useLocation: () => ({ pathname: mockPathname }),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
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

// Replace the forbidden state with a simple marker.
vi.mock("@/components/Foribidden", () => ({
  default: () => <div>forbidden state</div>,
}));

// Replace select primitives with simple wrappers because dropdown behavior is not the target.
vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: () => <span>selected value</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Replace dialog primitives with simple wrappers because overlay behavior is not the target.
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Replace the delete dialog with a direct action button.
vi.mock("@/components/DeleteDialog", () => ({
  DeleteDialog: ({ OnDeleteApplication }: { OnDeleteApplication: () => void }) => (
    <button type="button" onClick={OnDeleteApplication}>delete vehicle</button>
  ),
}));

// Replace breadcrumb primitives with clickable buttons.
vi.mock("@/components/ui/breadcrumb", () => ({
  Breadcrumb: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  BreadcrumbList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BreadcrumbItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BreadcrumbLink: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>{children}</button>
  ),
}));

// Replace the skeleton with a simple loading marker.
vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div>loading vehicle</div>,
}));

// Install the global fetch stub used by the page effect and actions.
vi.stubGlobal("fetch", fetchMock);

// Reuse one full vehicle payload so edit-mode rendering stays deterministic.
const fullVehicle = {
  id: 42,
  brand: "Peugeot",
  model: "208",
  year: 2024,
  motorization: 2,
  mileage: 12000,
  listedAmount: 24000,
  listingType: 0,
  status: 0,
  rentalTermMonths: null,
  imageUrl: null,
  imageKey: null,
  applications: [{ id: 8, status: 0 }],
};

// Cover the largest page branches with a small number of focused scenarios.
describe("VehicleSettings", () => {
  // Reset mutable router and global mocks between scenarios.
  beforeEach(() => {
    mockPathname = "/catalogue/vehicle/42/edition";
    mockParams = { id: "42" };
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

  // Verify customer users are blocked immediately.
  it("renders the forbidden state for customers", () => {
    mockUser = { roles: ["Customer"] };

    render(<VehicleSettings />);

    expect(screen.getByText("forbidden state")).toBeInTheDocument();
  });

  // Verify edit mode fetches and renders the main vehicle details and linked applications.
  it("fetches and renders an existing vehicle", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(fullVehicle),
    });

    render(<VehicleSettings />);

    expect(await screen.findByDisplayValue("Peugeot")).toBeInTheDocument();
    expect(screen.getByDisplayValue("208")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024")).toBeInTheDocument();
    expect(screen.getByText("Dossiers associés")).toBeInTheDocument();
    expect(screen.getByText(/Dossier numéro :/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/vehicles/42");
  });

  // Verify the save action updates the current vehicle and refreshes the details.
  it("updates the vehicle and refetches details on success", async () => {
    const user = userEvent.setup();

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(fullVehicle),
      })
      .mockResolvedValueOnce({
        ok: true,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(fullVehicle),
      });

    render(<VehicleSettings />);

    await screen.findByDisplayValue("Peugeot");
    await user.click(screen.getAllByRole("button")[1]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        "/api/vehicles/42",
        expect.objectContaining({
          method: "PUT",
          credentials: "include",
          body: expect.any(FormData),
        }),
      );
    });
    expect(toastSuccessMock).toHaveBeenCalledWith("Véhicule mis à jour avec succès");
    expect(fetchMock).toHaveBeenLastCalledWith("/api/vehicles/42");
  });

  // Verify the delete action removes the vehicle and redirects to the profile section.
  it("deletes the vehicle and redirects to the vehicles profile section", async () => {
    const user = userEvent.setup();

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(fullVehicle),
      })
      .mockResolvedValueOnce({ ok: true });

    render(<VehicleSettings />);

    await screen.findByDisplayValue("Peugeot");
    await user.click(screen.getByRole("button", { name: "delete vehicle" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith("/api/vehicles/42", {
        method: "DELETE",
        credentials: "include",
      });
    });
    expect(toastSuccessMock).toHaveBeenCalledWith("Véhicule supprimé avec succès");
    expect(mockNavigate).toHaveBeenCalledWith("/profile", { state: { section: "vehicles" } });
  });
});