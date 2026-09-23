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

export interface StreamMessageResult {
  chatMessage: ChatMessage;
  assistantMessage: ChatMessage;
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

export async function streamMessage(
  chatId: string,
  userMessage: string,
  onToken: (delta: string) => void,
): Promise<StreamMessageResult> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(
    `${baseUrl}/api/v1/chats/${chatId}/messages/stream`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message: userMessage }),
    },
  );

  if (!response.ok || !response.body) {
    let detail = "Failed to start streaming response";
    try {
      const text = await response.text();
      if (text) detail = text;
    } catch {
      // ignore body read failure
    }
    throw new Error(detail);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: StreamMessageResult | null = null;

  const dispatch = (rawEvent: string) => {
    const lines = rawEvent.split("\n");
    let event = "message";
    let data = "";
    for (const line of lines) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      if (line.startsWith("data:")) data += line.slice(5).trim();
    }
    if (!data) return;

    if (event === "token") {
      const payload = JSON.parse(data) as { text: string };
      onToken(payload.text);
    } else if (event === "done") {
      const payload = JSON.parse(data) as { data: StreamMessageResult };
      result = payload.data;
    } else if (event === "error") {
      const payload = JSON.parse(data) as {
        error?: { message?: string };
      };
      throw new Error(payload.error?.message ?? "Failed to stream answer");
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let separator: number;
    while ((separator = buffer.indexOf("\n\n")) !== -1) {
      const rawEvent = buffer.slice(0, separator);
      buffer = buffer.slice(separator + 2);
      dispatch(rawEvent);
    }
  }

  if (!result) {
    throw new Error("Stream ended without a complete response");
  }

  return result;
}