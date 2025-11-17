import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private db: DatabaseService) {}

  async getAllUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    select?: Prisma.UserSelect;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.db.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createUser(params: {
    data: Prisma.UserCreateInput;
    select?: Prisma.UserSelect;
  }): Promise<User> {
    const { data, select } = params;
    return this.db.user.create({ data, select });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
    select?: Prisma.UserSelect;
  }): Promise<User> {
    const { where, data, select } = params;
    return this.db.user.update({ where, data, select });
  }

  async deleteUser(params: {
    where: Prisma.UserWhereUniqueInput;
  }): Promise<User> {
    const { where } = params;
    return this.db.user.delete({ where });
  }

  async softDeleteUser(params: {
    where: Prisma.UserWhereUniqueInput;
  }): Promise<User> {
    const { where } = params;
    return this.db.user.update({
      where,
      data: { isDeleted: true },
    });
  }

  async getUserById(params: {
    where: Prisma.UserWhereUniqueInput;
    select?: Prisma.UserSelect;
  }): Promise<User | null> {
    const { where, select } = params;
    return this.db.user.findUnique({
      where,
      select,
    });
  }

  async getUser(params: {
    where: Prisma.UserWhereUniqueInput;
  }): Promise<User | null> {
    const { where } = params;
    return this.db.user.findUnique({ where, include: { profile: true } });
  }

  async getUserByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
      include: {
        profile: true,
        patientProfile: true,
        doctorProfile: true,
      },
    });
  }

  async getUserByPhone(phone: string) {
    return this.db.user.findUnique({
      where: { phone },
      include: {
        profile: true,
        patientProfile: true,
        doctorProfile: true,
      },
    });
  }

  async getUserByPublicId(publicId: string) {
    return this.db.user.findUnique({
      where: { publicId },
      include: {
        profile: true,
        patientProfile: true,
        doctorProfile: true,
      },
    });
  }

  async getUserByPasswordResetToken(hashedToken: string) {
    return this.db.user.findFirst({
      where: { passwordResetToken: hashedToken },
      include: {
        profile: true,
        patientProfile: true,
        doctorProfile: true,
      },
    });
  }

  async countUsers(params?: {
    where?: Prisma.UserWhereInput;
  }): Promise<number> {
    return this.db.user.count(params);
  }

  async updateLastLogin(userId: number): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  async verifyEmail(userId: number): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
  }

  async verifyPhone(userId: number): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: { phoneVerified: true },
    });
  }

  async updatePasswordResetToken(params: {
    userId: number;
    token: string;
    expiry: Date;
  }): Promise<User> {
    return this.db.user.update({
      where: { id: params.userId },
      data: {
        passwordResetToken: params.token,
        resetTokenExpiry: params.expiry,
      },
    });
  }

  async clearPasswordResetToken(userId: number): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: {
        passwordResetToken: null,
        resetTokenExpiry: null,
      },
    });
  }
}
