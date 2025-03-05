import { queryOptions } from "@tanstack/react-query";

const BASE_URL = "http://localhost:3000/api";

export async function getCurrentUser() {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return { user: await response.json() };
}

export const userQueryOptions = queryOptions({
  queryKey: ["getCurrentUser"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

export async function loginUser(body: { email: string; password: string }) {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export async function registerUser(body: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export async function logoutUser() {
  const response = await fetch(`${BASE_URL}/users/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export async function getCurrentUserRole() {
  const response = await fetch(`${BASE_URL}/users/userRole`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export const userRoleQueryOptions = queryOptions({
  queryKey: ["getCurrentUserRole"],
  queryFn: getCurrentUserRole,
  staleTime: Infinity,
});

export async function changeUserRole(body: { role: string }) {
  const response = await fetch(`${BASE_URL}/users/userRole`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export async function totalSpent() {
  const response = await fetch(`${BASE_URL}/expenses/totalSpent`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return { total: await response.json() };
}

export async function getExpenses() {
  const response = await fetch(`${BASE_URL}/expenses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return { expenses: await response.json() };
}

export async function createExpense(body: {
  title: string;
  amount: number;
  date: string;
}) {
  const response = await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export async function deleteExpense(expense_id: number) {
  const response = await fetch(`${BASE_URL}/expenses/${expense_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export async function getStoreProducts() {
  const response = await fetch(`${BASE_URL}/store`);
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export async function getStoreProductsQuery(page: number, limit?: number) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (limit)
    params.append('limit', limit.toString());

  const url = `${BASE_URL}/store?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return await response.json();
}

export async function getUserCart() {
  const response = await fetch(`${BASE_URL}/store/cart`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export async function createProduct(body: {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
}) {
  const response = await fetch(`${BASE_URL}/store/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export async function getProductById(product_id: number) {
  const response = await fetch(`${BASE_URL}/store/products/${product_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export async function editProduct(
  body: { name: string; description: string; price: number; stock: number },
  product_id: number,
) {
  const response = await fetch(`${BASE_URL}/store/products/${product_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export async function addProductToCart(body: { product_id: number }) {
  const response = await fetch(`${BASE_URL}/store/addToCart`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export async function subtractProductFromCart(body: { product_id: number }) {
  const response = await fetch(`${BASE_URL}/store/subtractFromCart`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export async function removeProductFromCart(body: { product_id: number }) {
  const response = await fetch(`${BASE_URL}/store/removeFromCart`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}

export async function checkout(body: { cart: never }) {
  const response = await fetch(`${BASE_URL}/store/checkout`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
}
