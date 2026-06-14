import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import ServiceForm from "@/routes/profile/components/ServiceForm";
import { overheadType, type ServiceType } from "@/types/ServiceType";

// Expose the authenticated user consumed by the form.
const mockUser = { token: "token-123" };

// Mock network calls at the form boundary.
const fetchMock = vi.fn();

// Expose toast side effects for create and update assertions.
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();

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

// Replace the switch with a native checkbox for simple interaction.
vi.mock("@/components/ui/switch", () => ({
  Switch: ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: () => void }) => (
    <input type="checkbox" checked={checked} onChange={onCheckedChange} aria-label="Service actif" />
  ),
}));

// Replace select primitives with simple wrappers because behavior is not the target.
vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: () => <span>selected value</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Install the global fetch stub used by create and update handlers.
vi.stubGlobal("fetch", fetchMock);

// Reuse one existing service so the update branch stays deterministic.
const existingService : ServiceType = {
  id: 5,
  name: "Garantie",
  description: "Extension",
  overheadType: 1,
  overheadValue: 500,
  listingType: 0,
  isOptional: false,
  isActive: true,
};

const percentageService = {
  id: 9,
  name: "Commission",
  description: "Pourcentage location",
  overheadType: overheadType.Percentage,
  overheadValue: 0.5,
  listingType: 1,
  isOptional: true,
  isActive: false,
};

// Cover the form validation and its create and update branches.
describe("ServiceForm", () => {
  // Reset the shared mocks between scenarios.
  beforeEach(() => {
    fetchMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
  });

  // Restore the global fetch stub after this file completes.
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  // Verify the create form stays disabled until required fields are filled.
  it("shows validation guidance until required fields are completed", () => {
    render(<ServiceForm refreshServices={vi.fn()} />);

    expect(
      screen.getByText("! Complétez les champs obligatoires pour activer le bouton de sauvegarde"),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button")[0]).toBeDisabled();
  });

  // Verify the create branch sends the mapped payload and refreshes on success.
  it("creates a service with the mapped payload", async () => {
    const user = userEvent.setup();
    const refreshServices = vi.fn();

    fetchMock.mockResolvedValueOnce({ ok: true });

    render(<ServiceForm refreshServices={refreshServices} />);

    const textboxes = screen.getAllByRole("textbox");

    await user.type(textboxes[0], "Livraison");
    await user.type(textboxes[1], "Livraison premium");
    await user.clear(screen.getByRole("spinbutton"));
    await user.type(screen.getByRole("spinbutton"), "10");
    await user.click(screen.getAllByRole("button")[0]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-123",
        },
        body: JSON.stringify({
          Id: undefined,
          Name: "Livraison",
          Description: "Livraison premium",
          OverheadType: 0,
          OverheadValue: 10,
          ListingType: 0,
          IsOptional: false,
          IsActive: true,
        }),
      });
    });
    expect(refreshServices).toHaveBeenCalledTimes(1);
    expect(toastSuccessMock).toHaveBeenCalledWith("Service créé avec succès !");
  });

  // Verify the update branch uses PUT and exposes the delete callback button.
  it("updates an existing service and exposes delete behavior", async () => {
    const user = userEvent.setup();
    const refreshServices = vi.fn();
    const deleteService = vi.fn();

    fetchMock.mockResolvedValueOnce({ ok: true });

    render(
      <ServiceForm
        service={existingService}
        refreshServices={refreshServices}
        deleteService={deleteService}
      />,
    );

    const buttons = screen.getAllByRole("button");

    await user.click(buttons[0]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/services/5", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-123",
        },
        body: JSON.stringify({
          Id: 5,
          Name: "Garantie",
          Description: "Extension",
          OverheadType: 1,
          OverheadValue: 500,
          ListingType: 0,
          IsOptional: false,
          IsActive: true,
        }),
      });
    });
    expect(refreshServices).toHaveBeenCalledTimes(1);
    expect(toastSuccessMock).toHaveBeenCalledWith("Service mis à jour avec succès !");

    await user.click(buttons[1]);

    expect(deleteService).toHaveBeenCalledWith(5);
  });

  // Verify the create branch shows the API error toast when the request is rejected.
  it("shows an error toast when service creation fails", async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValueOnce({ ok: false });

    render(<ServiceForm refreshServices={vi.fn()} />);

    const textboxes = screen.getAllByRole("textbox");

    await user.type(textboxes[0], "Livraison");
    await user.type(textboxes[1], "Livraison premium");
    await user.clear(screen.getByRole("spinbutton"));
    await user.type(screen.getByRole("spinbutton"), "10");
    await user.click(screen.getAllByRole("button")[0]);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith("Erreur lors de la création du service.");
    });
  });

  // Verify the update branch maps percentage values and surfaces thrown request errors.
  it("maps percentage services and shows an error toast when update throws", async () => {
    const user = userEvent.setup();

    fetchMock.mockRejectedValueOnce(new Error("network down"));

    render(<ServiceForm service={percentageService} refreshServices={vi.fn()} />);

    expect(screen.getByRole("spinbutton")).toHaveValue(50);
    expect(screen.getByRole("checkbox", { name: "Service actif" })).not.toBeChecked();

    await user.click(screen.getAllByRole("button")[0]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/services/9", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-123",
        },
        body: JSON.stringify({
          Id: 9,
          Name: "Commission",
          Description: "Pourcentage location",
          OverheadType: 0,
          OverheadValue: 0.005,
          ListingType: 1,
          IsOptional: true,
          IsActive: false,
        }),
      });
    });
    expect(toastErrorMock).toHaveBeenCalledWith("Erreur lors de la mise à jour du service.");
  });
});