export interface IEmailService {
  sendOtpEmail(email: string, otp: string): Promise<void>;
  resendOtpEmail(email: string, otp: string): Promise<void>;
  sendMechanicInvitation(email: string, password: string, name: string): Promise<void>;
  sendGarageApprovalEmail(email: string, garageName: string): Promise<void>;
  sendGarageRejectionEmail(email: string, garageName: string, reason:string): Promise<void>;
}
