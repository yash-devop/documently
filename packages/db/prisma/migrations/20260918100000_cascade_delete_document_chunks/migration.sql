-- AlterTable

-- DropForeignKey
ALTER TABLE "document_chunk" DROP CONSTRAINT "document_chunk_documentId_fkey";

-- AddForeignKey
ALTER TABLE "document_chunk" ADD CONSTRAINT "document_chunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE CASCADE;