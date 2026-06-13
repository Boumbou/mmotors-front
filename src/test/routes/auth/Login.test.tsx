import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import Login from "@/routes/auth/Login";

// Keep the current route state configurable per test.
let mockLocationState: { from?: string } | undefined;

// Expose navigation calls for redirect assertions.
const mockNavigate = vi.fn();

// Expose the auth action returned by the store selector.
const mockLogin = vi.fn();

// Control the browser alert side effect used on login failures.
const alertMock = vi.fn();

// Replace router hooks with stable test doubles.
vi.mock("react-router", () => ({
  useLocation: () => ({ state: mockLocationState }),
  useNavigate: () => mockNavigate,
}));

// Replace the store hook with a selector-driven mock state.
vi.mock("@/routes/auth/userStore", () => ({
  default: (selector: (state: { login: typeof mockLogin }) => unknown) =>
    selector({ login: mockLogin }),
}));

// Stub the child form so the test only exercises page orchestration.
vi.mock("@/routes/auth/components/login-form", () => ({
  LoginForm: ({
    handleLogin,
    destination,
  }: {
    handleLogin: (email: string, password: string) => Promise<void>;
    destination: string;
  }) => (
    <div>
      <p data-testid="destination">{destination}</p>
      <button onClick={() => handleLogin("user@example.com", "secret123")}>submit login</button>
    </div>
  ),
}));

// Build a deferred promise so loading behavior can be observed before resolve.
const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

// Cover only the page-level login orchestration.
describe("Login page", () => {
  // Reset mocks and shared route state between scenarios.
  beforeEach(() => {
    mockLocationState = undefined;
    mockNavigate.mockReset();
    mockLogin.mockReset();
    alertMock.mockReset();
    vi.stubGlobal("alert", alertMock);
  });

  // Restore the global alert after this file completes.
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  // Verify the page forwards the previous route into the form destination prop.
  it("passes the previous route destination to the login form", () => {
    mockLocationState = { from: "/catalogue/vehicle/42" };
    mockLogin.mockResolvedValue("Connexion réussie");

    render(<Login />);

    expect(screen.getByTestId("destination")).toHaveTextContent("/catalogue/vehicle/42");
  });

  // Verify a successful login shows loading then redirects to the previous page.
  it("shows loading during login and redirects on success", async () => {
    const user = userEvent.setup();
    const deferred = createDeferred<string>();

    mockLocationState = { from: "/catalogue?type=achats" };
    mockLogin.mockReturnValue(deferred.promise);

    render(<Login />);

    await user.click(screen.getByRole("button", { name: "submit login" }));

    expect(mockLogin).toHaveBeenCalledWith("user@example.com", "secret123");
    expect(screen.getByText("Connexion en cours...")).toBeInTheDocument();

    deferred.resolve("Connexion réussie");

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/catalogue?type=achats");
    });
    await waitFor(() => {
      expect(screen.queryByText("Connexion en cours...")).not.toBeInTheDocument();
    });
  });

  // Verify a failed login shows the user-facing alert and does not redirect.
  it("shows an alert when login fails", async () => {
    const user = userEvent.setup();

    mockLogin.mockRejectedValue(new Error("bad credentials"));

    render(<Login />);

    await user.click(screen.getByRole("button", { name: "submit login" }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        "Oops nous n'avons pas pu vous connecter, veuillez vérifier vos identifiants et réessayer.",
      );
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // Verify the page falls back to the profile route when no origin is provided.
  it("redirects to profile when no previous route is provided", async () => {
    const user = userEvent.setup();

    mockLogin.mockResolvedValue("Connexion réussie");

    render(<Login />);

    expect(screen.getByTestId("destination")).toHaveTextContent("/profile");

    await user.click(screen.getByRole("button", { name: "submit login" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });
});