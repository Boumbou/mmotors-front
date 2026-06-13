import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import Register from "@/routes/auth/Register";

// Keep route state configurable so each test controls the destination.
let mockLocationState: { from?: string } | undefined;

// Expose navigation calls for redirect assertions.
const mockNavigate = vi.fn();

// Expose the register action returned by the auth store selector.
const mockRegister = vi.fn();

// Capture the alert side effect used on registration errors.
const alertMock = vi.fn();

// Silence and assert the caught error path in the component.
const consoleErrorMock = vi.fn();

// Replace router hooks with stable test doubles.
vi.mock("react-router", () => ({
  useLocation: () => ({ state: mockLocationState }),
  useNavigate: () => mockNavigate,
}));

// Replace the store hook with a selector-driven mock state.
vi.mock("@/routes/auth/userStore", () => ({
  default: (selector: (state: { register: typeof mockRegister }) => unknown) =>
    selector({ register: mockRegister }),
}));

// Stub the child form so the test stays focused on page orchestration.
vi.mock("@/routes/auth/components/register-form", () => ({
  RegisterForm: ({
    handleSubmit,
    destination,
  }: {
    handleSubmit: (
      email: string,
      password: string,
      name: string,
      lastName: string,
    ) => Promise<void>;
    destination: string;
  }) => (
    <div>
      <p data-testid="destination">{destination}</p>
      <button
        onClick={() =>
          handleSubmit("jean@example.com", "secret123", "Jean", "Dupont")
        }
      >
        submit register
      </button>
    </div>
  ),
}));

// Cover only the page-level registration orchestration.
describe("Register page", () => {
  // Reset mocks and shared state between test cases.
  beforeEach(() => {
    mockLocationState = undefined;
    mockNavigate.mockReset();
    mockRegister.mockReset();
    alertMock.mockReset();
    consoleErrorMock.mockReset();
    vi.stubGlobal("alert", alertMock);
    vi.spyOn(console, "error").mockImplementation(consoleErrorMock);
  });

  // Restore global and console stubs after this file finishes.
  afterAll(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  // Verify the page forwards the previous destination into the child form.
  it("passes the previous route destination to the register form", () => {
    mockLocationState = { from: "/catalogue/vehicle/42" };
    mockRegister.mockResolvedValue("Inscription réussie");

    render(<Register />);

    expect(screen.getByTestId("destination")).toHaveTextContent("/catalogue/vehicle/42");
  });

  // Verify a successful registration redirects to the previous page.
  it("redirects to the destination after successful registration", async () => {
    const user = userEvent.setup();

    mockLocationState = { from: "/catalogue?type=locations" };
    mockRegister.mockResolvedValue("Inscription réussie");

    render(<Register />);

    await user.click(screen.getByRole("button", { name: "submit register" }));

    expect(mockRegister).toHaveBeenCalledWith(
      "jean@example.com",
      "secret123",
      "Jean",
      "Dupont",
    );
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/catalogue?type=locations");
    });
  });

  // Verify the page falls back to profile when there is no route origin.
  it("redirects to profile when no previous route is provided", async () => {
    const user = userEvent.setup();

    mockRegister.mockResolvedValue("Inscription réussie");

    render(<Register />);

    expect(screen.getByTestId("destination")).toHaveTextContent("/profile");

    await user.click(screen.getByRole("button", { name: "submit register" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });

  // Verify a failed registration alerts the user and does not redirect.
  it("shows an alert and avoids redirect when registration fails", async () => {
    const user = userEvent.setup();

    mockRegister.mockRejectedValue(new Error("invalid data"));

    render(<Register />);

    await user.click(screen.getByRole("button", { name: "submit register" }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        "Erreur lors de l'inscription : veuillez vérifier vos informations et réessayer.",
      );
    });
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(consoleErrorMock).toHaveBeenCalled();
  });
});