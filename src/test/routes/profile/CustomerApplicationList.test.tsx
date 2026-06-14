import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import CustomerApplicationList from "@/routes/profile/components/CustomerApplicationList";
import type { ApplicationType } from "@/types/ApplicationType";

const navigateMock = vi.fn();
const fetchNextPageMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  useLocation: () => ({ pathname: "/profile" }),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div data-testid="application-skeleton" />,
}));

vi.mock("@/components/pagination/MmotorsPagination", () => ({
  default: ({ onPageChange }: { onPageChange: () => void }) => (
    <button onClick={() => onPageChange()}>next page</button>
  ),
}));

const applications : ApplicationType[] = [
  {
    id: 17,
    applicationServices: [],
    applicationType: 0,
    createdAt: "2026-06-13T10:00:00.000Z",
    documents: [],
    reviewedByUserId: null,
    rejectionReason: "",
    status: 2,
    totalAmount: 21000,
    updatedAt: "2026-06-13T10:00:00.000Z",
    userId: "user-1",
    vehicleId: 42,
    vehicle: {
      id: 42,
      brand: "Peugeot",
      model: "208",
      year: 2024,
      motorization: 0,
      mileage: 12000,
      listedAmount: 21000,
      listingType: 0,
      status: 0,
    },
    customer: {
      name: "Ari",
      lastName: "Martin",
      email: "ari@example.com",
    },
  },
];

describe("CustomerApplicationList", () => {
  it("renders loading skeletons while the first page is pending", () => {
    render(
      <CustomerApplicationList
        applications={[]}
        pagedResult={null}
        fetchNextPage={fetchNextPageMock}
      />,
    );

    expect(screen.getAllByTestId("application-skeleton")).toHaveLength(5);
  });

  it("renders applications and wires navigation and pagination", async () => {
    const user = userEvent.setup();

    render(
      <CustomerApplicationList
        applications={applications}
        pagedResult={{ totalCount: 1, pageNumber: 1, pageSize: 10, totalPages: 3 }}
        fetchNextPage={fetchNextPageMock}
      />,
    );

    expect(screen.getByText("#17 - Peugeot 208 2024")).toBeInTheDocument();
    expect(screen.getByText("Statut : Soumis")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button")[0]);
    expect(navigateMock).toHaveBeenCalledWith("/application/17", {
      state: { origin: "/profile", section: "applications" },
    });

    await user.click(screen.getByRole("button", { name: "next page" }));
    expect(fetchNextPageMock).toHaveBeenCalledTimes(1);
  });
});