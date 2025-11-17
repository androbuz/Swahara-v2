import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { PrescriptionMedication, Prisma } from '@prisma/client';

@Injectable()
export class PrescriptionMedicationRepository {
  constructor(private db: DatabaseService) {}

  async getAllPrescriptionMedications(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PrescriptionMedicationWhereUniqueInput;
    where?: Prisma.PrescriptionMedicationWhereInput;
    orderBy?: Prisma.PrescriptionMedicationOrderByWithRelationInput;
    select?: Prisma.PrescriptionMedicationSelect;
  }): Promise<PrescriptionMedication[]> {
    const { skip, take, cursor, where, orderBy, select } = params;

    return this.db.prescriptionMedication.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createPrescriptionMedication(params: {
    data: Prisma.PrescriptionMedicationCreateInput;
    select?: Prisma.PrescriptionMedicationSelect;
  }): Promise<PrescriptionMedication> {
    const { data, select } = params;
    return this.db.prescriptionMedication.create({ data, select });
  }

  async createMany(params: {
    data: Prisma.PrescriptionMedicationCreateManyInput[];
  }): Promise<{ count: number }> {
    const { data } = params;
    return this.db.prescriptionMedication.createMany({ data });
  }

  async updatePrescriptionMedication(params: {
    where: Prisma.PrescriptionMedicationWhereUniqueInput;
    data: Prisma.PrescriptionMedicationUpdateInput;
    select?: Prisma.PrescriptionMedicationSelect;
  }): Promise<PrescriptionMedication> {
    const { where, data, select } = params;
    return this.db.prescriptionMedication.update({ where, data, select });
  }

  async getPrescriptionMedicationById(params: {
    where: Prisma.PrescriptionMedicationWhereUniqueInput;
    select?: Prisma.PrescriptionMedicationSelect;
  }): Promise<PrescriptionMedication | null> {
    const { where, select } = params;
    return this.db.prescriptionMedication.findUnique({
      where,
      select,
    });
  }

  async getPrescriptionMedicationByPublicId(
    publicId: string,
  ): Promise<PrescriptionMedication | null> {
    return this.db.prescriptionMedication.findUnique({
      where: { publicId },
      include: {
        medication: true,
        prescription: {
          include: {
            patient: { include: { profile: true } },
            doctor: { include: { profile: true } },
          },
        },
      },
    });
  }

  async getMedicationsByPrescription(
    prescriptionId: number,
  ): Promise<PrescriptionMedication[]> {
    return this.db.prescriptionMedication.findMany({
      where: {
        prescriptionId,
        isDeleted: false,
      },
      include: { medication: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async checkDuplicateMedication(
    prescriptionId: number,
    medicationId: number,
  ): Promise<PrescriptionMedication | null> {
    return this.db.prescriptionMedication.findFirst({
      where: {
        prescriptionId,
        medicationId,
        isDeleted: false,
      },
    });
  }

  async countPrescriptionMedications(params?: {
    where?: Prisma.PrescriptionMedicationWhereInput;
  }): Promise<number> {
    return this.db.prescriptionMedication.count(params);
  }

  async softDeletePrescriptionMedication(params: {
    where: Prisma.PrescriptionMedicationWhereUniqueInput;
  }): Promise<PrescriptionMedication> {
    const { where } = params;
    return this.db.prescriptionMedication.update({
      where,
      data: { isDeleted: true },
    });
  }

  async updateRefills(
    prescriptionMedicationId: number,
    refills: number,
  ): Promise<PrescriptionMedication> {
    return this.db.prescriptionMedication.update({
      where: { id: prescriptionMedicationId },
      data: { refills },
    });
  }

  async getMedicationUsageStats(medicationId: number): Promise<{
    totalPrescriptions: number;
    activePrescriptions: number;
  }> {
    const [total, active] = await Promise.all([
      this.db.prescriptionMedication.count({
        where: { medicationId, isDeleted: false },
      }),
      this.db.prescriptionMedication.count({
        where: {
          medicationId,
          isDeleted: false,
          prescription: {
            status: 'ACTIVE',
          },
        },
      }),
    ]);

    return {
      totalPrescriptions: total,
      activePrescriptions: active,
    };
  }
}
