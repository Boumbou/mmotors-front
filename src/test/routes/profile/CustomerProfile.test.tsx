import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CustomerProfile from "@/routes/profile/components/CustomerProfile";

// Keep the current user configurable for authenticated and unauthenticated branches.
let mockUser: any = {
  name: "Jean",
  lastName: "Dupont",
  email: "jean@example.com",
  created: "2026-06-13T10:00:00.000Z",
};

// Expose navigation calls for the unauthenticated redirect assertion.
const mockNavigate = vi.fn();

// Replace router navigation with a stable test double.
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Replace the auth store hook with a selector-driven mock state.
vi.mock("@/routes/auth/userStore", () => ({
  default: (selector: (state: { user: typeof mockUser }) => unknown) =>
    selector({ user: mockUser }),
}));

// Replace the delete dialog with a direct action button.
vi.mock("@/components/DeleteDialog", () => ({
  DeleteDialog: ({ OnDeleteApplication }: { OnDeleteApplication: () => void }) => (
    <button type="button" onClick={OnDeleteApplication}>delete account</button>
  ),
}));

// Replace the motion wrapper with a passthrough container.
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

// Cover the profile summary, redirect, and danger-zone action branches.
describe("CustomerProfile", () => {
  // Reset mutable mocks before each scenario.
  beforeEach(() => {
    mockUser = {
      name: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      created: "2026-06-13T10:00:00.000Z",
    };
    mockNavigate.mockReset();
    window.location.href = "http://localhost/";
  });

  // Verify missing users are redirected to login.
  it("redirects to login when the user is missing", () => {
    mockUser = null;

    const { container } = render(
      <CustomerProfile applications={[]} changeSectionCallBack={vi.fn()} />,
    );

    expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
    expect(container).toBeEmptyDOMElement();
  });

  // Verify the summary counts and section navigation callback are rendered correctly.
  it("renders profile information and dossier counts", async () => {
    const user = userEvent.setup();
    const changeSectionCallBack = vi.fn();

    render(
      <CustomerProfile
        applications={[
          { status: 0 } as any,
          { status: 1 } as any,
          { status: 2 } as any,
          { status: 3 } as any,
        ]}
        changeSectionCallBack={changeSectionCallBack}
      />,
    );

    expect(screen.getByText(/Nom :/)).toBeInTheDocument();
    expect(screen.getByText(/Jean Dupont/)).toBeInTheDocument();
    expect(screen.getByText(/Vous avez 1 brouillon/)).toBeInTheDocument();
    expect(screen.getByText(/Vous avez 1 dossier\(s\) en attente/)).toBeInTheDocument();
    expect(screen.getByText(/Vous avez 1 dossier\(s\) en cours/)).toBeInTheDocument();
    expect(screen.getByText(/Vous avez 1 dossier\(s\) approuvé/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Voir tous mes dossiers" }));

    expect(changeSectionCallBack).toHaveBeenCalledWith("applications");
  });

  // Verify the danger-zone action is rendered for account deletion support.
  it("renders the danger-zone support action", () => {
    render(<CustomerProfile applications={[]} changeSectionCallBack={vi.fn()} />);

    expect(screen.getByText("Zone dangereuse")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "delete account" })).toBeInTheDocument();
  });
});