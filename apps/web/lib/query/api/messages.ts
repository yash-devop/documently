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

export async function getMessages(chatId: string) {
  const { data } = await api.get<{ data: ChatMessage[] }>(
    `/chats/${chatId}/messages`,
  );
  return data.data;
}

export async function sendMessage(chatId: string, message: string) {
  const { data } = await api.post<{ data: ChatMessage }>(
    `/chats/${chatId}/messages`,
    { message },
  );
  return data.data;
}