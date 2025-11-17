import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { $Enums, Consultation, Prisma } from '@prisma/client';

@Injectable()
export class ConsultationRepository {
  constructor(private db: DatabaseService) {}

  async getAllConsultations(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ConsultationWhereUniqueInput;
    where?: Prisma.ConsultationWhereInput;
    orderBy?: Prisma.ConsultationOrderByWithRelationInput;
    select?: Prisma.ConsultationSelect;
  }): Promise<Consultation[]> {
    const { skip, take, cursor, where, orderBy, select } = params;

    return this.db.consultation.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createConsultation(params: {
    data: Prisma.ConsultationCreateInput;
    select?: Prisma.ConsultationSelect;
  }): Promise<Consultation> {
    const { data, select } = params;
    return this.db.consultation.create({ data, select });
  }

  async updateConsultation(params: {
    where: Prisma.ConsultationWhereUniqueInput;
    data: Prisma.ConsultationUpdateInput;
    select?: Prisma.ConsultationSelect;
  }): Promise<Consultation> {
    const { where, data, select } = params;
    return this.db.consultation.update({ where, data, select });
  }

  async getConsultationById(params: {
    where: Prisma.ConsultationWhereUniqueInput;
    select?: Prisma.ConsultationSelect;
  }): Promise<Consultation | null> {
    const { where, select } = params;
    return this.db.consultation.findUnique({ where, select });
  }

  async getConsultationByPublicId(
    publicId: string,
  ): Promise<Consultation | null> {
    return this.db.consultation.findUnique({
      where: { publicId },
      include: {
        patient: { include: { profile: true } },
        doctor: { include: { profile: true } },
        appointment: true,
      },
    });
  }

  async getConsultationByAppointment(
    appointmentId: number,
  ): Promise<Consultation | null> {
    return this.db.consultation.findUnique({
      where: { appointmentId },
      include: {
        patient: { include: { profile: true } },
        doctor: { include: { profile: true } },
        appointment: true,
      },
    });
  }

  async getConsultationsByPatient(patientId: number): Promise<Consultation[]> {
    return this.db.consultation.findMany({
      where: {
        patientId,
        isDeleted: false,
      },
      include: {
        doctor: { include: { profile: true } },
        appointment: true,
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async getConsultationsByDoctor(doctorId: number): Promise<Consultation[]> {
    return this.db.consultation.findMany({
      where: {
        doctorId,
        isDeleted: false,
      },
      include: {
        patient: { include: { profile: true } },
        appointment: true,
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async countConsultations(params?: {
    where?: Prisma.ConsultationWhereInput;
  }): Promise<number> {
    return this.db.consultation.count(params);
  }

  async softDeleteConsultation(params: {
    where: Prisma.ConsultationWhereUniqueInput;
  }): Promise<Consultation> {
    const { where } = params;
    return this.db.consultation.update({
      where,
      data: { isDeleted: true },
    });
  }

  async updateConsultationStatus(
    consultationId: number,
    status: $Enums.ConsultationStatus,
  ): Promise<Consultation> {
    return this.db.consultation.update({
      where: { id: consultationId },
      data: { status },
    });
  }

  async startConsultation(consultationId: number): Promise<Consultation> {
    return this.db.consultation.update({
      where: { id: consultationId },
      data: {
        status: $Enums.ConsultationStatus.IN_PROGRESS,
        startTime: new Date(),
      },
    });
  }

  async endConsultation(
    consultationId: number,
    endData: {
      notes?: string;
      diagnosis?: string[];
      treatmentPlan?: string;
      followUpRequired?: boolean;
      followUpDate?: Date;
      duration?: number;
    },
  ): Promise<Consultation> {
    return this.db.consultation.update({
      where: { id: consultationId },
      data: {
        ...endData,
        status: $Enums.ConsultationStatus.COMPLETED,
        endTime: new Date(),
      },
    });
  }

  async getActiveConsultations(doctorId?: number): Promise<Consultation[]> {
    const whereClause: Prisma.ConsultationWhereInput = {
      status: $Enums.ConsultationStatus.IN_PROGRESS,
      isDeleted: false,
    };

    if (doctorId) {
      whereClause.doctorId = doctorId;
    }

    return this.db.consultation.findMany({
      where: whereClause,
      include: {
        patient: { include: { profile: true } },
        doctor: { include: { profile: true } },
        appointment: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async getScheduledConsultations(doctorId?: number): Promise<Consultation[]> {
    const whereClause: Prisma.ConsultationWhereInput = {
      status: $Enums.ConsultationStatus.SCHEDULED,
      startTime: { gte: new Date() },
      isDeleted: false,
    };

    if (doctorId) {
      whereClause.doctorId = doctorId;
    }

    return this.db.consultation.findMany({
      where: whereClause,
      include: {
        patient: { include: { profile: true } },
        doctor: { include: { profile: true } },
        appointment: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async updateRecordingUrl(
    consultationId: number,
    recordingUrl: string,
  ): Promise<Consultation> {
    return this.db.consultation.update({
      where: { id: consultationId },
      data: { recordingUrl },
    });
  }
}
