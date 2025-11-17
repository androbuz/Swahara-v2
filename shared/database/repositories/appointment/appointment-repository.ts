import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { $Enums, Appointment, Prisma } from '@prisma/client';

@Injectable()
export class AppointmentRepository {
  constructor(private db: DatabaseService) {}

  async getAllAppointments(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AppointmentWhereUniqueInput;
    where?: Prisma.AppointmentWhereInput;
    orderBy?: Prisma.AppointmentOrderByWithRelationInput;
    select?: Prisma.AppointmentSelect;
  }): Promise<Appointment[]> {
    const { skip, take, cursor, where, orderBy, select } = params;

    return this.db.appointment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createAppointment(params: {
    data: Prisma.AppointmentCreateInput;
    select?: Prisma.AppointmentSelect;
  }): Promise<Appointment> {
    const { data, select } = params;
    return this.db.appointment.create({ data, select });
  }

  async updateAppointment(params: {
    where: Prisma.AppointmentWhereUniqueInput;
    data: Prisma.AppointmentUpdateInput;
    select?: Prisma.AppointmentSelect;
  }): Promise<Appointment> {
    const { where, data, select } = params;
    return this.db.appointment.update({ where, data, select });
  }

  async getAppointmentById(params: {
    where: Prisma.AppointmentWhereUniqueInput;
    select?: Prisma.AppointmentSelect;
    include?: Prisma.AppointmentInclude;
  }): Promise<Appointment | null> {
    const { where, select } = params;
    return this.db.appointment.findUnique({ where, select });
  }

  async getAppointmentByPublicId(
    publicId: string,
  ): Promise<Appointment | null> {
    return this.db.appointment.findUnique({
      where: { publicId },
      include: {
        patient: { include: { profile: true } },
        doctor: { include: { profile: true } },
        MedicalRecord: true,
        Consultation: true,
      },
    });
  }

  async getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
    return this.db.appointment.findMany({
      where: {
        patientId,
        isDeleted: false,
      },
      include: {
        doctor: { include: { profile: true } },
        MedicalRecord: true,
        Consultation: true,
      },
      orderBy: { appointmentDateTime: 'desc' },
    });
  }

  async getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]> {
    return this.db.appointment.findMany({
      where: {
        doctorId,
        isDeleted: false,
      },
      include: {
        patient: { include: { profile: true } },
        MedicalRecord: true,
        Consultation: true,
      },
      orderBy: { appointmentDateTime: 'desc' },
    });
  }

  async getDoctorAppointmentsByDate(
    doctorId: number,
    date: Date,
  ): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.db.appointment.findMany({
      where: {
        doctorId,
        appointmentDateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: $Enums.AppointmentStatus.CANCELLED,
        },
        isDeleted: false,
      },
      include: {
        patient: { include: { profile: true } },
      },
      orderBy: { appointmentDateTime: 'asc' },
    });
  }

  async countAppointments(params?: {
    where?: Prisma.AppointmentWhereInput;
  }): Promise<number> {
    return this.db.appointment.count(params);
  }

  async softDeleteAppointment(params: {
    where: Prisma.AppointmentWhereUniqueInput;
  }): Promise<Appointment> {
    const { where } = params;
    return this.db.appointment.update({
      where,
      data: { isDeleted: true },
    });
  }

  async updateAppointmentStatus(
    appointmentId: number,
    status: $Enums.AppointmentStatus,
  ): Promise<Appointment> {
    return this.db.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });
  }

  async getUpcomingAppointments(
    userId: number,
    isDoctor: boolean,
  ): Promise<Appointment[]> {
    const whereClause = isDoctor ? { doctorId: userId } : { patientId: userId };

    return this.db.appointment.findMany({
      where: {
        ...whereClause,
        appointmentDateTime: { gte: new Date() },
        status: {
          in: [
            $Enums.AppointmentStatus.SCHEDULED,
            $Enums.AppointmentStatus.CONFIRMED,
          ],
        },
        isDeleted: false,
      },
      include: {
        patient: { include: { profile: true } },
        doctor: { include: { profile: true } },
      },
      orderBy: { appointmentDateTime: 'asc' },
      take: 10,
    });
  }

  async markReminderSent(appointmentId: number): Promise<Appointment> {
    return this.db.appointment.update({
      where: { id: appointmentId },
      data: { reminderSent: true },
    });
  }

  async checkTimeSlotAvailability(
    doctorId: number,
    appointmentDateTime: Date,
    duration: number = 30,
    excludeAppointmentId?: number,
  ): Promise<boolean> {
    const appointmentStart = new Date(appointmentDateTime);
    const appointmentEnd = new Date(
      appointmentStart.getTime() + duration * 60000,
    );

    const startOfDay = new Date(appointmentStart);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(appointmentStart);
    endOfDay.setHours(23, 59, 59, 999);

    const conflictingAppointments = await this.db.appointment.findMany({
      where: {
        doctorId,
        isDeleted: false,
        status: {
          not: $Enums.AppointmentStatus.CANCELLED,
        },
        appointmentDateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ...(excludeAppointmentId && { id: { not: excludeAppointmentId } }),
      },
      select: {
        id: true,
        appointmentDateTime: true,
        duration: true,
      },
    });

    for (const existing of conflictingAppointments) {
      const existingStart = new Date(existing.appointmentDateTime);
      const existingEnd = new Date(
        existingStart.getTime() + (existing.duration || 30) * 60000,
      );

      if (appointmentStart < existingEnd && appointmentEnd > existingStart) {
        return false;
      }
    }

    return true;
  }

  async getDoctorSuggestedSlots(
    doctorId: number,
    preferredDate: Date,
    duration: number = 30,
    daysToSearch: number = 7,
  ): Promise<Array<{ date: Date; time: string }>> {
    const suggestions: Array<{ date: Date; time: string }> = [];
    const workingHours = {
      start: Number(process.env.WORK_HOURS_START) || 8,
      end: Number(process.env.WORK_HOURS_END) || 17,
    };

    for (let day = 0; day < daysToSearch; day++) {
      const currentDate = new Date(preferredDate);
      currentDate.setDate(currentDate.getDate() + day);

      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        continue;
      }

      for (let hour = workingHours.start; hour < workingHours.end; hour++) {
        for (let minute = 0; minute < 60; minute += duration) {
          const slotDateTime = new Date(currentDate);
          slotDateTime.setHours(hour, minute, 0, 0);

          if (slotDateTime <= new Date()) {
            continue;
          }

          const isAvailable = await this.checkTimeSlotAvailability(
            doctorId,
            slotDateTime,
            duration,
          );

          if (isAvailable) {
            suggestions.push({
              date: slotDateTime,
              time: slotDateTime.toTimeString().slice(0, 5),
            });

            if (
              suggestions.filter(
                (s) => s.date.toDateString() === currentDate.toDateString(),
              ).length >= 3
            )
              break;
          }
        }

        if (
          suggestions.filter(
            (s) => s.date.toDateString() === currentDate.toDateString(),
          ).length >= 3
        )
          break;
      }

      if (suggestions.length >= 10) break;
    }

    return suggestions.slice(0, 10);
  }
}
