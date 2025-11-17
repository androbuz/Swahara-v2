import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { $Enums, Invite, Prisma } from '@prisma/client';

@Injectable()
export class InviteRepository {
  constructor(private db: DatabaseService) {}

  async getAllInvites(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.InviteWhereUniqueInput;
    where?: Prisma.InviteWhereInput;
    orderBy?: Prisma.InviteOrderByWithRelationInput;
    select?: Prisma.InviteSelect;
  }): Promise<Invite[]> {
    const { skip, take, cursor, where, orderBy, select } = params;

    return this.db.invite.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createInvite(params: {
    data: Prisma.InviteCreateInput;
    select?: Prisma.InviteSelect;
  }): Promise<Invite> {
    const { data, select } = params;
    return this.db.invite.create({ data, select });
  }

  async updateInvite(params: {
    where: Prisma.InviteWhereUniqueInput;
    data: Prisma.InviteUpdateInput;
    select?: Prisma.InviteSelect;
  }): Promise<Invite> {
    const { where, data, select } = params;
    return this.db.invite.update({ where, data, select });
  }

  async getInviteById(params: {
    where: Prisma.InviteWhereUniqueInput;
    select?: Prisma.InviteSelect;
  }): Promise<Invite | null> {
    const { where, select } = params;
    return this.db.invite.findUnique({ where, select });
  }

  async getInviteByPublicId(publicId: string): Promise<Invite | null> {
    return this.db.invite.findUnique({
      where: { publicId },
      include: { invitedByUser: { include: { profile: true } } },
    });
  }

  async getInviteByEmail(invitedEmail: string): Promise<Invite | null> {
    return this.db.invite.findFirst({
      where: {
        invitedEmail,
        status: $Enums.InviteStatus.PENDING,
        isDeleted: false,
      },
      include: { invitedByUser: { include: { profile: true } } },
    });
  }

  async getInviteByEmailV2(invitedEmail: string): Promise<Invite | null> {
    return this.db.invite.findFirst({
      where: {
        invitedEmail,
      },
      include: { invitedByUser: { include: { profile: true } } },
    });
  }

  async getInvitesByUser(userId: number): Promise<Invite[]> {
    return this.db.invite.findMany({
      where: {
        invitedByUserId: userId,
        isDeleted: false,
      },
      include: { invitedByUser: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countInvites(params?: {
    where?: Prisma.InviteWhereInput;
  }): Promise<number> {
    return this.db.invite.count(params);
  }

  async softDeleteInvite(params: {
    where: Prisma.InviteWhereUniqueInput;
    data?: Prisma.InviteUpdateInput;
  }): Promise<Invite> {
    const { where } = params;
    return this.db.invite.update({
      where,
      data: { isDeleted: true, ...params.data },
    });
  }

  async acceptInvite(params: {
    where: Prisma.InviteWhereUniqueInput;
  }): Promise<Invite> {
    const { where } = params;
    return this.db.invite.update({
      where,
      data: {
        status: $Enums.InviteStatus.ACCEPTED,
        acceptedAt: new Date(),
      },
    });
  }

  async revokeInvite(params: {
    where: Prisma.InviteWhereUniqueInput;
  }): Promise<Invite> {
    const { where } = params;
    return this.db.invite.update({
      where,
      data: {
        status: $Enums.InviteStatus.REVOKED,
        revokedAt: new Date(),
      },
    });
  }

  async expireOldInvites(): Promise<number> {
    const result = await this.db.invite.updateMany({
      where: {
        status: $Enums.InviteStatus.PENDING,
        expiresAt: { lt: new Date() },
      },
      data: {
        status: $Enums.InviteStatus.EXPIRED,
      },
    });
    return result.count;
  }
}
