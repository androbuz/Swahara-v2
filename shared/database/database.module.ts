import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './service/database.service';
import { UserRepository } from './repositories/user/user.repository';
import { UserProfileRepository } from './repositories/user-profile/user-profile.repository';
import { PatientProfileRepository } from './repositories/patient-profile/patient-profile.repository';
import { DoctorProfileRepository } from './repositories/doctor-profile/doctor-profile.repository';
import { EmailTemplateRepository } from './repositories/email-template/email-template.repository';
import { SmsTemplateRepository } from './repositories/sms-template/sms-template.repository';
import { OTPRepository } from './repositories/otp/otp.repository';
import { InviteRepository } from './repositories/invite/invite-repository';
import { AppointmentRepository } from './repositories/appointment/appointment-repository';
import { MedicalRecordRepository } from './repositories/medical-record/medical-record-repository';
import { ConsultationRepository } from './repositories/consultation/consultation-repository';
import { PrescriptionRepository } from './repositories/prescription/prescription-repository';
import { MedicationRepository } from './repositories/medication/medication-repository';
import { PrescriptionMedicationRepository } from './repositories/prescription-medication/prescription-medication-repository';
import { AnalyticsRepository } from './repositories/analytics/analytics-repository';
import { RolesRepository } from './repositories/roles/roles-repository';

@Global()
@Module({
  providers: [
    DatabaseService,
    UserRepository,
    UserProfileRepository,
    PatientProfileRepository,
    DoctorProfileRepository,
    EmailTemplateRepository,
    SmsTemplateRepository,
    OTPRepository,
    InviteRepository,
    AppointmentRepository,
    MedicalRecordRepository,
    ConsultationRepository,
    PrescriptionRepository,
    MedicationRepository,
    PrescriptionMedicationRepository,
    AnalyticsRepository,
    RolesRepository,
  ],
  exports: [
    DatabaseService,
    UserRepository,
    UserProfileRepository,
    PatientProfileRepository,
    DoctorProfileRepository,
    EmailTemplateRepository,
    SmsTemplateRepository,
    OTPRepository,
    InviteRepository,
    AppointmentRepository,
    MedicalRecordRepository,
    ConsultationRepository,
    PrescriptionRepository,
    PrescriptionMedicationRepository,
    AnalyticsRepository,
    RolesRepository,
  ],
})
export class DatabaseModule {}
