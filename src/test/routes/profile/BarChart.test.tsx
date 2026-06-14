import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ChartBarDefault from "@/routes/profile/components/BarChart";

vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ChartTooltip: () => <div>tooltip</div>,
  ChartTooltipContent: () => <div>tooltip content</div>,
}));

vi.mock("recharts", () => ({
  BarChart: ({ children, data }: { children: React.ReactNode; data: Array<{ month: string; application: number }> }) => (
    <div>
      <div>{JSON.stringify(data)}</div>
      {children}
    </div>
  ),
  CartesianGrid: () => <div>grid</div>,
  XAxis: ({ tickFormatter }: { tickFormatter: (value: string) => string }) => <div>{tickFormatter("january")}</div>,
  Bar: () => <div>bar</div>,
}));

describe("ChartBarDefault", () => {
  it("groups applications by month and renders the chart shell", () => {
    render(
      <ChartBarDefault
        title="Nombre de dossiers par mois"
        data={[
          {
            id: 1,
            applicationServices: [],
            applicationType: 0,
            createdAt: "2026-01-10T10:00:00.000Z",
            documents: [],
            reviewedByUserId: null,
            rejectionReason: "",
            status: 0,
            totalAmount: 0,
            updatedAt: "2026-01-10T10:00:00.000Z",
            userId: "u1",
            vehicleId: 1,
            vehicle: { id: 1, brand: "Peugeot", model: "208", year: 2024, motorization: 0, mileage: 0, listedAmount: 0, listingType: 0, status: 0 },
            customer: { name: "Ari", lastName: "Martin", email: "ari@example.com" },
          },
          {
            id: 2,
            applicationServices: [],
            applicationType: 0,
            createdAt: "2026-01-11T10:00:00.000Z",
            documents: [],
            reviewedByUserId: null,
            rejectionReason: "",
            status: 2,
            totalAmount: 0,
            updatedAt: "2026-01-11T10:00:00.000Z",
            userId: "u1",
            vehicleId: 1,
            vehicle: { id: 1, brand: "Peugeot", model: "208", year: 2024, motorization: 0, mileage: 0, listedAmount: 0, listingType: 0, status: 0 },
            customer: { name: "Ari", lastName: "Martin", email: "ari@example.com" },
          },
          {
            id: 3,
            applicationServices: [],
            applicationType: 0,
            createdAt: "2026-02-01T10:00:00.000Z",
            documents: [],
            reviewedByUserId: null,
            rejectionReason: "",
            status: 3,
            totalAmount: 0,
            updatedAt: "2026-02-01T10:00:00.000Z",
            userId: "u1",
            vehicleId: 1,
            vehicle: { id: 1, brand: "Peugeot", model: "208", year: 2024, motorization: 0, mileage: 0, listedAmount: 0, listingType: 0, status: 0 },
            customer: { name: "Ari", lastName: "Martin", email: "ari@example.com" },
          },
        ]}
      />,
    );

    expect(screen.getByText("Nombre de dossiers par mois")).toBeInTheDocument();
    expect(screen.getByText("Nouveaux dossiers par mois")).toBeInTheDocument();
    expect(screen.getByText("jan")).toBeInTheDocument();
    expect(screen.getByText('[{"month":"January","application":2},{"month":"February","application":1}]')).toBeInTheDocument();
  });

  it("renders an empty chart when no data is provided", () => {
    render(<ChartBarDefault title="Vide" />);

    expect(screen.getByText("Vide")).toBeInTheDocument();
    expect(screen.getByText("[]")).toBeInTheDocument();
  });
});