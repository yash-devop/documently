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

const READY_POLL_MS = 1500;
const READY_TIMEOUT_MS = 90_000;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Blocks until none of the chat's documents are still PROCESSING.
 *
 * Answer generation only retrieves chunks from READY documents, so a message
 * sent while indexing is still running reaches the model with an empty context
 * and comes back as a refusal. Uploading resolves as soon as the job is
 * *enqueued*, so callers that need a grounded answer have to wait this out.
 *
 * Resolves with the last observed document list, whether it settled or the
 * timeout elapsed — a stuck document must not strand the caller forever.
 */
export async function waitForDocumentsReady(
  chatId: string,
  options: {
    timeoutMs?: number;
    onPendingChange?: (pending: number) => void;
  } = {},
): Promise<ChatDocument[]> {
  const { timeoutMs = READY_TIMEOUT_MS, onPendingChange } = options;
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    const documents = await getDocuments(chatId);
    const pending = documents.filter(
      (doc) => doc.status === "PROCESSING",
    ).length;

    onPendingChange?.(pending);

    if (pending === 0 || Date.now() >= deadline) return documents;
    await sleep(READY_POLL_MS);
  }
}

export async function getAllDocuments() {
  const { data } =
    await api.get<DocumentApiResponse<ChatDocument[]>>("/documents");
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

export async function detachDocument(chatId: string, documentId: string) {
  const { data } = await api.delete<DocumentApiResponse<{ id: string }>>(
    `/chats/${chatId}/documents/${documentId}/detach`,
  );
  return data;
}

export async function downloadDocument(chatId: string, documentId: string) {
  const { data } = await api.post<DocumentApiResponse<{ url: string }>>(
    `/chats/${chatId}/documents/${documentId}/download`,
  );
  return data;
}
