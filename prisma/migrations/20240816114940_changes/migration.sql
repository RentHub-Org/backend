/*
  Warnings:

  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "File_hash_createdBy_email_listType_key";

-- AlterTable
ALTER TABLE "File" DROP CONSTRAINT "File_pkey",
ADD CONSTRAINT "File_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "File_id_key" ON "File"("id");
