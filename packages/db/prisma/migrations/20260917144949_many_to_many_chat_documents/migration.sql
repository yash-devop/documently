/*
  Warnings:

  - You are about to drop the column `documentId` on the `chat` table. All the data in the column will be lost.
  - Added the required column `userId` to the `chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chatId` to the `document` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_documentId_fkey";

-- AlterTable
ALTER TABLE "chat" DROP COLUMN "documentId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "document" ADD COLUMN     "chatId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "chat_document" (
    "chatId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "chat_document_pkey" PRIMARY KEY ("chatId","documentId")
);

-- CreateIndex
CREATE INDEX "chat_document_documentId_idx" ON "chat_document"("documentId");

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_document" ADD CONSTRAINT "chat_document_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_document" ADD CONSTRAINT "chat_document_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
