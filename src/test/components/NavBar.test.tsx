import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import NavBar from "@/components/NavBar";

//initialize the mock functions and state for the tests
const navigateMock = vi.fn();
const logoutMock = vi.fn();

// Mock the user store to control the user state in tests
const storeState = {
  user: null as null | { name: string; lastName: string },
  logout: logoutMock,
};

// Mock the react-router hooks to control navigation in tests
vi.mock("@/routes/auth/userStore", () => ({
  default: (selector: (state: typeof storeState) => unknown) => selector(storeState),
}));

// Mock the react-router hooks to control navigation in tests
vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
  NavLink: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

// Mock the dropdown menu to control the user menu in tests
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe("NavBar", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    logoutMock.mockReset();
    storeState.user = null;
  });

  // Verify the login action is rendered for guests.
  it("shows the login action for guests", () => {
    render(<NavBar />);

    expect(screen.getByRole("button", { name: "Se connecter" })).toBeInTheDocument();
  });

  // Verify the user menu is rendered for authenticated users.
  it("shows the user menu and wires profile and logout actions", async () => {
    const user = userEvent.setup();

    storeState.user = { name: "Ari", lastName: "Martin" };

    render(<NavBar />);

    expect(screen.getByRole("button", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ari Martin/ })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Mon profil" }));
    expect(navigateMock).toHaveBeenCalledWith("/profile");

    await user.click(screen.getByRole("button", { name: "Se déconnecter" }));
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});