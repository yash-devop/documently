-- AlterTable

-- DropForeignKey
ALTER TABLE "chat_message" DROP CONSTRAINT "chat_message_chatId_fkey";

-- AddForeignKey
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
