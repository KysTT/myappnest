import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function Root() {
  return (
    <>
      <div className="p-2 flex gap-4 m-auto">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>

        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
        <Link to="/ExpensesTracker" className="[&.active]:font-bold">
          ExpensesTracker
        </Link>
        <Link to="/Store" className="[&.active]:font-bold">
          Store
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <div className="p-2 gap-4 m-auto">
        <Outlet />
      </div>
      <Toaster />
    </>
  );
}
