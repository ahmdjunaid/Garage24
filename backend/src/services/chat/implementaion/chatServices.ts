import { inject, injectable } from "inversify";
import { ChatDocument } from "../../../models/chat";
import { AppointmentDocForChat, AppointmentFilterForChat, IChatDatas } from "../../../types/chat";
import { IChatService } from "../interface/IChatServices";
import { TYPES } from "../../../DI/types";
import { IChatRepository } from "../../../repositories/chat/interface/IChatRepository";
import { IAppointmentRepository } from "../../../repositories/appointment/interface/IAppointmentRepository";
import { IMechanicRepository } from "../../../repositories/mechanic/interface/IMechanicRepository";
import { Types } from "mongoose";
import { AppError } from "../../../middleware/errorHandler";
import HttpStatus from "../../../constants/httpStatusCodes";
import { INVALID_INPUT } from "../../../constants/messages";

@injectable()
export class ChatService implements IChatService {
    constructor(
        @inject(TYPES.ChatRepository) private _chatRepository:IChatRepository,
        @inject(TYPES.AppointmentRepository) private _appointmentRepository: IAppointmentRepository,
        @inject(TYPES.MechanicRepository) private _mechanicRepository: IMechanicRepository,
    ){}

    async sendMessage(data: IChatDatas): Promise<ChatDocument> {
        return await this._chatRepository.sendMessage(data)
    }

    async getParticipants(appointmentId: string): Promise<string[]> {
        return await this._appointmentRepository.getParticipants(appointmentId)
    }

    async getAppointmentsForChat(query: AppointmentFilterForChat): Promise<AppointmentDocForChat[]> {
        const mechanicId = query.mechanicId
        if(mechanicId){
            const mechanic = await this._mechanicRepository.findOneByUserId(mechanicId)
            if(!mechanic) throw new AppError(HttpStatus.BAD_REQUEST, INVALID_INPUT)
            return await this._appointmentRepository.getAppointmentsForChat({mechanicId: mechanic?._id.toString()})
        }

        return await this._appointmentRepository.getAppointmentsForChat(query)
    }

    async getMessages(appointmentId: string): Promise<ChatDocument[]> {
        return await this._chatRepository.getMessages(appointmentId)
    }

    async getAppointmentsForChatById(appointmentId: string): Promise<AppointmentDocForChat | null> {
        return await this._appointmentRepository.getAppointmentsForChatById(appointmentId)
    }
}