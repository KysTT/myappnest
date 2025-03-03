import { createFileRoute } from "@tanstack/react-router";
import {
  userQueryOptions,
  changeUserRole,
  logoutUser,
} from "@/lib/api-nest.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const [role, setRole] = useState("");
  let newRole = false;
  const { isPending, error, data } = useQuery(userQueryOptions);
  if (isPending) return "loading";
  if (error) return "Not logged in";

  if (!isPending && !error)
    if (!role || newRole) {
      newRole = false;
      setRole(data.user.role);
    }

  const changeRoleMutation = useMutation({
    mutationFn: changeUserRole,
    onError: () => {
      return toast("Failed");
    },
    onSuccess: (data) => {
      setRole(data);
      newRole = true;
      return toast("Success");
    },
  });

  return (
    <>
      <Card className="w-fit m-auto">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              Hello {data.user.name}
              <Avatar>
                <AvatarFallback>{data.user.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>Your role is {data.user.role}</div>
          <div>
            <Button
              className="mt-4"
              variant="outline"
              disabled={changeRoleMutation.isPending}
              onClick={() =>
                changeRoleMutation.mutate({ role: data.user.role })
              }
            >
              Change role
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => logoutUser()}>Logout</Button>
        </CardFooter>
      </Card>
    </>
  );
}
