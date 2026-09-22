import { api } from "@/lib/axios";

export interface Chat {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
  error: null;
}

export async function createChat(title: string) {
  const { data } = await api.post<ApiResponse<Pick<Chat, "id">>>("/chats", {
    title,
  });
  return data.data;
}

export async function getChats() {
  const { data } = await api.get<ApiResponse<Chat[]>>("/chats");
  return data.data;
}

export async function getChat(id: string) {
  const { data } = await api.get<ApiResponse<Chat>>(`/chats/${id}`);
  return data.data;
}

export async function renameChat(id: string, title: string) {
  const { data } = await api.patch<ApiResponse<Chat>>(`/chats/${id}`, {
    title,
  });
  return data.data;
}

export async function deleteChat(id: string) {
  const { data } = await api.delete<ApiResponse<Chat>>(`/chats/${id}`);
  return data;
}