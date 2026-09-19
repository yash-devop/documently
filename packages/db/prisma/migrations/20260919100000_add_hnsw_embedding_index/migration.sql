-- CreateIndex
CREATE INDEX "document_chunk_embedding_hnsw_idx"
ON "document_chunk"
USING hnsw ("embedding" vector_cosine_ops);