import { createFileRoute, Link } from "@tanstack/react-router";
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
  getStoreProducts,
  userRoleQueryOptions,
  addProductToCart,
} from "@/lib/api-nest.ts";

function getRole() {
  const { isPending, error, data } = useQuery(userRoleQueryOptions);
  if (!isPending && !error) return data["role"];
}

async function getProducts() {
  return await getStoreProducts();
}

export const Route = createFileRoute("/Store/")({
  component: RouteComponent,
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
  const { isPending, error, data } = useQuery({
    queryKey: ["getProducts"],
    queryFn: getProducts,
  });
  if (error) return "Error";

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
              : data!.map(
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
