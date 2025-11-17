import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { $Enums, Prescription, Prisma } from '@prisma/client';

@Injectable()
export class PrescriptionRepository {
  constructor(private db: DatabaseService) {}

  async getAllPrescriptions(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PrescriptionWhereUniqueInput;
    where?: Prisma.PrescriptionWhereInput;
    orderBy?: Prisma.PrescriptionOrderByWithRelationInput;
    select?: Prisma.PrescriptionSelect;
  }): Promise<Prescription[]> {
    const { skip, take, cursor, where, orderBy, select } = params;

    return this.db.prescription.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createPrescription(params: {
    data: Prisma.PrescriptionCreateInput;
    select?: Prisma.PrescriptionSelect;
  }): Promise<Prescription> {
    const { data, select } = params;
    return this.db.prescription.create({ data, select });
  }

  async updatePrescription(params: {
    where: Prisma.PrescriptionWhereUniqueInput;
    data: Prisma.PrescriptionUpdateInput;
    select?: Prisma.PrescriptionSelect;
  }): Promise<Prescription> {
    const { where, data, select } = params;
    return this.db.prescription.update({ where, data, select });
  }

  async getPrescriptionById(params: {
    where: Prisma.PrescriptionWhereUniqueInput;
    select?: Prisma.PrescriptionSelect;
  }): Promise<Prescription | null> {
    const { where, select } = params;
    return this.db.prescription.findUnique({ where, select });
  }

  async getPrescriptionByPublicId(
    publicId: string,
    select?: Prisma.PrescriptionSelect,
  ) {
    return this.db.prescription.findFirst({
      where: { publicId },
      select,
    });
  }

  async getPrescriptionsByPatient(patientId: number): Promise<Prescription[]> {
    return this.db.prescription.findMany({
      where: {
        patientId,
        isDeleted: false,
      },
      include: {
        doctor: { include: { profile: true } },
        consultation: true,
        medicalRecord: true,
      },
      orderBy: { prescriptionDate: 'desc' },
    });
  }

  async getPrescriptionsByDoctor(doctorId: number): Promise<Prescription[]> {
    return this.db.prescription.findMany({
      where: {
        doctorId,
        isDeleted: false,
      },
      include: {
        patient: { include: { profile: true } },
        consultation: true,
        medicalRecord: true,
      },
      orderBy: { prescriptionDate: 'desc' },
    });
  }

  async getActivePrescriptions(patientId: number): Promise<Prescription[]> {
    return this.db.prescription.findMany({
      where: {
        patientId,
        status: $Enums.PrescriptionStatus.ACTIVE,
        isDeleted: false,
        OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
      },
      include: {
        doctor: { include: { profile: true } },
      },
      orderBy: { prescriptionDate: 'desc' },
    });
  }

  async countPrescriptions(params?: {
    where?: Prisma.PrescriptionWhereInput;
  }): Promise<number> {
    return this.db.prescription.count(params);
  }

  async softDeletePrescription(params: {
    where: Prisma.PrescriptionWhereUniqueInput;
  }): Promise<Prescription> {
    const { where } = params;
    return this.db.prescription.update({
      where,
      data: { isDeleted: true },
    });
  }

  async updatePrescriptionStatus(
    prescriptionId: number,
    status: $Enums.PrescriptionStatus,
  ): Promise<Prescription> {
    return this.db.prescription.update({
      where: { id: prescriptionId },
      data: { status },
    });
  }

  async expireOldPrescriptions(): Promise<number> {
    const result = await this.db.prescription.updateMany({
      where: {
        status: $Enums.PrescriptionStatus.ACTIVE,
        validUntil: { lt: new Date() },
      },
      data: {
        status: $Enums.PrescriptionStatus.EXPIRED,
      },
    });
    return result.count;
  }
}
