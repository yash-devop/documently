import { api } from "@/lib/axios";

export type MessageRole = "USER" | "ASSISTANT";

export interface ChatMessage {
  id: string;
  chatId: string;
  role: MessageRole;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageResult {
  chatMessage: ChatMessage;
  contextString: string;
  llmresponse: string;
}

export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
  error: null;
}

export async function getMessages(chatId: string) {
  const { data } = await api.get<ApiResponse<ChatMessage[]>>(
    `/chats/${chatId}/messages`,
  );
  return data.data;
}

export async function sendMessage(chatId: string, message: string) {
  const { data } = await api.post<ApiResponse<SendMessageResult>>(
    `/chats/${chatId}/messages`,
    { message },
  );
  return data;
}