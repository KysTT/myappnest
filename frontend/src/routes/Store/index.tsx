import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import {
  userRoleQueryOptions,
  addProductToCart, getStoreProductsQuery,
} from '@/lib/api-nest.ts';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface StoreSearchParams {
  page?: number;
}

function getRole() {
  const { isPending, error, data } = useQuery(userRoleQueryOptions);
  if (!isPending && !error) return data["role"];
}

async function getProductsQuery(page: number, limit?: number) {
  return await getStoreProductsQuery(page, limit);
}

export const Route = createFileRoute("/Store/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): StoreSearchParams => {
    return {
      page: typeof search.page === "number" ? search.page : 1
    };
  }
});

function RouteComponent() {
  const userRole = getRole();
  if (userRole === "admin") {
    return (
      <>
        <NavBarAdmin />
        <RenderProducts />
      </>
    );
  }
  return (
    <>
      <NavBarUser />
      <RenderProducts />
    </>
  );
}

function RenderProducts() {
  const search = useSearch({from: '/Store/'}) as StoreSearchParams;
  const page = search.page || 1;
  const navigate = useNavigate({ from: "/Store" });

  const { isPending, error, data } = useQuery({
    queryKey: ["getProductsQuery", page],
    queryFn: ()=>getProductsQuery(page),
  });
  if (error) return "Error";

  const products = data?.data || [];
  const { total, limit, totalPages } = data?.meta || {};

  const handlePageChange = (newPage: number) => {
    navigate({ search: { page: newPage } });
  };

  const mutation = useMutation({
    mutationFn: addProductToCart,
    onError: () => {
      return toast("Failed to add to cart");
    },
    onSuccess: () => {
      return toast("Successfully added product");
    },
  });

  return (
    <>
      <div className="p-2 gap-4 m-auto max-w-screen-md">
        <Table className="m-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="w-5">Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5" />
                      </TableCell>
                    </TableRow>
                  ))
              : products.map(
                  // @ts-ignore
                  ({ id, name, description, stock, price }) => (
                    <TableRow key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{description}</TableCell>
                      <TableCell>{stock}</TableCell>
                      <TableCell>{price}</TableCell>
                      <TableCell className="w-5">
                        <Button
                          disabled={mutation.isPending || stock === 0}
                          onClick={() => mutation.mutate({ product_id: id })}
                          variant="outline"
                          size="icon"
                        >
                          <Plus />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ),
                )}
          </TableBody>
        </Table>
      </div>
      <Pagination>
        {!isPending ?
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(page - 1)}
                className={page <= 1 ? 'pointer-events-none opacity-50' : ''}/>
            </PaginationItem>
            {
              Array.from({length: totalPages}, (_, i) => i+1)
                .map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={page === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              )
            }
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(page + 1)}
                className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}/>
            </PaginationItem>
          </PaginationContent>
          :
            <PaginationContent />
        }
      </Pagination>
    </>
  );
}

function NavBarAdmin() {
  return (
    <>
      <div className="p-2 flex gap-4 mb-2">
        <Link to="/Store" className="[&.active]:font-bold">
          Store
        </Link>
        <Link to="/Store/cart" className="[&.active]:font-bold">
          Cart
        </Link>
        <Link to="/Store/createProduct" className="[&.active]:font-bold">
          Create Product
        </Link>
        <Link to="/Store/editProduct" className="[&.active]:font-bold">
          Edit Product
        </Link>
      </div>
    </>
  );
}

function NavBarUser() {
  return (
    <>
      <div className="p-2 flex gap-4 mb-2">
        <Link to="/Store" className="[&.active]:font-bold">
          Store
        </Link>
        <Link to="/Store/cart" className="[&.active]:font-bold">
          Cart
        </Link>
      </div>
    </>
  );
}
