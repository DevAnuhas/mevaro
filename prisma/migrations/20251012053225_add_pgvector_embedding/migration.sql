-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "material" ADD COLUMN     "embedding" vector(768);

-- CreateIndex
-- Using HNSW (Hierarchical Navigable Small World) index for better performance on similarity searches
-- The index uses cosine distance operator (<=>)
CREATE INDEX IF NOT EXISTS "material_embedding_idx" ON "material" USING hnsw (embedding vector_cosine_ops);
