/*
  Warnings:

  - A unique constraint covering the columns `[tagName]` on the table `ApiKeys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tagName` to the `ApiKeys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKeys" ADD COLUMN     "tagName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ApiKeys_tagName_key" ON "ApiKeys"("tagName");
