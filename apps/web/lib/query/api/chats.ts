import { api } from "@/lib/axios";

export interface Chat {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export async function createChat(title: string) {
  const { data } = await api.post<{ data: Pick<Chat, "id"> }>("/chats", {
    title,
  });
  return data.data;
}

export async function getChats() {
  const { data } = await api.get<{ data: Chat[] }>("/chats");
  return data.data;
}

export async function getChat(id: string) {
  const { data } = await api.get<{ data: Chat }>(`/chats/${id}`);
  return data.data;
}

export async function renameChat(id: string, title: string) {
  const { data } = await api.patch<{ data: Chat }>(`/chats/${id}`, { title });
  return data.data;
}

export async function deleteChat(id: string) {
  const { data } = await api.delete<{ message: string }>(`/chats/${id}`);
  return data;
}