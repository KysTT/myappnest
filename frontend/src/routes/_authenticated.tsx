import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { loginUser, registerUser, userQueryOptions } from "@/lib/api-nest.ts";

const Login = () => {
  const [registering, setRegistering] = useState(false);
  const formRegister = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const res = await registerUser(value);
      if (!res) return toast("Bad request");
      formRegister.reset();
      redirect({
        to: "/",
      });
      return toast("Successfully registered");
    },
  });

  const formLogin = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const res = await loginUser(value);
      if (res.message !== "login successful") return toast("Bad request");
      formLogin.reset();
      toast("Login successful");
      return redirect({
        to: "",
        reloadDocument: true,
      });
    },
  });
  return (
    <div>
      <p className="grid max-w-md m-auto mb-4 items-center gap-1.5">
        Please login first
      </p>
      {!registering ? (
        <form
          name="formRegister"
          className="grid max-w-md m-auto items-center gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            formRegister.handleSubmit();
          }}
        >
          <formRegister.Field
            name="name"
            validators={{
              onChangeAsync: ({ value }) =>
                !value
                  ? "Name is required"
                  : value.length < 3
                    ? "Name must be at least 3 characters"
                    : undefined,
            }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Your name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="John Doe"
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <em>{field.state.meta.errors.join(", ")}</em>
                  ) : null}
                </>
              );
            }}
          />
          <formRegister.Field
            name="email"
            validators={{
              onChangeAsync: ({ value }) =>
                !value
                  ? "Email is required"
                  : value.length < 3
                    ? "Name must be at least 3 characters"
                    : undefined,
            }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Your email</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    type="email"
                    placeholder="JohnDoe@gmail.com"
                    onChange={(e) => field.handleChange(e.target.value)}
                    required={true}
                  />
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <em>{field.state.meta.errors.join(", ")}</em>
                  ) : null}
                </>
              );
            }}
          />
          <formRegister.Field
            name="password"
            validators={{
              onChangeAsync: ({ value }) =>
                !value
                  ? "Password is required"
                  : value.length < 6
                    ? "Password must be at least 6 characters"
                    : undefined,
            }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Password</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    type="password"
                    placeholder=""
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <em>{field.state.meta.errors.join(", ")}</em>
                  ) : null}
                </>
              );
            }}
          />
          <formRegister.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <>
                <Button
                  name="registerButton"
                  className="mt-2 w-32"
                  type="submit"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? "..." : "Register"}
                </Button>
                <Button
                  type="button"
                  className="mt-2 w-32"
                  onClick={() => setRegistering(!registering)}
                >
                  {registering ? "Register" : "Login"}
                </Button>
              </>
            )}
          />
        </form>
      ) : (
        <form
          name="formLogin"
          className="grid max-w-md m-auto items-center gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            formLogin.handleSubmit();
          }}
        >
          <formLogin.Field
            name="email"
            validators={{
              onChangeAsync: ({ value }) =>
                !value
                  ? "Email is required"
                  : value.length < 3
                    ? "Name must be at least 3 characters"
                    : undefined,
            }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Your email</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="JohnDoe@gmail.com"
                    onChange={(e) => field.handleChange(e.target.value)}
                    required={true}
                  />
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <em>{field.state.meta.errors.join(", ")}</em>
                  ) : null}
                </>
              );
            }}
          />
          <formLogin.Field
            name="password"
            validators={{
              onChangeAsync: ({ value }) =>
                !value
                  ? "Password is required"
                  : value.length < 6
                    ? "Password must be at least 6 characters"
                    : undefined,
            }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Password</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    type="password"
                    placeholder=""
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <em>{field.state.meta.errors.join(", ")}</em>
                  ) : null}
                </>
              );
            }}
          />
          <formLogin.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <>
                <Button
                  name="loginButton"
                  className="mt-2 w-32"
                  type="submit"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? "..." : "Login"}
                </Button>
                <Button
                  type="button"
                  className="mt-2 w-32"
                  onClick={() => setRegistering(!registering)}
                >
                  {registering ? "Register" : "Login"}
                </Button>
              </>
            )}
          />
        </form>
      )}
    </div>
  );
};

const Component = () => {
  const { user } = Route.useRouteContext();
  if (!user) {
    return <Login />;
  }
  return <Outlet />;
};

// src/routes/_authenticated.tsx
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      return await queryClient.fetchQuery(userQueryOptions);
    } catch (error) {
      return { user: null };
    }
  },
  component: Component,
});
