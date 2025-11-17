import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { $Enums, DoctorProfile, Prisma } from '@prisma/client';

@Injectable()
export class DoctorProfileRepository {
  constructor(private db: DatabaseService) {}

  async getAllDoctorProfiles(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.DoctorProfileWhereUniqueInput;
    where?: Prisma.DoctorProfileWhereInput;
    orderBy?: Prisma.DoctorProfileOrderByWithRelationInput;
    select?: Prisma.DoctorProfileSelect;
  }): Promise<DoctorProfile[]> {
    const { skip, take, cursor, where, orderBy, select } = params;

    return this.db.doctorProfile.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createDoctorProfile(params: {
    data: Prisma.DoctorProfileCreateInput;
    select?: Prisma.DoctorProfileSelect;
  }): Promise<DoctorProfile> {
    const { data, select } = params;
    return this.db.doctorProfile.create({ data, select });
  }

  async updateDoctorProfile(params: {
    where: Prisma.DoctorProfileWhereUniqueInput;
    data: Prisma.DoctorProfileUpdateInput;
    select?: Prisma.DoctorProfileSelect;
  }): Promise<DoctorProfile> {
    const { where, data, select } = params;
    return this.db.doctorProfile.update({ where, data, select });
  }

  async getDoctorProfileById(params: {
    where: Prisma.DoctorProfileWhereInput;
    select?: Prisma.DoctorProfileSelect;
  }): Promise<DoctorProfile | null> {
    const { where, select } = params;
    return this.db.doctorProfile.findFirst({
      where,
      select,
    });
  }

  async getDoctorProfileByUserId(
    userId: number,
  ): Promise<DoctorProfile | null> {
    return this.db.doctorProfile.findUnique({
      where: { userId },
      include: { user: { include: { profile: true } } },
    });
  }

  async getDoctorProfileByDoctorId(
    doctorId: string,
  ): Promise<DoctorProfile | null> {
    return this.db.doctorProfile.findUnique({
      where: { doctorId },
      include: { user: { include: { profile: true } } },
    });
  }

  async getDoctorProfileByLicenseNumber(
    licenseNumber: string,
  ): Promise<DoctorProfile | null> {
    return this.db.doctorProfile.findUnique({
      where: { licenseNumber },
      include: { user: { include: { profile: true } } },
    });
  }

  async countDoctorProfiles(params?: {
    where?: Prisma.DoctorProfileWhereInput;
  }): Promise<number> {
    return this.db.doctorProfile.count(params);
  }

  async softDeleteDoctorProfile(params: {
    where: Prisma.DoctorProfileWhereUniqueInput;
  }): Promise<DoctorProfile> {
    const { where } = params;
    return this.db.doctorProfile.update({
      where,
      data: { isDeleted: true },
    });
  }

  async getAvailableDoctors(): Promise<object[]> {
    return this.db.doctorProfile.findMany({
      where: {
        isAvailable: true,
        verificationStatus: $Enums.VerificationStatus.VERIFIED,
        isDeleted: false,
      },
      select: {
        user: {
          select: {
            publicId: true,
            email: true,
            username: true,
            phone: true,
            password: true,
            role: true,
            status: true,
            emailVerified: true,
            phoneVerified: true,
            profileCompleted: true,
            isDeleted: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
            profile: {
              select: {
                publicId: true,
                firstName: true,
                lastName: true,
                middleName: true,
                fullName: true,
                dateOfBirth: true,
                gender: true,
                profilePhoto: true,
                address: true,
                city: true,
                state: true,
                country: true,
                zipCode: true,
                emergencyContactName: true,
                emergencyContactPhone: true,
                preferredLanguage: true,
                timezone: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
  }

  async getDoctorsBySpecialization(
    specialization: string,
  ): Promise<DoctorProfile[]> {
    return this.db.doctorProfile.findMany({
      where: {
        specialization: {
          has: specialization,
        },
        isAvailable: true,
        verificationStatus: $Enums.VerificationStatus.VERIFIED,
        isDeleted: false,
      },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });
  }

  async updateDoctorRating(
    doctorId: number,
    rating: number,
    totalReviews: number,
  ): Promise<DoctorProfile> {
    return this.db.doctorProfile.update({
      where: { id: doctorId },
      data: {
        rating,
        totalReviews,
      },
    });
  }

  async verifyDoctor(params: {
    where: Prisma.DoctorProfileWhereUniqueInput;
  }): Promise<DoctorProfile> {
    const { where } = params;
    return this.db.doctorProfile.update({
      where,
      data: {
        verificationStatus: $Enums.VerificationStatus.VERIFIED,
        verifiedAt: new Date(),
      },
    });
  }

  async searchDoctorsByName(searchTerm: string): Promise<DoctorProfile[]> {
    return this.db.doctorProfile.findMany({
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
