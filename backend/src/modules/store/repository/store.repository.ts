import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/database/services/prisma.service';
import { Product } from '@prisma/client';
import { type CartItems } from '@modules/store/types/store-types';

@Injectable()
export class StoreRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProducts(
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.product.count(),
    ]);
    return { products, total };
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

  async findCart(user_id: number): Promise<CartItems[]> {
    let userCart = await this.prisma.cart.findFirst({
      where: {
        user_id: user_id,
      },
      select: {
        cartItems: {
          select: {
            product: true,
            quantity: true,
          },
          orderBy: [
            {
              product: {
                name: 'asc',
              },
            },
          ],
        },
      },
    });
    if (!userCart) {
      userCart = await this.prisma.cart.create({
        data: {
          user_id: user_id,
        },
        select: {
          cartItems: {
            select: {
              product: true,
              quantity: true,
            },
          },
        },
      });
    }
    return userCart.cartItems;
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
  ): Promise<CartItems[]> {
    const userCart = await this.findOrCreateCart(user_id);
    const item = await this.prisma.cartItem.findFirst({
      where: { cart_id: userCart.id, product_id: product_id },
    });
    if (item !== null) {
      await this.prisma.cartItem.update({
        where: { id: item.id, cart_id: item.cart_id, product_id: product_id },
        data: {
          quantity: (item.quantity += 1),
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cart_id: userCart.id,
          product_id: product_id,
          quantity: 1,
        },
      });
    }
    return this.findCart(user_id);
  }

  async removeProductFromCart(
    user_id: number,
    product_id: number,
  ): Promise<CartItems[]> {
    const userCart = await this.findOrCreateCart(user_id);
    await this.prisma.cartItem.deleteMany({
      where: {
        cart_id: userCart.id,
        product_id: product_id,
      },
    });
    return this.findCart(user_id);
  }

  async decreaseProductQuantity(
    user_id: number,
    product_id: number,
  ): Promise<CartItems[]> {
    const userCart = await this.findOrCreateCart(user_id);
    const item = await this.prisma.cartItem.findFirst({
      where: {
        cart_id: userCart.id,
        product_id: product_id,
      },
      select: {
        quantity: true,
      },
    });
    await this.prisma.cartItem.updateManyAndReturn({
      where: {
        cart_id: userCart.id,
        product_id: product_id,
      },
      data: {
        quantity: item!.quantity - 1,
      },
    });
    return this.findCart(user_id);
  }

  async checkout(user_id: number): Promise<CartItems[]> {
    const userCart = await this.findOrCreateCart(user_id);
    await this.prisma.cartItem.deleteMany({
      where: {
        cart_id: userCart.id,
      },
    });
    return this.findCart(user_id);
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
