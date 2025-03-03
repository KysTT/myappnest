import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { useState } from "react";
import { editProduct, getProductById } from "@/lib/api-nest.ts";

let product_id: number;

export const Route = createFileRoute("/_authenticated/Store/editProduct")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <NavBarAdmin />
      <GetProductForm />
    </>
  );
}

function GetProductForm() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    stock: 0,
    price: 0,
    category: "",
    image_url: "",
  });

  const formGet = useForm({
    defaultValues: {
      product_id: 0,
    },
    onSubmit: async ({ value }) => {
      product_id = value.product_id || 0;
      const res = await getProductById(product_id);
      if (!res) return toast("Bad request");
      //formGet.reset()
      const t = await res;
      setProduct(t);
    },
  });
  const formPut = useForm({
    defaultValues: {
      name: product.name || "",
      description: product.description || "",
      stock: product.stock || 0,
      price: product.price || 0,
      category: product.category || "",
      image_url: product.image_url || "",
    },
    onSubmit: async ({ value }) => {
      const res = await editProduct(value, product_id);
      if (!res.name) return toast("Bad request");
      formPut.reset();
      formGet.reset();
      setProduct({
        name: "",
        description: "",
        stock: 0,
        price: 0,
        category: "",
        image_url: "",
      });
      return toast("Product updated successfully");
    },
  });
  return (
    <>
      <h2 className="max-w-md m-auto mb-4">Create product</h2>
      <div className="p-2 gap-4 m-auto max-w-screen-md">
        <form
          className="grid max-w-md m-auto items-center gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            formGet.handleSubmit();
          }}
        >
          <formGet.Field
            name="product_id"
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Product id</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="Name"
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
          <formGet.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button className="mt-2 w-32" type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Get product"}
              </Button>
            )}
          />
        </form>
        <div className="p-2 gap-4 m-auto max-w-screen-md"></div>
        {product.name ? (
          <>
            <div className="p-2 gap-4 m-auto max-w-screen-md">
              <form
                className="grid max-w-md m-auto items-center gap-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  formPut.handleSubmit();
                }}
              >
                <formPut.Field
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
                <formPut.Field
                  name="description"
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
                <formPut.Field
                  name="price"
                  validators={{
                    onChange: ({ value }) =>
                      value <= 0
                        ? "Price must be a positive number"
                        : undefined,
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
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                        />
                        {field.state.meta.isTouched &&
                        field.state.meta.errors.length ? (
                          <em>{field.state.meta.errors.join(", ")}</em>
                        ) : null}
                      </>
                    );
                  }}
                />
                <formPut.Field
                  name="stock"
                  validators={{
                    onChange: ({ value }) =>
                      value <= 0
                        ? "Stock must be a positive number"
                        : undefined,
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
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                        />
                        {field.state.meta.isTouched &&
                        field.state.meta.errors.length ? (
                          <em>{field.state.meta.errors.join(", ")}</em>
                        ) : null}
                      </>
                    );
                  }}
                />
                <formPut.Field
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
                <formPut.Field
                  name="image_url"
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
                <formPut.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button
                      className="mt-2 w-32"
                      type="submit"
                      disabled={!canSubmit}
                    >
                      {isSubmitting ? "..." : "Update product"}
                    </Button>
                  )}
                />
              </form>
            </div>
            <Toaster />
          </>
        ) : (
          <></>
        )}
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
