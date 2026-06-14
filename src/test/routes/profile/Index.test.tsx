import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import Profile from "@/routes/profile/Index";

// Keep router state configurable so each test can control the active section.
let mockLocationState: Record<string, any> = {};

// Keep the current user configurable so customer and staff branches can be exercised.
let mockUser: any = {
  id: 7,
  name: "Jean",
  lastName: "Dupont",
  email: "jean@example.com",
  created: "2026-06-13",
  roles: ["Customer"],
};

// Expose navigation calls for the unauthenticated redirect assertion.
const mockNavigate = vi.fn();

// Mock network calls at the page boundary.
const fetchMock = vi.fn();

// Keep the active tabs value available to the mocked tab content.
const TabsValueContext = React.createContext<string>("");

// Replace router hooks with stable test doubles.
vi.mock("react-router", () => ({
  useLocation: () => ({ state: mockLocationState }),
  useNavigate: () => mockNavigate,
}));

// Replace the auth store hook with a selector-driven mock state.
vi.mock("@/routes/auth/userStore", () => ({
  default: (selector: (state: { user: typeof mockUser }) => unknown) =>
    selector({ user: mockUser }),
}));

// Replace the tabs with a small state-aware implementation for active content.
vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <TabsValueContext.Provider value={value}>{children}</TabsValueContext.Provider>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>{children}</button>
  ),
  TabsContent: ({ value, children }: { value: string; children: React.ReactNode }) => {
    const activeValue = React.useContext(TabsValueContext);
    return activeValue === value ? <div>{children}</div> : null;
  },
}));

// Replace heavy child sections with simple markers.
vi.mock("@/routes/profile/components/CustomerProfile", () => ({
  default: () => <div>profile section</div>,
}));

// Replace the customer application list with a simple marker.
vi.mock("@/routes/profile/components/CustomerApplicationList", () => ({
  default: () => <div>applications section</div>,
}));

// Replace the dashboard with a simple marker.
vi.mock("@/routes/profile/components/Dashboard", () => ({
  default: () => <div>dashboard section</div>,
}));

// Replace the vehicle list with a simple marker.
vi.mock("@/routes/profile/components/VehicleManagementList", () => ({
  default: () => <div>vehicles section</div>,
}));

// Replace the admin settings with a simple marker.
vi.mock("@/routes/profile/components/AdminSetting", () => ({
  AdminSetting: () => <div>settings section</div>,
}));

// Install the global fetch stub used by the page effect.
vi.stubGlobal("fetch", fetchMock);

// Reuse one paged application response so fetch-driven rendering stays deterministic.
const pagedResult = {
  items: [{ id: 1 }],
  totalCount: 1,
  pageNumber: 1,
  pageSize: 20,
  totalPages: 1,
};

// Cover the main profile page orchestration branches.
describe("Profile page", () => {
  // Reset shared router and global mocks between scenarios.
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
  });

  // Restore the global fetch stub after this file completes.
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  // Verify unauthenticated users are redirected to the login page.
  it("redirects to login when no user is available", () => {
    mockUser = null;

    const { container } = render(<Profile />);

    expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
    expect(container).toBeEmptyDOMElement();
  });

  // Verify customer users load applications and default to the profile section.
  it("loads applications and shows the customer profile section by default", async () => {
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue(pagedResult),
    });

    render(<Profile />);

    expect(screen.getByText("Chargement...")).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/applications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    });
    expect(await screen.findByText("Mon profile")).toBeInTheDocument();
    expect(screen.getByText("Mes dossiers")).toBeInTheDocument();
    expect(screen.getByText("profile section")).toBeInTheDocument();
  });

  // Verify staff users respect the requested section and render the right content.
  it("shows the requested staff section after loading", async () => {
    mockUser = {
      ...mockUser,
      roles: ["Staff"],
    };
    mockLocationState = { section: "vehicles" };
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue(pagedResult),
    });

    render(<Profile />);

    expect(await screen.findByText("Tableau de bord")).toBeInTheDocument();
    expect(screen.getByText("Dossiers")).toBeInTheDocument();
    expect(screen.getByText("Véhicules")).toBeInTheDocument();
    expect(screen.getByText("vehicles section")).toBeInTheDocument();
  });
});