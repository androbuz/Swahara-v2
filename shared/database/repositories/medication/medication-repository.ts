import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { Medication, Prisma } from '@prisma/client';

@Injectable()
export class MedicationRepository {
  constructor(private db: DatabaseService) {}

  async getAllMedications(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MedicationWhereUniqueInput;
    where?: Prisma.MedicationWhereInput;
    orderBy?: Prisma.MedicationOrderByWithRelationInput;
    select?: Prisma.MedicationSelect;
  }): Promise<Medication[]> {
    const { skip, take, cursor, where, orderBy, select } = params;

    return this.db.medication.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createMedication(params: {
    data: Prisma.MedicationCreateInput;
    select?: Prisma.MedicationSelect;
  }): Promise<Medication> {
    const { data, select } = params;
    return this.db.medication.create({ data, select });
  }

  async updateMedication(params: {
    where: Prisma.MedicationWhereUniqueInput;
    data: Prisma.MedicationUpdateInput;
    select?: Prisma.MedicationSelect;
  }): Promise<Medication> {
    const { where, data, select } = params;
    return this.db.medication.update({ where, data, select });
  }

  async getMedicationById(params: {
    where: Prisma.MedicationWhereUniqueInput;
    select?: Prisma.MedicationSelect;
  }): Promise<Medication | null> {
    const { where, select } = params;
    return this.db.medication.findUnique({ where, select });
  }

  async getMedicationByPublicId(publicId: string): Promise<Medication | null> {
    return this.db.medication.findUnique({
      where: { publicId },
    });
  }

  async getMedicationByName(name: string): Promise<Medication | null> {
    return this.db.medication.findUnique({
      where: { name },
    });
  }

  async searchMedicationsByName(
    query: string,
    limit: number,
  ): Promise<Medication[]> {
    return this.db.medication.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { genericName: { contains: query, mode: 'insensitive' } },
          { brandName: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
        isDeleted: false,
      },
      take: limit,
      orderBy: { name: 'asc' },
    });
  }

  async getMedicationsByCategory(category: string): Promise<Medication[]> {
    return this.db.medication.findMany({
      where: {
        category,
        isActive: true,
        isDeleted: false,
      },
      orderBy: { name: 'asc' },
    });
  }

  async countMedications(params?: {
    where?: Prisma.MedicationWhereInput;
  }): Promise<number> {
    return this.db.medication.count(params);
  }

  async softDeleteMedication(params: {
    where: Prisma.MedicationWhereUniqueInput;
  }): Promise<Medication> {
    const { where } = params;
    return this.db.medication.update({
      where,
      data: { isDeleted: true },
    });
  }

  async updateMedicationStatus(
    medicationId: number,
    isActive: boolean,
  ): Promise<Medication> {
    return this.db.medication.update({
      where: { id: medicationId },
      data: { isActive },
    });
  }

  async getActiveMedications(): Promise<Medication[]> {
    return this.db.medication.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
      orderBy: { name: 'asc' },
    });
  }
}
