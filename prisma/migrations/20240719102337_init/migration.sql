/*
  Warnings:

  - You are about to drop the column `createdBy_wallet_address` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `custom_extension` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `pinned_at` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `File` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `wallet_address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Quota` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdBy_email` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentralStatusId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_createdBy_wallet_address_fkey";

-- DropForeignKey
ALTER TABLE "Quota" DROP CONSTRAINT "Quota_createdFor_wallet_address_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "createdBy_wallet_address",
DROP COLUMN "custom_extension",
DROP COLUMN "pinned_at",
DROP COLUMN "type",
ADD COLUMN     "createdBy_email" TEXT NOT NULL,
ADD COLUMN     "rentralStatusId" TEXT NOT NULL,
ALTER COLUMN "size" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "wallet_address",
ADD COLUMN     "credits" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "email" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("email");

-- DropTable
DROP TABLE "Quota";

-- DropEnum
DROP TYPE "QuotaType";

-- CreateTable
CREATE TABLE "GatewayRoutes" (
    "route" TEXT NOT NULL,
    "createdBy_email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Bills" (
    "billId" TEXT NOT NULL,
    "txnHash" TEXT NOT NULL,
    "payableAmount" BIGINT NOT NULL,
    "createdFor_email" TEXT NOT NULL,
    "credits" BIGINT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bills_pkey" PRIMARY KEY ("billId")
);

-- CreateTable
CREATE TABLE "TelegramEndPoints" (
    "username" TEXT NOT NULL,
    "nameHolder" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GatewayRoutes_route_key" ON "GatewayRoutes"("route");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramEndPoints_username_key" ON "TelegramEndPoints"("username");

-- AddForeignKey
ALTER TABLE "GatewayRoutes" ADD CONSTRAINT "GatewayRoutes_createdBy_email_fkey" FOREIGN KEY ("createdBy_email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_createdBy_email_fkey" FOREIGN KEY ("createdBy_email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bills" ADD CONSTRAINT "Bills_createdFor_email_fkey" FOREIGN KEY ("createdFor_email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramEndPoints" ADD CONSTRAINT "TelegramEndPoints_nameHolder_fkey" FOREIGN KEY ("nameHolder") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
