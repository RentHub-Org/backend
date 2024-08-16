/*
  Warnings:

  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[hash,createdBy_email]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listType` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ListType" AS ENUM ('DEV', 'RENTAL');

-- AlterTable
ALTER TABLE "File" DROP CONSTRAINT "File_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "listType" "ListType" NOT NULL,
ADD CONSTRAINT "File_pkey" PRIMARY KEY ("hash", "createdBy_email");

-- CreateIndex
CREATE UNIQUE INDEX "File_hash_createdBy_email_key" ON "File"("hash", "createdBy_email");
