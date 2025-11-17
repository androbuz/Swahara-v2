import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { DatabaseService } from '../../../database/service/database.service';
import { EmailType } from '@prisma/client';
import { Resend } from 'resend';
import { AppConfigService } from '../../../config/service/app-config.service';

@Injectable()
export class EmailNotificationsService {
  constructor(
    @Inject('RESEND') private resend: Resend,
    private dbService: DatabaseService,
    private appConfig: AppConfigService,
  ) {}

  async sendEmail(
    emailRecipient: string,
    emailDetails: {
      emailTemplateName: EmailType;
      emailParams: Record<string, string>;
    },
  ): Promise<void> {
    try {
      const template = await this.processTemplate(
        emailDetails.emailTemplateName,
        emailDetails.emailParams,
      );

      const { error } = await this.resend.emails.send({
        from: `MyDoctor <${this.appConfig.emailFrom}>`,
        to: emailRecipient,
        subject: template.subject,
        html: template.body,
        text: this.stripHtml(template.body),
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch {
      throw new BadGatewayException(
        `Error sending email:${emailDetails.emailTemplateName} to ${emailRecipient}`,
      );
    }
  }

  processTemplate = async (
    templateType: EmailType,
    params: Record<string, string>,
  ) => {
    try {
      const template = await this.dbService.emailTemplate.findUnique({
        where: { emailType: templateType },
      });

      if (!template) {
        throw new NotFoundException(
          `Template with template type ${templateType} not found`,
        );
      }

      const missingParams = Object.keys(template.emailParams as object).filter(
        (param) => !Object.prototype.hasOwnProperty.call(params, param),
      );

      if (missingParams.length > 0) {
        throw new BadRequestException(
          `Missing parameters: ${missingParams.join(', ')}`,
        );
      }

      let body = template.body;
      let subject = template.subject;

      Object.entries(params).forEach(([key, value]) => {
        body = body.replace(new RegExp(`{${key}}`, 'g'), value);
        subject = subject.replace(new RegExp(`{${key}}`, 'g'), value);
      });

      return { body: body, subject: subject };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error processing email template');
    }
  };

  private stripHtml(html: string): string {
    if (!html) return '';

    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }
}
