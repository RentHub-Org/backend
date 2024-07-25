/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - Added the required column `sessionId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bills" DROP CONSTRAINT "Bills_createdFor_email_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_createdBy_email_fkey";

-- DropForeignKey
ALTER TABLE "GatewayRoutes" DROP CONSTRAINT "GatewayRoutes_createdBy_email_fkey";

-- DropForeignKey
ALTER TABLE "TelegramEndPoints" DROP CONSTRAINT "TelegramEndPoints_nameHolder_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "sessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "email",
ADD COLUMN     "address" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("address");

-- CreateTable
CREATE TABLE "ApiKeys" (
    "key" TEXT NOT NULL,
    "nameHolder" TEXT NOT NULL,

    CONSTRAINT "ApiKeys_pkey" PRIMARY KEY ("key")
);

-- AddForeignKey
ALTER TABLE "GatewayRoutes" ADD CONSTRAINT "GatewayRoutes_createdBy_email_fkey" FOREIGN KEY ("createdBy_email") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_createdBy_email_fkey" FOREIGN KEY ("createdBy_email") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bills" ADD CONSTRAINT "Bills_createdFor_email_fkey" FOREIGN KEY ("createdFor_email") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramEndPoints" ADD CONSTRAINT "TelegramEndPoints_nameHolder_fkey" FOREIGN KEY ("nameHolder") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKeys" ADD CONSTRAINT "ApiKeys_nameHolder_fkey" FOREIGN KEY ("nameHolder") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
