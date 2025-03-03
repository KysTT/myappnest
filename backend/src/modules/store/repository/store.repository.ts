import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/database/services/prisma.service';
import { CartItem, Product } from '@prisma/client';

@Injectable()
export class StoreRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findProductById(product_id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id: product_id } });
  }

  async findOrCreateCart(user_id: number) {
    let userCart = await this.prisma.cart.findFirst({
      where: {
        user_id: user_id,
      },
    });
    if (!userCart) {
      userCart = await this.prisma.cart.create({
        data: {
          user_id: user_id,
        },
      });
    }
    return userCart;
  }

  async resolveCartItems(
    cartItems: CartItem[],
    userCart: { id: number; user_id: number },
  ) {
    let res = [];
    for (const cartItem of cartItems) {
      const product = await this.findProductById(cartItem.product_id);
      const t = {};
      t['product'] = product;
      t['quantity'] = cartItem.quantity;
      // @ts-ignore
      res.push(t);
    }
    return res;
  }

  async findCart(user_id: number) {
    const userCart = await this.findOrCreateCart(user_id);
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cart_id: userCart.id,
      },
    });
    return await this.resolveCartItems(cartItems, userCart);
  }

  async createProduct(
    name: string,
    description: string,
    stock: number,
    price: number,
    category: string,
    image_url: string,
  ): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name,
        description,
        stock,
        price,
        category,
        image_url,
      },
    });
  }

  async addProductToCart(
    user_id: number,
    product_id: number,
  ): Promise<CartItem> {
    let userCart = await this.findOrCreateCart(user_id);
    let item = await this.prisma.cartItem.findFirst({
      where: { cart_id: userCart.id, product_id: product_id },
    });
    if (item !== null) {
      return this.prisma.cartItem.update({
        where: { id: item.id, cart_id: item.cart_id, product_id: product_id },
        data: {
          quantity: (item.quantity += 1),
        },
      });
    }
    return this.prisma.cartItem.create({
      data: {
        cart_id: userCart.id,
        product_id: product_id,
        quantity: 1,
      },
    });
  }

  async removeProductFromCart(user_id: number, product_id: number) {
    let userCart = await this.findOrCreateCart(user_id);
    await this.prisma.cartItem.deleteMany({
      where: {
        cart_id: userCart.id,
        product_id: product_id,
      },
    });
    return userCart;
  }

  async decreaseProductQuantity(
    user_id: number,
    product_id: number,
  ): Promise<CartItem[]> {
    let userCart = await this.findOrCreateCart(user_id);
    const item = await this.prisma.cartItem.findFirst({
      where: {
        cart_id: userCart.id,
        product_id: product_id,
      },
      select: {
        quantity: true,
      },
    });
    return this.prisma.cartItem.updateManyAndReturn({
      where: {
        cart_id: userCart.id,
        product_id: product_id,
      },
      data: {
        quantity: item!.quantity - 1,
      },
    });
  }

  async checkout(user_id: number) {
    let userCart = await this.findOrCreateCart(user_id);
    await this.prisma.cartItem.deleteMany({
      where: {
        cart_id: userCart.id,
      },
    });
    return userCart;
  }

  async editProduct(
    product_id: number,
    name: string,
    description: string,
    stock: number,
    price: number,
    category: string,
    image_url: string,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: {
        id: product_id,
      },
      data: {
        name,
        description,
        stock,
        price,
        category,
        image_url,
      },
    });
  }
}
