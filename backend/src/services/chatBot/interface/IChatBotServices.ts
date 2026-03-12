export interface IChatBotService {
    chatWithBot(message:string): Promise<string>
}