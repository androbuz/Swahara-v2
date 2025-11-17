import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class RolesRepository {
  constructor(private readonly db: DatabaseService) {}

  async getAllRoles(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoleWhereUniqueInput;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput;
    select?: Prisma.RoleSelect;
  }): Promise<Role[]> {
    const { skip, take, cursor, where, orderBy, select } = params;

    return this.db.role.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createRole(data: Prisma.RoleCreateInput, select?: Prisma.RoleSelect) {
    return this.db.role.create({
      data,
      select,
    });
  }

  async findRole(where: Prisma.RoleWhereInput, select?: Prisma.RoleSelect) {
    return this.db.role.findFirst({
      where,
      select,
    });
  }

  async findRoleByPublicId(publicId: string, select?: Prisma.RoleSelect) {
    return this.findRole({ publicId }, select);
  }

  async updateRole(
    where: Prisma.RoleWhereUniqueInput,
    data: Prisma.RoleUpdateInput,
    select?: Prisma.RoleSelect,
  ) {
    return this.db.role.update({
      where,
      data,
      select,
    });
  }

  async softDeleteRole(
    where: Prisma.RoleWhereUniqueInput,
    data: Prisma.RoleUpdateInput,
    select?: Prisma.RoleSelect,
  ) {
    return this.db.role.update({
      where,
      data,
      select,
    });
  }

  async countRoles(params?: { where?: Prisma.RoleWhereInput }) {
    return this.db.role.count(params);
  }
}
