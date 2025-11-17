import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { Prisma, UserProfile } from '@prisma/client';

@Injectable()
export class UserProfileRepository {
  constructor(private db: DatabaseService) {}

  async getAllUserProfiles(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserProfileWhereUniqueInput;
    where?: Prisma.UserProfileWhereInput;
    orderBy?: Prisma.UserProfileOrderByWithRelationInput;
    select?: Prisma.UserProfileSelect;
  }): Promise<UserProfile[]> {
    const { skip, take, cursor, where, orderBy, select } = params;

    return this.db.userProfile.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createUserProfile(params: {
    data: Prisma.UserProfileCreateInput;
    select?: Prisma.UserProfileSelect;
  }): Promise<UserProfile> {
    const { data, select } = params;
    return this.db.userProfile.create({ data, select });
  }

  async updateUserProfile(params: {
    where: Prisma.UserProfileWhereUniqueInput;
    data: Prisma.UserProfileUpdateInput;
    select?: Prisma.UserProfileSelect;
  }): Promise<UserProfile> {
    const { where, data, select } = params;
    return this.db.userProfile.update({ where, data, select });
  }

  async getUserProfileById(params: {
    where: Prisma.UserProfileWhereUniqueInput;
    select?: Prisma.UserProfileSelect;
  }): Promise<UserProfile | null> {
    const { where, select } = params;
    return this.db.userProfile.findUnique({ where, select });
  }

  async getUserProfileByUserId(userId: number): Promise<UserProfile | null> {
    return this.db.userProfile.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async countUserProfiles(params?: {
    where?: Prisma.UserProfileWhereInput;
  }): Promise<number> {
    return this.db.userProfile.count(params);
  }

  async softDeleteUserProfile(params: {
    where: Prisma.UserProfileWhereUniqueInput;
  }): Promise<UserProfile> {
    const { where } = params;
    return this.db.userProfile.update({
      where,
      data: { isDeleted: true },
    });
  }
}
