import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { EmailTemplate, EmailType, Prisma } from '@prisma/client';

@Injectable()
export class EmailTemplateRepository {
  constructor(private db: DatabaseService) {}

  async getAllEmailTemplates(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EmailTemplateWhereUniqueInput;
    where?: Prisma.EmailTemplateWhereInput;
    orderBy?: Prisma.EmailTemplateOrderByWithRelationInput;
    select?: Prisma.EmailTemplateSelect;
  }): Promise<EmailTemplate[]> {
    const { skip, take, cursor, where, orderBy, select } = params;

    return this.db.emailTemplate.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createEmailTemplate(params: {
    data: Prisma.EmailTemplateCreateInput;
    select?: Prisma.EmailTemplateSelect;
  }): Promise<EmailTemplate> {
    const { data, select } = params;
    return this.db.emailTemplate.create({ data, select });
  }

  async updateEmailTemplate(params: {
    where: Prisma.EmailTemplateWhereUniqueInput;
    data: Prisma.EmailTemplateUpdateInput;
    select?: Prisma.EmailTemplateSelect;
  }): Promise<EmailTemplate> {
    const { where, data, select } = params;
    return this.db.emailTemplate.update({ where, data, select });
  }

  async deleteEmailTemplate(params: {
    where: Prisma.EmailTemplateWhereUniqueInput;
  }): Promise<EmailTemplate> {
    const { where } = params;
    return this.db.emailTemplate.delete({ where });
  }

  async getEmailTemplateById(params: {
    where: Prisma.EmailTemplateWhereUniqueInput;
    select?: Prisma.EmailTemplateSelect;
  }): Promise<EmailTemplate | null> {
    const { where, select } = params;
    return this.db.emailTemplate.findUnique({ where, select });
  }

  async getEmailTemplateByPublicId(
    publicId: string,
  ): Promise<EmailTemplate | null> {
    return this.db.emailTemplate.findUnique({
      where: { publicId },
    });
  }

  async getEmailTemplateByType(
    emailType: EmailType,
  ): Promise<EmailTemplate | null> {
    return this.db.emailTemplate.findUnique({
      where: { emailType },
    });
  }

  async getActiveEmailTemplates(): Promise<EmailTemplate[]> {
    return this.db.emailTemplate.findMany({
      where: { isActive: true },
      orderBy: { emailType: 'asc' },
    });
  }

  async getEmailTemplatesByCreator(
    createdBy: number,
  ): Promise<EmailTemplate[]> {
    return this.db.emailTemplate.findMany({
      where: { createdBy },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countEmailTemplates(params?: {
    where?: Prisma.EmailTemplateWhereInput;
  }): Promise<number> {
    return this.db.emailTemplate.count(params);
  }

  async deactivateEmailTemplate(params: {
    where: Prisma.EmailTemplateWhereUniqueInput;
  }): Promise<EmailTemplate> {
    const { where } = params;
    return this.db.emailTemplate.update({
      where,
      data: { isActive: false },
    });
  }

  async activateEmailTemplate(params: {
    where: Prisma.EmailTemplateWhereUniqueInput;
  }): Promise<EmailTemplate> {
    const { where } = params;
    return this.db.emailTemplate.update({
      where,
      data: { isActive: true },
    });
  }

  async searchEmailTemplates(searchTerm: string): Promise<EmailTemplate[]> {
    return this.db.emailTemplate.findMany({
      where: {
        OR: [
          { subject: { contains: searchTerm, mode: 'insensitive' } },
          { body: { contains: searchTerm, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
