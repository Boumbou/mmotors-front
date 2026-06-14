import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Application from "@/routes/application/Index";

// Keep router state configurable so each test can drive the page branch.
let mockLocationState: Record<string, any> = {};

// Keep the auth store state configurable across scenarios.
let mockUser: any = {
  id: 7,
  name: "Jean",
  lastName: "Dupont",
  email: "jean@example.com",
  created: "2026-06-13",
  roles: ["Customer"],
};

// Expose navigation calls for breadcrumb assertions.
const mockNavigate = vi.fn();

// Mock network calls at the page boundary.
const fetchMock = vi.fn();

// Expose toast side effects for error and success assertions.
const toastErrorMock = vi.fn();
const toastSuccessMock = vi.fn();

// Capture replaceState calls triggered after application creation.
const replaceStateMock = vi.fn();

// Replace router hooks with stable test doubles.
vi.mock("react-router", () => ({
  useLocation: () => ({
    state: mockLocationState,
    pathname: window.location.pathname,
  }),
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
    error: (...args: unknown[]) => toastErrorMock(...args),
    success: (...args: unknown[]) => toastSuccessMock(...args),
  },
}));

// Replace large child components with focused stubs that expose key props.
vi.mock("@/components/Foribidden", () => ({
  default: () => <div>forbidden state</div>,
}));

// Replace the no-result component with a simple marker.
vi.mock("@/components/NoResult", () => ({
  default: () => <div>no result state</div>,
}));

// Replace the skeleton component with a simple loading marker.
vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div>loading skeleton</div>,
}));

// Replace breadcrumb primitives with clickable buttons.
vi.mock("@/components/ui/breadcrumb", () => ({
  Breadcrumb: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  BreadcrumbList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BreadcrumbItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BreadcrumbSeparator: () => <span>/</span>,
  BreadcrumbLink: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>{children}</button>
  ),
}));

// Replace the creation view with a simple stub that can trigger creation.
vi.mock("@/routes/application/components/ApplicationCreation", () => ({
  default: ({ onCreateApplication, totalOverhead }: { onCreateApplication: () => Promise<void>; totalOverhead: number }) => (
    <div>
      <p>creation view {totalOverhead}</p>
      <button type="button" onClick={() => onCreateApplication()}>create application</button>
    </div>
  ),
}));

// Replace the management view with a simple marker.
vi.mock("@/routes/application/components/ApplicationManagement", () => ({
  default: ({ application }: { application: { id: number } }) => <div>management view {application.id}</div>,
}));

// Install the global fetch stub used by the page effect and handlers.
vi.stubGlobal("fetch", fetchMock);

// Reuse one vehicle payload so page behavior stays deterministic.
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
};

// Reuse services so total overhead can be computed by the real page logic.
const services = [
  { id: 1, overheadType: 1, overheadValue: 300 },
  { id: 2, overheadType: 0, overheadValue: 0.1 },
];

// Cover the largest page branches with a small number of focused scenarios.
describe("Application page", () => {
  // Reset mutable router state, mocks, and history before each scenario.
  beforeEach(() => {
    mockLocationState = {};
    mockUser = {
      id: 7,
      name: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      created: "2026-06-13",
      roles: ["Customer"],
    };
    mockNavigate.mockReset();
    fetchMock.mockReset();
    toastErrorMock.mockReset();
    toastSuccessMock.mockReset();
    replaceStateMock.mockReset();
    window.history.replaceState = replaceStateMock;
    window.history.pushState({}, "", "/application");
  });

  // Verify unauthenticated users are blocked immediately.
  it("renders the forbidden state when the user is missing", () => {
    mockUser = null;

    render(<Application />);

    expect(screen.getByText("forbidden state")).toBeInTheDocument();
  });

  // Verify the creation branch computes overhead and can create a dossier.
  it("renders the creation view and creates an application", async () => {
    const user = userEvent.setup();

    mockLocationState = {
      vehicle,
      services,
      search: "?type=achats",
    };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        id: 99,
        vehicle,
        applicationServices: [],
      }),
    });

    render(<Application />);

    expect(await screen.findByText("creation view 2700")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "create application" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          vehicleId: 42,
          userId: 7,
          applicationType: 0,
          baseAmount: 24000,
          totalOverheadAmount: 2700,
          serviceIds: [1, 2],
        }),
      });
    });
    expect(replaceStateMock).toHaveBeenCalledWith(null, "", "/application/99");
    expect(toastSuccessMock).toHaveBeenCalledWith("Dossier créé avec succès");
    expect(await screen.findByText("management view 99")).toBeInTheDocument();
  });

  // Verify the fetch branch renders the management view for an existing dossier.
  it("fetches and renders an existing application", async () => {
    window.history.pushState({}, "", "/application/55");
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        id: 55,
        vehicle,
        applicationServices: [],
      }),
    });

    render(<Application />);

    expect(await screen.findByText("management view 55")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/applications/55", {
      credentials: "include",
    });
  });

  // Verify fetch failures fall back to the no-result state and toast an error.
  it("shows the no-result state when loading an application fails", async () => {
    window.history.pushState({}, "", "/application/77");
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: vi.fn(),
    });

    render(<Application />);

    expect(await screen.findByText("no result state")).toBeInTheDocument();
    expect(toastErrorMock).toHaveBeenCalledWith("Erreur lors du chargement du dossier");
  });
});