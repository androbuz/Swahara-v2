import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { Prisma, SMSTemplate, SMSType } from '@prisma/client';

@Injectable()
export class SmsTemplateRepository {
  constructor(private db: DatabaseService) {}

  async getAllSmsTemplates(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SMSTemplateWhereUniqueInput;
    where?: Prisma.SMSTemplateWhereInput;
    orderBy?: Prisma.SMSTemplateOrderByWithRelationInput;
    select?: Prisma.SMSTemplateSelect;
  }): Promise<SMSTemplate[]> {
    const { skip, take, cursor, where, orderBy, select } = params;

    return this.db.sMSTemplate.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createSmsTemplate(params: {
    data: Prisma.SMSTemplateCreateInput;
    select?: Prisma.SMSTemplateSelect;
  }): Promise<SMSTemplate> {
    const { data, select } = params;
    return this.db.sMSTemplate.create({ data, select });
  }

  async updateSmsTemplate(params: {
    where: Prisma.SMSTemplateWhereUniqueInput;
    data: Prisma.SMSTemplateUpdateInput;
    select?: Prisma.SMSTemplateSelect;
  }): Promise<SMSTemplate> {
    const { where, data, select } = params;
    return this.db.sMSTemplate.update({ where, data, select });
  }

  async deleteSmsTemplate(params: {
    where: Prisma.SMSTemplateWhereUniqueInput;
  }): Promise<SMSTemplate> {
    const { where } = params;
    return this.db.sMSTemplate.delete({ where });
  }

  async getSmsTemplateByCriteria(params: {
    where: Prisma.SMSTemplateWhereUniqueInput;
    select?: Prisma.SMSTemplateSelect;
  }): Promise<SMSTemplate | null> {
    const { where, select } = params;
    return this.db.sMSTemplate.findUnique({ where, select });
  }

  async getSmsTemplateByPublicId(
    publicId: string,
  ): Promise<SMSTemplate | null> {
    return this.db.sMSTemplate.findUnique({
      where: { publicId },
    });
  }

  async getSmsTemplateByType(smsType: SMSType): Promise<SMSTemplate | null> {
    return this.db.sMSTemplate.findUnique({
      where: { smsType },
    });
  }

  async getActiveSmsTemplates(): Promise<SMSTemplate[]> {
    return this.db.sMSTemplate.findMany({
      where: { isActive: true },
      orderBy: { smsType: 'asc' },
    });
  }

  async getSmsTemplatesByCreator(createdBy: number): Promise<SMSTemplate[]> {
    return this.db.sMSTemplate.findMany({
      where: { createdBy },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countSmsTemplates(params?: {
    where?: Prisma.SMSTemplateWhereInput;
  }): Promise<number> {
    return this.db.sMSTemplate.count(params);
  }

  async deactivateSmsTemplate(params: {
    where: Prisma.SMSTemplateWhereUniqueInput;
  }): Promise<SMSTemplate> {
    const { where } = params;
    return this.db.sMSTemplate.update({
      where,
      data: { isActive: false },
    });
  }

  async activateSmsTemplate(params: {
    where: Prisma.SMSTemplateWhereUniqueInput;
  }): Promise<SMSTemplate> {
    const { where } = params;
    return this.db.sMSTemplate.update({
      where,
      data: { isActive: true },
    });
  }

  async searchSmsTemplates(searchTerm: string): Promise<SMSTemplate[]> {
    return this.db.sMSTemplate.findMany({
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

  async validateSmsLength(
    templateId: number,
  ): Promise<{ isValid: boolean; length: number }> {
    const template = await this.db.sMSTemplate.findUnique({
      where: { id: templateId },
      select: { body: true },
    });

    if (!template) {
      throw new Error('SMS template not found');
    }

    const length = template.body.length;
    return {
      isValid: length <= Number(process.env.STANDARD_SMS_LENGTH),
      length,
    };
  }
}
