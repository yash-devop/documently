/*
  Warnings:

  - You are about to drop the column `embeddings` on the `document_chunk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "document_chunk" DROP COLUMN "embeddings",
ADD COLUMN     "embedding" vector;
