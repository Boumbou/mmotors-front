import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RegisterForm } from "@/routes/auth/components/register-form";

// Mock router navigation so the test can verify redirect intent.
const mockNavigate = vi.fn();

// Replace only the navigation hook used by the form.
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Group all RegisterForm behavior checks in one focused suite.
describe("RegisterForm", () => {
  // Reset navigation calls between tests.
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  // Verify the submit button stays disabled until every field is filled.
  it("disables submit until all required fields are filled", async () => {
    const user = userEvent.setup();

    render(<RegisterForm destination="/profile" handleSubmit={vi.fn()} />);

    const submitButton = screen.getByRole("button", { name: "M'inscrire" });

    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText("Nom"), "Dupont");
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText("Prénom"), "Jean");
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText("Email"), "jean@example.com");
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText("Mot de passe"), "secret123");
    expect(submitButton).toBeEnabled();
  });

  // Verify the form forwards the typed registration data on submit.
  it("submits the entered registration data", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<RegisterForm destination="/profile" handleSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Nom"), "Dupont");
    await user.type(screen.getByLabelText("Prénom"), "Jean");
    await user.type(screen.getByLabelText("Email"), "jean@example.com");
    await user.type(screen.getByLabelText("Mot de passe"), "secret123");
    await user.click(screen.getByRole("button", { name: "M'inscrire" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      "jean@example.com",
      "secret123",
      "Jean",
      "Dupont",
    );
  });

  // Verify the secondary action sends the user back to login with context.
  it("navigates to login with the current destination", async () => {
    const user = userEvent.setup();

    render(
      <RegisterForm
        destination="/catalogue/vehicle/42"
        handleSubmit={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Connectez-vous" }));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/auth/login", {
      state: { from: "/catalogue/vehicle/42" },
    });
  });
});