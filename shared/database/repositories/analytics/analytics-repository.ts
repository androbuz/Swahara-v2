import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { AppointmentStatus, UserRole } from '@prisma/client';

@Injectable()
export class AnalyticsRepository {
  constructor(private db: DatabaseService) {}

  async getDashboardOverview(startDate?: Date, endDate?: Date) {
    const dateFilter =
      startDate && endDate
        ? { createdAt: { gte: startDate, lte: endDate } }
        : {};

    const [
      totalUsers,
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments,
    ] = await Promise.all([
      this.db.user.count({ where: { isDeleted: false, ...dateFilter } }),
      this.db.user.count({
        where: { role: UserRole.PATIENT, isDeleted: false, ...dateFilter },
      }),
      this.db.user.count({
        where: { role: UserRole.DOCTOR, isDeleted: false, ...dateFilter },
      }),
      this.db.appointment.count({
        where: { isDeleted: false, ...dateFilter },
      }),
      this.db.appointment.count({
        where: {
          isDeleted: false,
          appointmentDateTime: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      this.db.appointment.count({
        where: {
          isDeleted: false,
          status: AppointmentStatus.SCHEDULED,
          ...dateFilter,
        },
      }),
      this.db.appointment.count({
        where: {
          isDeleted: false,
          status: AppointmentStatus.COMPLETED,
          ...dateFilter,
        },
      }),
      this.db.appointment.count({
        where: {
          isDeleted: false,
          status: AppointmentStatus.CANCELLED,
          ...dateFilter,
        },
      }),
    ]);

    return {
      totalUsers,
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments,
    };
  }

  async getAppointmentAnalytics(startDate?: Date, endDate?: Date) {
    const dateFilter =
      startDate && endDate
        ? { appointmentDateTime: { gte: startDate, lte: endDate } }
        : {};

    const appointmentsByStatus = await this.db.appointment.groupBy({
      by: ['status'],
      where: { isDeleted: false, ...dateFilter },
      _count: { status: true },
    });

    const appointmentsByType = await this.db.appointment.groupBy({
      by: ['type'],
      where: { isDeleted: false, ...dateFilter },
      _count: { type: true },
    });

    const appointmentsByPriority = await this.db.appointment.groupBy({
      by: ['priority'],
      where: { isDeleted: false, ...dateFilter },
      _count: { priority: true },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyAppointments = await this.db.appointment.findMany({
      where: {
        isDeleted: false,
        appointmentDateTime: { gte: thirtyDaysAgo },
      },
      select: { appointmentDateTime: true, status: true },
    });

    return {
      appointmentsByStatus: appointmentsByStatus.map((i) => ({
        status: i.status,
        count: i._count.status,
      })),
      appointmentsByType: appointmentsByType.map((i) => ({
        type: i.type,
        count: i._count.type,
      })),
      appointmentsByPriority: appointmentsByPriority.map((i) => ({
        priority: i.priority,
        count: i._count.priority,
      })),
      dailyAppointments,
    };
  }

  async getDoctorPerformance(startDate?: Date, endDate?: Date) {
    const dateFilter =
      startDate && endDate
        ? { createdAt: { gte: startDate, lte: endDate } }
        : {};

    const doctorStats = await this.db.user.findMany({
      where: { role: UserRole.DOCTOR, isDeleted: false, ...dateFilter },
      include: {
        profile: { select: { fullName: true } },
        doctorProfile: {
          select: {
            specialization: true,
            rating: true,
            totalReviews: true,
            verificationStatus: true,
          },
        },
        doctorAppointments: {
          where: {
            isDeleted: false,
            ...(startDate && endDate
              ? { appointmentDateTime: { gte: startDate, lte: endDate } }
              : {}),
          },
          select: { status: true, type: true },
        },
      },
    });

    return doctorStats.map((doctor) => ({
      publicId: doctor.publicId,
      name: doctor.profile?.fullName || 'N/A',
      specialization: doctor.doctorProfile?.specialization || [],
      rating: doctor.doctorProfile?.rating || 0,
      totalReviews: doctor.doctorProfile?.totalReviews || 0,
      verificationStatus: doctor.doctorProfile?.verificationStatus,
      totalAppointments: doctor.doctorAppointments.length,
      completedAppointments: doctor.doctorAppointments.filter(
        (app) => app.status === AppointmentStatus.COMPLETED,
      ).length,
      cancelledAppointments: doctor.doctorAppointments.filter(
        (app) => app.status === AppointmentStatus.CANCELLED,
      ).length,
    }));
  }

  async getPatientDemographics() {
    const patients = await this.db.user.findMany({
      where: { role: UserRole.PATIENT, isDeleted: false },
      include: {
        profile: { select: { dateOfBirth: true, gender: true } },
        patientProfile: { select: { bloodType: true } },
      },
    });

    const currentDate = new Date();
    const ageGroups = {
      '0-17': 0,
      '18-30': 0,
      '31-50': 0,
      '51-70': 0,
      '70+': 0,
    };
    const genderCounts = {
      MALE: 0,
      FEMALE: 0,
      OTHER: 0,
      PREFER_NOT_TO_SAY: 0,
    };
    const bloodTypeCounts: Record<string, number> = {};

    patients.forEach((p) => {
      if (p.profile?.dateOfBirth) {
        const age =
          currentDate.getFullYear() - p.profile.dateOfBirth.getFullYear();
        if (age <= 17) ageGroups['0-17']++;
        else if (age <= 30) ageGroups['18-30']++;
        else if (age <= 50) ageGroups['31-50']++;
        else if (age <= 70) ageGroups['51-70']++;
        else ageGroups['70+']++;
      }
      if (p.profile?.gender) genderCounts[p.profile.gender]++;
      if (p.patientProfile?.bloodType) {
        const bt = p.patientProfile.bloodType;
        bloodTypeCounts[bt] = (bloodTypeCounts[bt] || 0) + 1;
      }
    });

    return {
      ageGroups: Object.entries(ageGroups).map(([group, count]) => ({
        ageGroup: group,
        count,
      })),
      genderDistribution: Object.entries(genderCounts).map(
        ([gender, count]) => ({ gender, count }),
      ),
      bloodTypeDistribution: Object.entries(bloodTypeCounts).map(
        ([bt, count]) => ({ bloodType: bt, count }),
      ),
      totalPatients: patients.length,
    };
  }

  async getRevenueAnalytics(startDate?: Date, endDate?: Date) {
    const dateFilter =
      startDate && endDate
        ? { appointmentDateTime: { gte: startDate, lte: endDate } }
        : {};

    const completedAppointments = await this.db.appointment.findMany({
      where: {
        status: AppointmentStatus.COMPLETED,
        isDeleted: false,
        ...dateFilter,
      },
      include: {
        doctor: {
          include: { doctorProfile: { select: { consultationFee: true } } },
        },
      },
    });

    const totalRevenue = completedAppointments.reduce(
      (sum, a) => sum + (a.doctor.doctorProfile?.consultationFee || 0),
      0,
    );

    const monthlyRevenue = completedAppointments.reduce(
      (acc, a) => {
        const month = a.appointmentDateTime.toISOString().slice(0, 7);
        acc[month] =
          (acc[month] || 0) + (a.doctor.doctorProfile?.consultationFee || 0);
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalRevenue,
      totalCompletedAppointments: completedAppointments.length,
      averageConsultationFee:
        completedAppointments.length > 0
          ? totalRevenue / completedAppointments.length
          : 0,
      monthlyRevenue: Object.entries(monthlyRevenue).map(
        ([month, revenue]) => ({
          month,
          revenue,
        }),
      ),
    };
  }

  async getSystemUsage(startDate?: Date, endDate?: Date) {
    const dateFilter =
      startDate && endDate
        ? { createdAt: { gte: startDate, lte: endDate } }
        : {};

    const [
      newUsersCount,
      activeUsers,
      newAppointmentsCount,
      verificationStats,
    ] = await Promise.all([
      this.db.user.count({ where: { isDeleted: false, ...dateFilter } }),
      this.db.user.count({
        where: {
          isDeleted: false,
          lastLoginAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.db.appointment.count({
        where: { isDeleted: false, ...dateFilter },
      }),
      this.db.user.groupBy({
        by: ['emailVerified', 'phoneVerified'],
        where: { isDeleted: false, ...dateFilter },
        _count: true,
      }),
    ]);

    return {
      newUsers: newUsersCount,
      activeUsers,
      newAppointments: newAppointmentsCount,
      verificationStats,
    };
  }
}
