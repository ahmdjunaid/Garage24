import { chatModel } from "../../../config/chatBot";
import { IChatBotService } from "../interface/IChatBotServices";

export class ChatBotService implements IChatBotService {
  constructor() {}

  async chatWithBot(message: string): Promise<string> {
    const response = await chatModel.invoke([
      {
        role: "system",
        content: `You are a helpful vehicle service assistant.
            Rules:
                - Answer only about vehicles, car maintenance, repairs, and garage services.
                - If the question is not related to vehicles, say:
                    "I can only help with vehicle and service-related questions."
                - Keep answers short (maximum 3 sentences).
                - Use simple and clear language.`,
      },
      {
        role: "user",
        content: message,
      },
    ]);
    return response.content as string;
  }
}
