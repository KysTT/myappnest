import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/database/services/prisma.service';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findMe(userId: string): Promise<User | null> {
    if (!userId) return null;
    return this.prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
  }

  async changeUserRole(userId: string, role: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        role: role === 'admin' ? 'user' : 'admin',
      },
    });
  }

  async getUserRole(userId: string): Promise<{ role: string } | null> {
    return this.prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
      select: {
        role: true,
      },
    });
  }

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      return await this.prisma.user.create({
        data: { name, email, password: hashedPassword },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new ConflictException('User with this email already exists');
      }
      throw e;
    }
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
