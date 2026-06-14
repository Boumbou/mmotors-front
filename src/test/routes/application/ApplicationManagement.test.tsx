import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import ApplicationManagement from "@/routes/application/components/ApplicationManagement";
import { ListingType, type VehicleType } from "@/types/VehicleType";
import { ApplicationStatus, type ApplicationType } from "@/types/ApplicationType";

// Keep the current user configurable so customer and staff flows can be exercised.
let mockUser: any = {
  name: "Jean",
  lastName: "Dupont",
  email: "jean@example.com",
  roles: ["Customer"],
};

// Expose navigation calls for delete assertions.
const mockNavigate = vi.fn();

// Mock network calls at the component boundary.
const fetchMock = vi.fn();

// Expose toast side effects for workflow assertions.
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();

// Replace router hooks and links with simple test doubles.
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
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

// Replace the delete dialog with a direct action button.
vi.mock("@/components/DeleteDialog", () => ({
  DeleteDialog: ({ OnDeleteApplication }: { OnDeleteApplication: () => void }) => (
    <button type="button" onClick={OnDeleteApplication}>delete application</button>
  ),
}));

// Replace dialog primitives with simple wrappers so reject content is always available.
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Replace the skeleton with a simple loading marker.
vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div>loading action</div>,
}));

// Install the global fetch stub used by all workflow handlers.
vi.stubGlobal("fetch", fetchMock);

// Reuse one vehicle payload across workflow scenarios.
const vehicle : VehicleType = {
  id: 42,
  brand: "Peugeot",
  model: "208",
  year: 2024,
  motorization: 2,
  mileage: 12000,
  listedAmount: 24000,
  listingType: 0,
  rentalTermMonths: null,
  status: 0,
};

// Build a reusable application payload with overridable status and documents.
const buildApplication = (status: ApplicationStatus, documents: any[]) => ({
  id: 99,
  applicationType: ListingType.SALE,
  createdAt: "2026-06-13T10:00:00.000Z",
  documents,
  reviewedByUserId: null,
  rejectionReason: "Pièce manquante",
  status,
  totalAmount: 26700,
  updatedAt: "2026-06-13T10:00:00.000Z",
  userId: "7",
  vehicleId: 42,
  vehicle,
  customer: {
    name: "Jean",
    lastName: "Dupont",
    email: "jean@example.com",
  },
  applicationServices: [
    {
      serviceId: 1,
      appliedOverheadType: 1,
      appliedOverheadValue: 300,
      calculatedOverheadAmount: 300,
    },
  ],
});

// Cover the largest customer and staff workflow branches with a few focused scenarios.
describe("ApplicationManagement", () => {
  // Reset shared mocks between scenarios.
  beforeEach(() => {
    vi.restoreAllMocks();
    mockUser = {
      name: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      roles: ["Customer"],
    };
    mockNavigate.mockReset();
    fetchMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
    vi.useRealTimers();
  });

  // Restore globals after this file completes.
  afterAll(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  // Verify the customer draft flow renders upload controls and can submit the dossier.
  it("renders the customer draft flow and submits the application", async () => {
    const user = userEvent.setup();
    const application : ApplicationType = buildApplication(0, [
      { id: 1, fileName: "Pièce d'identité", url: null, key: null },
      { id: 2, fileName: "Justificatif", url: "http://file", key: "doc.pdf" },
    ]);

    fetchMock.mockResolvedValueOnce({ ok: true });

    render(
      <ApplicationManagement
        vehicle={vehicle}
        application={application}
        motorizationLabels={{ 2: "Électrique" }}
      />,
    );

    expect(screen.getByText("Peugeot 208 Électrique")).toBeInTheDocument();
    expect(screen.getByText("Documents à fournir")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Charger votre Pièce d'identité")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Soumettre mon dossier/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Soumettre mon dossier/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/applications/99/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    });
    expect(toastSuccessMock).toHaveBeenCalledWith("Dossier soumis avec succès");
    expect(screen.getByText("Soumis")).toBeInTheDocument();
  });

  // Verify deleting a customer draft triggers the API and navigates back after the timeout.
  it("deletes a draft application and navigates back", async () => {
    const application = buildApplication(0, []);

    vi.spyOn(globalThis, "setTimeout").mockImplementation((callback: TimerHandler) => {
      if (typeof callback === "function") {
        callback();
      }
      return 0 as unknown as ReturnType<typeof setTimeout>;
    });
    fetchMock.mockResolvedValueOnce({ ok: true });

    render(
      <ApplicationManagement
        vehicle={vehicle}
        application={application}
        motorizationLabels={{ 2: "Électrique" }}
      />,
    );

    screen.getByRole("button", { name: "delete application" }).click();
      await Promise.resolve();
      await Promise.resolve();

    expect(fetchMock).toHaveBeenCalledWith("/api/applications/99", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    expect(toastSuccessMock).toHaveBeenCalledWith("Dossier supprimé avec succès");
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  // Verify the staff review flow can approve a submitted dossier.
  it("approves a submitted application as staff", async () => {
    const user = userEvent.setup();
    const application = buildApplication(2, []);

    mockUser = {
      ...mockUser,
      roles: ["Staff"],
    };
    fetchMock.mockResolvedValueOnce({ ok: true });

    render(
      <ApplicationManagement
        vehicle={vehicle}
        application={application}
        motorizationLabels={{ 2: "Électrique" }}
      />,
    );

    expect(screen.getByRole("button", { name: /Mettre en attente/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Approuver/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Approuver/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/applications/99/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ApplicationId: 99,
          IsApproved: true,
          RejectionReason: null,
        }),
      });
    });
    expect(toastSuccessMock).toHaveBeenCalledWith("Dossier revu avec succès");
    expect(screen.getByText("Dossier approuvé")).toBeInTheDocument();
  });

  // Verify the staff reject flow sends the current rejection reason.
  it("rejects a submitted application with the entered reason", async () => {
    const user = userEvent.setup();
    const application = buildApplication(2, []);

    mockUser = {
      ...mockUser,
      roles: ["Staff"],
    };
    fetchMock.mockResolvedValueOnce({ ok: true });

    render(
      <ApplicationManagement
        vehicle={vehicle}
        application={application}
        motorizationLabels={{ 2: "Électrique" }}
      />,
    );

    await user.clear(screen.getByPlaceholderText("Entrez la raison du rejet ici..."));
    await user.type(screen.getByPlaceholderText("Entrez la raison du rejet ici..."), "Documents manquants");
    await user.click(screen.getAllByRole("button", { name: /Rejeter/i })[1]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/applications/99/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ApplicationId: 99,
          IsApproved: false,
          RejectionReason: "Documents manquants",
        }),
      });
    });
    expect(screen.getByText(/Raison du rejet : Documents manquants/)).toBeInTheDocument();
  });
});