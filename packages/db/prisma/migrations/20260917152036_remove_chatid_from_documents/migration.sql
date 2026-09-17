/*
  Warnings:

  - You are about to drop the column `chatId` on the `document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "document" DROP COLUMN "chatId";

-- CreateIndex
CREATE INDEX "chat_message_chatId_idx" ON "chat_message"("chatId");
