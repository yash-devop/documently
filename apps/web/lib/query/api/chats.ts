import { api } from "../../axios";

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