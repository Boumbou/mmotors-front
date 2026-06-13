import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Forbidden from "@/components/Foribidden";
import InConstruction from "@/components/InConstruction";
import NoResult from "@/components/NoResult";

describe("Static views", () => {
    // Verify the forbidden state is rendered with the correct image and text.
    describe("Forbidden", () => {
        it("renders the forbidden state", () => {
            render(<Forbidden />);
            
            expect(screen.getByAltText("Accès interdit")).toHaveAttribute("src", "/Forbidden.png");
            expect(screen.getByText("Accès interdit 🚫")).toBeInTheDocument();
        });
    });

    // Verify the in-construction state is rendered with the correct image and text.
    describe("InConstruction", () => {
        it("renders the in-construction state", () => {
            render(<InConstruction />);

            expect(screen.getByAltText("En construction")).toHaveAttribute("src", "/InConstruction.png");
            expect(
                screen.getByText("Encore un petit peu de patience, cette page sera bientôt prête 🚧"),
            ).toBeInTheDocument();
        });
    });

    // Verify the no-result state is rendered with the correct image and text.
    describe('NoResult', () => {
        it('should render the NoResult component with the correct text', () => {
            render(<NoResult />);
            const noResultText = screen.getByText(/Aucun résultat trouvé/i);
            expect(noResultText).toBeInTheDocument();
        });
    });

});