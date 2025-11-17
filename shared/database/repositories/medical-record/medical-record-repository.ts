import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { MedicalRecord, Prisma } from '@prisma/client';

@Injectable()
export class MedicalRecordRepository {
  constructor(private db: DatabaseService) {}

  async getAllMedicalRecords(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MedicalRecordWhereUniqueInput;
    where?: Prisma.MedicalRecordWhereInput;
    orderBy?: Prisma.MedicalRecordOrderByWithRelationInput;
    select?: Prisma.MedicalRecordSelect;
  }): Promise<MedicalRecord[]> {
    const { skip, take, cursor, where, orderBy, select } = params;

    return this.db.medicalRecord.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createMedicalRecord(params: {
    data: Prisma.MedicalRecordCreateInput;
    select?: Prisma.MedicalRecordSelect;
  }): Promise<MedicalRecord> {
    const { data, select } = params;
    return this.db.medicalRecord.create({ data, select });
  }

  async updateMedicalRecord(params: {
    where: Prisma.MedicalRecordWhereUniqueInput;
    data: Prisma.MedicalRecordUpdateInput;
    select?: Prisma.MedicalRecordSelect;
  }): Promise<MedicalRecord> {
    const { where, data, select } = params;
    return this.db.medicalRecord.update({ where, data, select });
  }

  async getMedicalRecordById(params: {
    where: Prisma.MedicalRecordWhereUniqueInput;
    select?: Prisma.MedicalRecordSelect;
  }): Promise<MedicalRecord | null> {
    const { where, select } = params;
    return this.db.medicalRecord.findUnique({ where, select });
  }

  async getMedicalRecordByPublicId(
    publicId: string,
  ): Promise<MedicalRecord | null> {
    return this.db.medicalRecord.findUnique({
      where: { publicId },
      include: {
        patient: { include: { profile: true } },
        doctor: { include: { profile: true } },
        appointment: true,
      },
    });
  }

  async getMedicalRecordsByPatient(
    patientId: number,
  ): Promise<MedicalRecord[]> {
    return this.db.medicalRecord.findMany({
      where: {
        patientId,
        isDeleted: false,
      },
      include: {
        doctor: { include: { profile: true } },
        appointment: true,
      },
      orderBy: { visitDate: 'desc' },
    });
  }

  async getMedicalRecordsByDoctor(doctorId: number): Promise<MedicalRecord[]> {
    return this.db.medicalRecord.findMany({
      where: {
        doctorId,
        isDeleted: false,
      },
      include: {
        patient: { include: { profile: true } },
        appointment: true,
      },
      orderBy: { visitDate: 'desc' },
    });
  }

  async getMedicalRecordByAppointment(
    appointmentId: number,
  ): Promise<MedicalRecord | null> {
    return this.db.medicalRecord.findUnique({
      where: { appointmentId },
      include: {
        patient: { include: { profile: true } },
        doctor: { include: { profile: true } },
        appointment: true,
      },
    });
  }

  async getPatientMedicalHistory(
    patientId: number,
    params?: {
      skip?: number;
      take?: number;
      fromDate?: Date;
      toDate?: Date;
    },
  ): Promise<MedicalRecord[]> {
    const { skip, take, fromDate, toDate } = params || {};

    const whereClause: Prisma.MedicalRecordWhereInput = {
      patientId,
      isDeleted: false,
    };

    if (fromDate || toDate) {
      whereClause.visitDate = {};
      if (fromDate) whereClause.visitDate.gte = fromDate;
      if (toDate) whereClause.visitDate.lte = toDate;
    }

    return this.db.medicalRecord.findMany({
      skip,
      take,
      where: whereClause,
      include: {
        doctor: { include: { profile: true } },
        appointment: true,
      },
      orderBy: { visitDate: 'desc' },
    });
  }

  async countMedicalRecords(params?: {
    where?: Prisma.MedicalRecordWhereInput;
  }): Promise<number> {
    return this.db.medicalRecord.count(params);
  }

  async softDeleteMedicalRecord(params: {
    where: Prisma.MedicalRecordWhereUniqueInput;
  }): Promise<MedicalRecord> {
    const { where } = params;
    return this.db.medicalRecord.update({
      where,
      data: { isDeleted: true },
    });
  }

  async getConfidentialRecords(patientId: number): Promise<MedicalRecord[]> {
    return this.db.medicalRecord.findMany({
      where: {
        patientId,
        isConfidential: true,
        isDeleted: false,
      },
      include: {
        doctor: { include: { profile: true } },
        appointment: true,
      },
      orderBy: { visitDate: 'desc' },
    });
  }

  async addAttachments(
    medicalRecordId: number,
    attachmentUrls: string[],
  ): Promise<MedicalRecord> {
    const record = await this.db.medicalRecord.findUnique({
      where: { id: medicalRecordId },
      select: { attachments: true },
    });

    const updatedAttachments = [
      ...(record?.attachments || []),
      ...attachmentUrls,
    ];

    return this.db.medicalRecord.update({
      where: { id: medicalRecordId },
      data: { attachments: updatedAttachments },
    });
  }
}
