import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { DocTemplateList } from "@/routes/profile/components/DocTemplateList";

// Expose the authenticated user consumed by the template requests.
const mockUser = { token: "token-123" };

// Mock network calls at the template-list boundary.
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

// Replace the nested form with a simple marker.
vi.mock("@/routes/profile/components/DocTemplateForm", () => ({
  default: ({ template }: { template?: { id: number } }) => (
    <div>{template ? `edit template ${template.id}` : "create template"}</div>
  ),
}));

// Install the global fetch stub used by load and delete actions.
vi.stubGlobal("fetch", fetchMock);

// Reuse one template payload so assertions stay deterministic.
const templates = [
  {
    id: 5,
    name: "Contrat standard",
    type: 1,
    isActive: true,
    updatedAt: "2026-06-13T10:00:00.000Z",
  },
];

// Cover template loading, nested form wiring, and delete behavior.
describe("DocTemplateList", () => {
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

  // Verify the list fetches templates and renders both form entry points.
  it("loads templates and renders create and edit entry points", async () => {
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue(templates),
    });

    render(<DocTemplateList />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/documenttemplate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-123",
        },
      });
    });
    expect(await screen.findByText("Contrat standard")).toBeInTheDocument();
    expect(screen.getByText("Vente")).toBeInTheDocument();
    expect(screen.getByText("create template")).toBeInTheDocument();
    expect(screen.getByText("edit template 5")).toBeInTheDocument();
  });

  // Verify a successful delete refreshes the list and shows a success toast.
  it("deletes a template and refreshes on success", async () => {
    const user = userEvent.setup();

    fetchMock
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(templates),
      })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(templates),
      });

    render(<DocTemplateList />);

    await screen.findByText("Contrat standard");
    await user.click(screen.getAllByRole("button")[2]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/documenttemplate/5", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-123",
        },
      });
    });
    expect(toastSuccessMock).toHaveBeenCalledWith("Modèle supprimé avec succès !");
  });

  // Verify a failed delete shows the current error toast.
  it("shows an error toast when deletion fails", async () => {
    const user = userEvent.setup();

    fetchMock
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(templates),
      })
      .mockResolvedValueOnce({ ok: false });

    render(<DocTemplateList />);

    await screen.findByText("Contrat standard");
    await user.click(screen.getAllByRole("button")[2]);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith("Erreur lors de la suppression du modèle.");
    });
  });
});