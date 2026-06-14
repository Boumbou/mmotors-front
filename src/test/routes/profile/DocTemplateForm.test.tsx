import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import DocTemplateForm from "@/routes/profile/components/DocTemplateForm";

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
    <input type="checkbox" checked={checked} onChange={onCheckedChange} aria-label="Modèle actif" />
  ),
}));

// Replace select primitives with a native select so the form state can be changed.
vi.mock("@/components/ui/select", () => ({
  Select: ({ children, value, onValueChange, name }: { children: React.ReactNode; value: string; onValueChange: (value: string) => void; name: string }) => (
    <label>
      <span>{name}</span>
      <select aria-label={name} value={value} onChange={(event) => onValueChange(event.target.value)}>
        {children}
      </select>
    </label>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectValue: () => null,
  SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  ),
}));

// Install the global fetch stub used by create and update handlers.
vi.stubGlobal("fetch", fetchMock);

// Reuse one existing template so the update branch stays deterministic.
const existingTemplate = {
  id: 5,
  name: "Contrat vente",
  type: 1,
  isActive: true,
  updatedAt: "2026-06-13T10:00:00.000Z",
};

// Cover the form validation and its create and update branches.
describe("DocTemplateForm", () => {
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
    render(<DocTemplateForm refreshTemplates={vi.fn()} />);

    expect(
      screen.getByText("! Complétez les champs obligatoires pour activer le bouton de sauvegarde"),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button")[0]).toBeDisabled();
  });

  // Verify the create branch sends the mapped payload and refreshes on success.
  it("creates a template with the mapped payload", async () => {
    const user = userEvent.setup();
    const refreshTemplates = vi.fn();

    fetchMock.mockResolvedValueOnce({ ok: true });

    render(<DocTemplateForm refreshTemplates={refreshTemplates} />);

    await user.type(screen.getByRole("textbox"), "Contrat location");
    await user.selectOptions(screen.getByRole("combobox", { name: "type" }), "2");
    await user.click(screen.getAllByRole("button")[0]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/documenttemplate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-123",
        },
        body: JSON.stringify({
          Name: "Contrat location",
          IsActive: true,
          Type: 2,
        }),
      });
    });
    expect(refreshTemplates).toHaveBeenCalledTimes(1);
    expect(toastSuccessMock).toHaveBeenCalledWith("Modèle mis à jour avec succès !");
  });

  // Verify the update branch uses PUT and exposes the delete callback button.
  it("updates an existing template and exposes delete behavior", async () => {
    const user = userEvent.setup();
    const refreshTemplates = vi.fn();
    const deleteTemplate = vi.fn();

    fetchMock.mockResolvedValueOnce({ ok: true });

    render(
      <DocTemplateForm
        template={existingTemplate}
        refreshTemplates={refreshTemplates}
        deleteTemplate={deleteTemplate}
      />,
    );

    const buttons = screen.getAllByRole("button");

    await user.click(buttons[0]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/documenttemplate/5", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-123",
        },
        body: JSON.stringify({
          Id: 5,
          Name: "Contrat vente",
          IsActive: true,
          Type: 1,
        }),
      });
    });
    expect(refreshTemplates).toHaveBeenCalledTimes(1);
    expect(toastSuccessMock).toHaveBeenCalledWith("Modèle mis à jour avec succès !");

    await user.click(buttons[1]);

    expect(deleteTemplate).toHaveBeenCalledWith(5);
  });

  // Verify the create branch surfaces the API error toast when the request fails.
  it("shows an error toast when template creation fails", async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValueOnce({ ok: false });

    render(<DocTemplateForm refreshTemplates={vi.fn()} />);

    await user.type(screen.getByRole("textbox"), "Contrat location");
    await user.selectOptions(screen.getByRole("combobox", { name: "type" }), "2");
    await user.click(screen.getAllByRole("button")[0]);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith("Erreur lors de la mise à jour du modèle.");
    });
  });

  // Verify the update branch also surfaces the catch-path toast when the request throws.
  it("shows an error toast when template update throws", async () => {
    const user = userEvent.setup();

    fetchMock.mockRejectedValueOnce(new Error("network down"));

    render(<DocTemplateForm template={existingTemplate} refreshTemplates={vi.fn()} />);

    await user.click(screen.getAllByRole("button")[0]);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith("Erreur lors de la mise à jour du modèle.");
    });
  });
});