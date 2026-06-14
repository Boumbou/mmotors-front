import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { ServicesList } from "@/routes/profile/components/ServicesList";
import type { ServiceType } from "@/types/ServiceType";

// Expose the authenticated user consumed by the delete handler.
const mockUser = { token: "token-123" };

// Mock network calls at the list boundary.
const fetchMock = vi.fn();

// Expose toast side effects for delete assertions.
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

// Replace dialog primitives with simple wrappers because overlay behavior is not the target.
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Replace the nested form with a marker that exposes its mode.
vi.mock("@/routes/profile/components/ServiceForm", () => ({
  default: ({ service }: { service?: { id: number } }) => (
    <div>{service ? `edit form ${service.id}` : "create form"}</div>
  ),
}));

// Install the global fetch stub used by delete actions.
vi.stubGlobal("fetch", fetchMock);

// Reuse a small service list so the render assertions stay deterministic.
const services : ServiceType[] = [
  {
    id: 5,
    name: "Garantie",
    description: "Extension",
    overheadType: 1,
    overheadValue: 500,
  },
];

// Cover list rendering, nested form wiring, and delete behavior.
describe("ServicesList", () => {
  // Reset shared mocks between scenarios.
  beforeEach(() => {
    fetchMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
  });

  // Restore the global fetch stub after this file completes.
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  // Verify the list renders service content and both nested form entry points.
  it("renders services and both create and edit form entry points", () => {
    render(<ServicesList services={services} refreshServices={vi.fn()} />);

    expect(screen.getByText("Ajouter un service")).toBeInTheDocument();
    expect(screen.getByText("Garantie")).toBeInTheDocument();
    expect(screen.getByText("Extension")).toBeInTheDocument();
    expect(screen.getByText("create form")).toBeInTheDocument();
    expect(screen.getByText("edit form 5")).toBeInTheDocument();
  });

  // Verify a successful delete refreshes the list and shows a success toast.
  it("deletes a service and refreshes on success", async () => {
    const user = userEvent.setup();
    const refreshServices = vi.fn();

    fetchMock.mockResolvedValueOnce({ ok: true });

    render(<ServicesList services={services} refreshServices={refreshServices} />);

    await user.click(screen.getAllByRole("button")[2]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/services/5", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-123",
        },
      });
    });
    expect(refreshServices).toHaveBeenCalledTimes(1);
    expect(toastSuccessMock).toHaveBeenCalledWith("Service supprimé avec succès !");
  });

  // Verify a failed delete shows the current error toast.
  it("shows an error toast when delete fails", async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValueOnce({ ok: false });

    render(<ServicesList services={services} refreshServices={vi.fn()} />);

    await user.click(screen.getAllByRole("button")[2]);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith("Erreur lors de la suppression du service.");
    });
  });
});