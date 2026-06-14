import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Dashboard from "@/routes/profile/components/Dashboard";

const navigateMock = vi.fn();
const storeState = {
  user: null as null | { name: string },
};

vi.mock("@/routes/auth/userStore", () => ({
  default: (selector: (state: typeof storeState) => unknown) => selector(storeState),
}));

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock("@/routes/profile/components/PieChart", () => ({
  ChartPieDonutText: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/routes/profile/components/BarChart", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe("Dashboard", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    storeState.user = null;
  });

  it("redirects to login when the user is missing", () => {
    const view = render(
      <Dashboard applications={[]} pagedResult={{ totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }} />,
    );

    expect(navigateMock).toHaveBeenCalledWith("/auth/login");
    expect(view.container).toBeEmptyDOMElement();
  });

  it("renders the greeting, charts, and summary when the user exists", () => {
    storeState.user = { name: "Ari" };

    render(
      <Dashboard
        applications={[]}
        pagedResult={{ totalCount: 4, pageNumber: 1, pageSize: 10, totalPages: 1 }}
      />,
    );

    expect(screen.getByText("Bonjour Ari")).toBeInTheDocument();
    expect(screen.getByText("Vous avez 4 dossiers en cours")).toBeInTheDocument();
    expect(screen.getByText("Répartition des dossiers")).toBeInTheDocument();
    expect(screen.getByText("Nombre de dossiers par mois")).toBeInTheDocument();
    expect(screen.getByText("Bienvenue sur votre tableau de bord")).toBeInTheDocument();
  });
});