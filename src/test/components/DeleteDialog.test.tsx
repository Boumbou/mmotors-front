import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DeleteDialog } from "@/components/DeleteDialog";

// Group the component's user-facing dialog behavior in one focused suite.
describe("DeleteDialog", () => {
  // Verify the trigger content is rendered before the dialog opens.
  it("renders the provided trigger content", () => {
    render(
      <DeleteDialog
        header="Supprimer le dossier"
        description="Cette action est irréversible."
        OnDeleteApplication={vi.fn()}
      >
        <span>Ouvrir la suppression</span>
      </DeleteDialog>,
    );

    expect(screen.getByRole("button", { name: "Ouvrir la suppression" })).toBeInTheDocument();
  });

  // Verify opening the dialog reveals the provided header and description.
  it("opens the dialog and shows the provided content", async () => {
    const user = userEvent.setup();

    render(
      <DeleteDialog
        header="Supprimer le dossier"
        description="Cette action est irréversible."
        OnDeleteApplication={vi.fn()}
      >
        <span>Ouvrir la suppression</span>
      </DeleteDialog>,
    );

    await user.click(screen.getByRole("button", { name: "Ouvrir la suppression" }));

    expect(screen.getByText("Supprimer le dossier")).toBeInTheDocument();
    expect(screen.getByText("Cette action est irréversible.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Confirmer la suppression/i }),
    ).toBeInTheDocument();
  });

  // Verify the confirmation action calls the provided delete callback once.
  it("calls the delete callback when the user confirms", async () => {
    const user = userEvent.setup();
    const onDeleteApplication = vi.fn();

    render(
      <DeleteDialog
        header="Supprimer le dossier"
        description="Cette action est irréversible."
        OnDeleteApplication={onDeleteApplication}
      >
        <span>Ouvrir la suppression</span>
      </DeleteDialog>,
    );

    await user.click(screen.getByRole("button", { name: "Ouvrir la suppression" }));
    await user.click(screen.getByRole("button", { name: /Confirmer la suppression/i }));

    expect(onDeleteApplication).toHaveBeenCalledTimes(1);
  });
});