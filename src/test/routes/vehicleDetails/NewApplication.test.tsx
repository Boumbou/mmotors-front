import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import NewApplication from "@/routes/vehicleDetails/components/NewApplication";

// Keep router state configurable for the unauthenticated redirect branch.
let mockPathname = "/catalogue/vehicle/42";

// Keep the current user configurable for authenticated and guest flows.
let mockUser: any = { id: 7, roles: ["Customer"] };

// Expose navigation calls for guest CTA assertions.
const mockNavigate = vi.fn();

// Replace router hooks with stable test doubles.
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
}));

// Replace the auth store hook with a selector-driven mock state.
vi.mock("@/routes/auth/userStore", () => ({
  default: (selector: (state: { user: typeof mockUser }) => unknown) =>
    selector({ user: mockUser }),
}));

// Replace the checkbox with a simple native input.
vi.mock("@/components/ui/checkbox", () => ({
  Checkbox: ({ defaultChecked, onCheckedChange }: { defaultChecked?: boolean; onCheckedChange: () => void }) => (
    <input type="checkbox" defaultChecked={defaultChecked} onChange={onCheckedChange} aria-label="service checkbox" />
  ),
}));

// Cover the main listing-type and authentication branches.
describe("NewApplication", () => {
  // Reset mutable mocks between scenarios.
  beforeEach(() => {
    mockPathname = "/catalogue/vehicle/42";
    mockUser = { id: 7, roles: ["Customer"] };
    mockNavigate.mockReset();
  });

  // Verify rental listings show services and submit through the provided callback.
  it("renders rental guidance, services, and the submit action for authenticated users", async () => {
    const user = userEvent.setup();
    const onCheckboxChange = vi.fn();
    const onInitiateApplication = vi.fn();

    render(
      <NewApplication
        listingType={1}
        availableServices={[{ id: 5, name: "Garantie", overheadType: 1, overheadValue: 500, description: "" }]}
        selectedServices={[5]}
        onCheckboxChange={onCheckboxChange}
        onInitiateApplication={onInitiateApplication}
      />,
    );

    expect(screen.getByText(/dossier de location/i)).toBeInTheDocument();
    expect(screen.getByText("Garantie")).toBeInTheDocument();

    await user.click(screen.getByLabelText("service checkbox"));
    await user.click(screen.getByRole("button", { name: "Soumettre" }));

    expect(onCheckboxChange).toHaveBeenCalledWith(5);
    expect(onInitiateApplication).toHaveBeenCalledTimes(1);
  });

  // Verify the empty-services branch is rendered for purchase listings.
  it("shows the empty-service fallback for purchase listings", () => {
    render(
      <NewApplication
        listingType={0}
        availableServices={[]}
        selectedServices={[]}
        onCheckboxChange={vi.fn()}
        onInitiateApplication={vi.fn()}
      />,
    );

    expect(screen.getByText(/dossier d'achat/i)).toBeInTheDocument();
    expect(screen.getByText("Aucun service disponible pour ce type d'annonce.")).toBeInTheDocument();
  });

  // Verify guests are redirected to login with the current location preserved.
  it("redirects guests to login from the CTA", async () => {
    const user = userEvent.setup();

    mockUser = null;

    render(
      <NewApplication
        listingType={0}
        availableServices={[]}
        selectedServices={[]}
        onCheckboxChange={vi.fn()}
        onInitiateApplication={vi.fn()}
      />,
    );

    expect(screen.getByText("Connectez vous pour soumettre un dossier.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Connectez-vous" }));

    expect(mockNavigate).toHaveBeenCalledWith("/auth/login", {
      state: { from: "/catalogue/vehicle/42" },
    });
  });
});