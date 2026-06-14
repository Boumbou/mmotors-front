import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Layout from "@/routes/Layout";
import AuthLayout from "@/routes/auth/Layout";

vi.mock("@/components/NavBar", () => ({
  default: () => <div>navbar</div>,
}));

vi.mock("sonner", () => ({
  Toaster: () => <div>toaster</div>,
}));

vi.mock("react-router", () => ({
  Outlet: () => <div>outlet</div>,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

describe("Layouts", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("renders the app layout without the slate background on the home page", () => {
    const view = render(<Layout />);

    expect(screen.getByText("navbar")).toBeInTheDocument();
    expect(screen.getByText("toaster")).toBeInTheDocument();
    expect(screen.getByText("outlet")).toBeInTheDocument();
    expect(view.container.firstChild).not.toHaveClass("bg-slate-100");
  });

  it("adds the slate background away from the home page", () => {
    window.history.pushState({}, "", "/catalogue");

    const view = render(<Layout />);

    expect(view.container.firstChild).toHaveClass("bg-slate-100");
  });

  it("renders the auth layout with its back link", () => {
    render(<AuthLayout />);

    expect(screen.getByRole("link", { name: "<< Retour à l'accueil" })).toHaveAttribute("href", "/");
    expect(screen.getByText("outlet")).toBeInTheDocument();
  });
});