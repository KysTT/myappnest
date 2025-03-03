import { createFileRoute, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import { createProduct } from "@/lib/api-nest.ts";

export const Route = createFileRoute("/_authenticated/Store/createProduct")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      stock: 0,
      price: 0,
      category: "",
      image_url: "",
    },
    onSubmit: async ({ value }) => {
      const res = await createProduct(value);
      if (!res) return toast("Bad request");
      form.reset();
      return toast("Product has been created");
    },
  });
  return (
    <>
      <NavBarAdmin />
      <h2 className="max-w-md m-auto mb-4">Create product</h2>
      <div className="p-2 gap-4 m-auto max-w-screen-md">
        <form
          className="grid max-w-md m-auto items-center gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value ? "Product name is required" : undefined,
            }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Product name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="Name"
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
          <form.Field
            name="description"
            // validators={{
            //     onChange: ({ value }) =>
            //         !value
            //             ? 'Product description is required'
            //             : value.length < 3
            //                 ? 'Product description must be at least 3 characters'
            //                 : undefined,
            // }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Product description</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="Description"
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
          <form.Field
            name="price"
            validators={{
              onChange: ({ value }) =>
                value <= 0 ? "Price must be a positive number" : undefined,
            }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Price</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    type="number"
                    placeholder="0"
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <em>{field.state.meta.errors.join(", ")}</em>
                  ) : null}
                </>
              );
            }}
          />
          <form.Field
            name="stock"
            validators={{
              onChange: ({ value }) =>
                value <= 0 ? "Stock must be a positive number" : undefined,
            }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Stock</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    type="number"
                    placeholder="0"
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <em>{field.state.meta.errors.join(", ")}</em>
                  ) : null}
                </>
              );
            }}
          />
          <form.Field
            name="category"
            validators={{
              onChange: ({ value }) =>
                !value ? "Product category is required" : undefined,
            }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Product category</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="Category"
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
          <form.Field
            name="image_url"
            // validators={{
            //     onChange: ({ value }) =>
            //         !value
            //             ? 'Product category is required'
            //             : value.length < 3
            //                 ? 'Product category must be at least 3 characters'
            //                 : undefined,
            // }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Image url</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="http://"
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
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button className="mt-2 w-32" type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Create product"}
              </Button>
            )}
          />
        </form>
      </div>
      <Toaster />
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
