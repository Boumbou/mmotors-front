import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import VehicleDetails from "@/routes/vehicleDetails/Index";

// Keep router state configurable so each test can drive search and pathname values.
let mockLocation = { search: "?type=achats&pagenumber=1" };

// Keep the current user configurable so customer and anonymous branches can be exercised.
let mockUser: any = { roles: ["Customer"], token: "token-123" };

// Expose navigation calls for breadcrumb and application-flow assertions.
const mockNavigate = vi.fn();

// Mock network calls at the page boundary.
const fetchMock = vi.fn();

// Replace router hooks with stable test doubles.
vi.mock("react-router", () => ({
  useLocation: () => mockLocation,
  useNavigate: () => mockNavigate,
}));

// Replace the auth store hook with a selector-driven mock state.
vi.mock("@/routes/auth/userStore", () => ({
  default: (selector: (state: { user: typeof mockUser }) => unknown) =>
    selector({ user: mockUser }),
}));

// Replace the new-application card with a direct action button.
vi.mock("@/routes/vehicleDetails/components/NewApplication", () => ({
  default: ({ onInitiateApplication }: { onInitiateApplication: () => void }) => (
    <button type="button" onClick={onInitiateApplication}>start application</button>
  ),
}));

// Replace the already-applied card with a simple marker.
vi.mock("@/routes/vehicleDetails/components/AlreadyApplied", () => ({
  default: () => <div>already applied</div>,
}));

// Replace breadcrumb primitives with simple clickable buttons.
vi.mock("@/components/ui/breadcrumb", () => ({
  Breadcrumb: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  BreadcrumbList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BreadcrumbItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BreadcrumbSeparator: () => <span>/</span>,
  BreadcrumbLink: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>{children}</button>
  ),
}));

// Replace the motion wrapper with a passthrough container.
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

// Install the global fetch stub used by the page effect.
vi.stubGlobal("fetch", fetchMock);

// Reuse one vehicle payload so rendering stays deterministic.
const vehicle = {
  id: 42,
  brand: "Peugeot",
  model: "208",
  year: 2024,
  motorization: 2,
  mileage: 12000,
  listedAmount: 24000,
  listingType: 0,
  status: 0,
  imageUrl: null,
};

// Reuse one available service so the application navigation state can be asserted.
const services = [{ id: 5, name: "Garantie", overheadType: 1, overheadValue: 500 }];

// Cover the main data-loading and application-initiation branches.
describe("VehicleDetails", () => {
  // Reset shared router and network mocks between scenarios.
  beforeEach(() => {
    mockLocation = { search: "?type=achats&pagenumber=1" };
    mockUser = { roles: ["Customer"], token: "token-123" };
    mockNavigate.mockReset();
    fetchMock.mockReset();
    window.history.pushState({}, "", "/catalogue/vehicle/42");
  });

  // Restore the global fetch stub after this file completes.
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  // Verify the page loads vehicle details and customer application options.
  it("loads the vehicle and shows the new-application flow for eligible customers", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(vehicle),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ items: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(services),
      });

    render(<VehicleDetails />);

    expect(await screen.findByText("Peugeot 208 2024")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "start application" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/vehicles/42");
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/applications", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token-123",
      },
    });
    expect(fetchMock).toHaveBeenNthCalledWith(3, "/api/services?listingType=0");
  });

  // Verify the selected services are forwarded when the user starts an application.
  it("navigates to the application page with the selected service state", async () => {
    const user = userEvent.setup();

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(vehicle),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ items: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(services),
      });

    render(<VehicleDetails />);

    await screen.findByText("Peugeot 208 2024");
    await user.click(screen.getByRole("button", { name: "start application" }));

    expect(mockNavigate).toHaveBeenCalledWith("/application", {
      state: {
        search: "?type=achats&pagenumber=1",
        vehicle,
        services: [],
      },
    });
  });

  // Verify customers who already applied see the dedicated fallback instead.
  it("shows the already-applied state when an application already exists", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(vehicle),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ items: [{ vehicleId: 42 }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(services),
      });

    render(<VehicleDetails />);

    expect(await screen.findByText("already applied")).toBeInTheDocument();
  });

  // Verify non-customer users only load vehicle details and skip application helpers.
  it("skips application-specific fetches for non-customer users", async () => {
    mockUser = { roles: ["Staff"], token: "token-123" };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(vehicle),
    });

    render(<VehicleDetails />);

    expect(await screen.findByText("Peugeot 208 2024")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: "start application" })).not.toBeInTheDocument();
  });
});