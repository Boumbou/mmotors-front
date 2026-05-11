import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";


export default function MmotorsPagination(props: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
      const { currentPage, totalPages, onPageChange } = props;

      return(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              { currentPage>1 && <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />}
            </PaginationItem>
            <PaginationItem>
              {`page ${currentPage} sur ${totalPages}`}
            </PaginationItem>
            <PaginationItem>
              { currentPage<totalPages && <PaginationNext onClick={() => onPageChange(currentPage + 1)} />}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
    }
