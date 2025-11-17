import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { PatientProfile, Prisma } from '@prisma/client';

@Injectable()
export class PatientProfileRepository {
  constructor(private db: DatabaseService) {}

  async getAllPatientProfiles(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PatientProfileWhereUniqueInput;
    where?: Prisma.PatientProfileWhereInput;
    orderBy?: Prisma.PatientProfileOrderByWithRelationInput;
    select?: Prisma.PatientProfileSelect;
  }): Promise<PatientProfile[]> {
    const { skip, take, cursor, where, orderBy, select } = params;

    return this.db.patientProfile.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createPatientProfile(params: {
    data: Prisma.PatientProfileCreateInput;
    select?: Prisma.PatientProfileSelect;
  }): Promise<PatientProfile> {
    const { data, select } = params;
    return this.db.patientProfile.create({ data, select });
  }

  async updatePatientProfile(params: {
    where: Prisma.PatientProfileWhereUniqueInput;
    data: Prisma.PatientProfileUpdateInput;
    select?: Prisma.PatientProfileSelect;
  }): Promise<PatientProfile> {
    const { where, data, select } = params;
    return this.db.patientProfile.update({ where, data, select });
  }

  async getPatientProfileById(params: {
    where: Prisma.PatientProfileWhereInput;
    select?: Prisma.PatientProfileSelect;
  }): Promise<PatientProfile | null> {
    const { where, select } = params;
    return this.db.patientProfile.findFirst({ where, select });
  }

  async getPatientProfileByUserId(
    userId: number,
  ): Promise<PatientProfile | null> {
    return this.db.patientProfile.findUnique({
      where: { userId },
      include: { user: { include: { profile: true } } },
    });
  }

  async getPatientProfileByPatientId(
    patientId: string,
  ): Promise<PatientProfile | null> {
    return this.db.patientProfile.findUnique({
      where: { patientId },
      include: { user: { include: { profile: true } } },
    });
  }

  async countPatientProfiles(params?: {
    where?: Prisma.PatientProfileWhereInput;
  }): Promise<number> {
    return this.db.patientProfile.count(params);
  }

  async softDeletePatientProfile(params: {
    where: Prisma.PatientProfileWhereUniqueInput;
  }): Promise<PatientProfile> {
    const { where } = params;
    return this.db.patientProfile.update({
      where,
      data: { isDeleted: true },
    });
  }

  async searchPatientsByName(searchTerm: string): Promise<PatientProfile[]> {
    return this.db.patientProfile.findMany({
      where: {
        user: {
          profile: {
            OR: [
              { firstName: { contains: searchTerm, mode: 'insensitive' } },
              { lastName: { contains: searchTerm, mode: 'insensitive' } },
              { fullName: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
        },
        isDeleted: false,
      },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });
  }
}
