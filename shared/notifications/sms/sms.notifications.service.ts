import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SMSType } from '@prisma/client';
import { SmsTemplateRepository } from '../../database/repositories/sms-template/sms-template.repository';
import AfricasTalking from 'africastalking';

@Injectable()
export class SmsNotificationsService {
  constructor(private smsTemplateRepository: SmsTemplateRepository) {}

  async sendSMS(
    smsRecipient: string,
    smsDetails: {
      emailTemplateName: SMSType;
      emailParams: Record<string, string>;
    },
  ): Promise<void> {
    try {
      const smsTemplate = await this.ProcessSMSTemplate(
        smsDetails.emailTemplateName,
        smsDetails.emailParams,
      );

      await this.SendMessage(smsRecipient, smsTemplate.body);
    } catch {
      throw new BadGatewayException(
        `Error sending sms:${smsDetails.emailTemplateName} to ${smsRecipient}`,
      );
    }
  }

  ProcessSMSTemplate = async (
    templateType: SMSType,
    params: Record<string, string>,
  ) => {
    try {
      const template =
        await this.smsTemplateRepository.getSmsTemplateByCriteria({
          where: { smsType: templateType },
        });

      if (!template) {
        throw new NotFoundException(
          `Template with template type ${templateType} not found`,
        );
      }

      const missingSmsParams = Object.keys(template.smsParams as object).filter(
        (param) => !Object.prototype.hasOwnProperty.call(params, param),
      );

      if (missingSmsParams.length > 0) {
        throw new BadRequestException(
          `Missing parameters: ${missingSmsParams.join(', ')}`,
        );
      }

      let body = template.body;

      Object.entries(params).forEach(([key, value]) => {
        body = body.replace(new RegExp(`{${key}}`, 'g'), value);
      });

      return { body: body, subject: template.subject };
    } catch {
      throw new BadGatewayException('Error sending sms');
    }
  };

  async SendMessage(phoneNumber: string, message: string) {
    const result = await AfricasTalking({
      apiKey: String(process.env.AFRICAS_TALKING_API_KEY),
      username: String(process.env.AFRICAS_TALKING_API_USERNAME),
    }).SMS.send({
      to: phoneNumber,
      message,
      from: String(process.env.AFRICAS_TALKING_API_ALPHANUMERIC),
    });

    return result['SMSMessageData']['Recipients'];
  }
}
