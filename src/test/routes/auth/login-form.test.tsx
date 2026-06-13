import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/routes/auth/components/login-form";

const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("disables submit until email and password are both filled", () => {
    render(<LoginForm destination="/profile" handleLogin={vi.fn()} />);

    const submitButton = screen.getByRole("button", { name: "Se connecter" });
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Mot de passe");

    expect(submitButton).toBeDisabled();

    userEvent.setup();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it("enables submit when both fields are filled", async () => {
    const user = userEvent.setup();

    render(<LoginForm destination="/profile" handleLogin={vi.fn()} />);

    const submitButton = screen.getByRole("button", { name: "Se connecter" });

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Mot de passe"), "secret123");

    expect(submitButton).toBeEnabled();
  });

  it("submits the entered credentials", async () => {
    const user = userEvent.setup();
    const handleLogin = vi.fn();

    render(<LoginForm destination="/profile" handleLogin={handleLogin} />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Mot de passe"), "secret123");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(handleLogin).toHaveBeenCalledTimes(1);
    expect(handleLogin).toHaveBeenCalledWith("user@example.com", "secret123");
  });

  it("navigates to register with the current destination", async () => {
    const user = userEvent.setup();

    render(<LoginForm destination="/catalogue?type=achats" handleLogin={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Inscrivez-vous" }));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/auth/register", {
      state: { from: "/catalogue?type=achats" },
    });
  });
});