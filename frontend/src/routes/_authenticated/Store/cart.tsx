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
import { MinusIcon, PlusIcon, Trash } from "lucide-react";
import { useState } from "react";
import {
  getUserCart,
  userRoleQueryOptions,
  addProductToCart,
  removeProductFromCart,
  subtractProductFromCart,
  checkout,
} from "@/lib/api-nest.ts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";

async function getCart() {
  return await getUserCart();
}

export const Route = createFileRoute("/_authenticated/Store/cart")({
  component: RouteComponent,
});

function getRole() {
  const { isPending, error, data } = useQuery(userRoleQueryOptions);
  if (!isPending && !error) return data["role"];
}

function RouteComponent() {
  const userRole = getRole();
  if (userRole === "admin") {
    return (
      <>
        <NavBarAdmin />
        <RenderCart />
      </>
    );
  }
  return (
    <>
      <NavBarUser />
      <RenderCart />
    </>
  );
}

function RenderCart() {
  const [cart, setCart] = useState([]);
  let afterDelete = false,
    newData = false;

  const subtractMutation = useMutation({
    mutationFn: subtractProductFromCart,
    onError: () => {
      return toast("Failed");
    },
    onSuccess: () => {
      newData = true;
    },
  });

  const addMutation = useMutation({
    mutationFn: addProductToCart,
    onError: () => {
      return toast("Failed");
    },
    onSuccess: () => {
      newData = true;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: removeProductFromCart,
    onError: () => {
      return toast("Failed to remove product from cart");
    },
    onSuccess: () => {
      newData = true;
      afterDelete = true;
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: checkout,
    onError: () => {
      return toast("Failed to checkout");
    },
    onSuccess: () => {
      newData = true;
    },
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["getCart"],
    queryFn: getCart,
  });
  if (error) return "Error";

  if (!isPending) {
    if (data.length !== 0 && cart.length === 0) {
      newData = true;
    }
  }

  if (newData) {
    if (cart.length === 0 && afterDelete) {
      setCart([]);
      afterDelete = false;
    }
    if (!isPending) {
      if (data.length !== 0) {
        newData = false;
        setCart(data);
      }
    }
    newData = false;
  }

  let total = 0;
  if (cart.length !== 0) {
    total = cart.reduce((sum, item) => {
      const price = parseFloat(item.product.price); // Преобразуем строку в число
      const quantity = item.quantity; // Количество уже число
      return sum + price * quantity; // Добавляем к сумме стоимость * количество
    }, 0);
  }
  return (
    <>
      <div className="p-2 gap-4 m-auto max-w-screen-md">
        <Table className="m-auto max-w-screen-md">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Total</TableHead>
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
                      <TableCell>
                        <Skeleton className="h-5" />
                      </TableCell>
                    </TableRow>
                  ))
              : cart.map(({ product, quantity }, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>
                      <Button
                        disabled={quantity <= 1}
                        onClick={() =>
                          subtractMutation.mutate({ product_id: product.id })
                        }
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 mr-2"
                      >
                        <MinusIcon />
                      </Button>
                      {quantity}
                      <Button
                        key={index}
                        disabled={quantity >= product.stock}
                        onClick={() =>
                          addMutation.mutate({ product_id: product.id })
                        }
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 ml-2"
                      >
                        <PlusIcon />
                      </Button>
                    </TableCell>
                    <TableCell>{product.price * quantity}</TableCell>
                    <TableCell>
                      <Button
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          deleteMutation.mutate({ product_id: product.id });
                        }}
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                      >
                        <Trash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          {cart.length !== 0 ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Checkout</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Proceed to payment</AlertDialogTitle>
                  <AlertDialogDescription>
                    Amount to pay: {total}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={checkoutMutation.isPending}
                    onClick={() => {
                      checkoutMutation.mutate({ cart: cart });
                    }}
                  >
                    Pay
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <></>
          )}
        </div>
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
