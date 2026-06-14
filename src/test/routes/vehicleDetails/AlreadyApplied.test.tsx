import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AlreadyApplied from "@/routes/vehicleDetails/components/AlreadyApplied";

// Test the rendering of the AlreadyApplied component.
describe("AlreadyApplied", () => {
  it("renders the already-applied guidance message", () => {
    render(<AlreadyApplied />);

    expect(screen.getByText("Vous avez déjà déposé un dossier")).toBeInTheDocument();
    expect(
      screen.getByText(/Encore un peu de patience, nous examinons votre dossier/i),
    ).toBeInTheDocument();
  });
});