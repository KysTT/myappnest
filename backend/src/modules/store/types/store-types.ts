import { Decimal } from '@prisma/client/runtime/client';

export type CartItems = {
  quantity: number;
  product: {
    id: number;
    name: string;
    description: string;
    stock: number;
    price: Decimal;
    category: string;
    image_url: string;
  };
};
