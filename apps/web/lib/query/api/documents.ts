import { api } from "@/lib/axios";

export type DocumentStatus = "PROCESSING" | "READY" | "FAILED";

export interface ChatDocument {
  id: string;
  userId: string;
  mimeType: string;
  originalName: string;
  storageKey: string;
  size: number;
  status: DocumentStatus;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadedDocument {
  id: string;
  originalName: string;
  status: DocumentStatus;
}

export interface DocumentApiResponse<T> {
  status: number;
  data: T;
  message: string;
  error: null;
}

export async function uploadDocuments(chatId: string, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const { data } = await api.post<DocumentApiResponse<UploadedDocument[]>>(
    `/chats/${chatId}/documents`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function getDocuments(chatId: string) {
  const { data } = await api.get<DocumentApiResponse<ChatDocument[]>>(
    `/chats/${chatId}/documents`,
  );
  return data.data;
}

export async function getAllDocuments() {
  const { data } = await api.get<DocumentApiResponse<ChatDocument[]>>(
    "/documents",
  );
  return data.data;
}

export async function getDocument(chatId: string, documentId: string) {
  const { data } = await api.get<DocumentApiResponse<ChatDocument>>(
    `/chats/${chatId}/documents/${documentId}`,
  );
  return data.data;
}

export async function attachDocument(chatId: string, documentId: string) {
  const { data } = await api.post<DocumentApiResponse<ChatDocument>>(
    `/chats/${chatId}/documents/attach`,
    { documentId },
  );
  return data;
}

export async function deleteDocument(chatId: string, documentId: string) {
  const { data } = await api.delete<DocumentApiResponse<{ id: string }>>(
    `/chats/${chatId}/documents/${documentId}`,
  );
  return data;
}

export async function downloadDocument(chatId: string, documentId: string) {
  const { data } = await api.post<DocumentApiResponse<{ url: string }>>(
    `/chats/${chatId}/documents/${documentId}/download`,
  );
  return data;
}