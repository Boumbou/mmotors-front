import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import MmotorsPagination from "@/components/pagination/MmotorsPagination";

vi.mock("@/components/ui/pagination", () => ({
  Pagination: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  PaginationContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PaginationItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PaginationPrevious: ({ onClick }: { onClick: () => void }) => <button onClick={onClick}>prev</button>,
  PaginationNext: ({ onClick }: { onClick: () => void }) => <button onClick={onClick}>next</button>,
}));

// Test suite for the Pagination component.
describe("MmotorsPagination", () => {

    // Test case to check if the pagination component renders correctly
    it("renders only the next action on the first page", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        render(<MmotorsPagination currentPage={1} totalPages={3} onPageChange={onPageChange} />);

        expect(screen.getByText("page 1 sur 3")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "prev" })).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "next" }));
        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    // Test case to check if the pagination component renders both
    it("renders only the previous action on the last page", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        render(<MmotorsPagination currentPage={3} totalPages={3} onPageChange={onPageChange} />);

        expect(screen.queryByRole("button", { name: "next" })).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "prev" }));
        expect(onPageChange).toHaveBeenCalledWith(2);
    });
});