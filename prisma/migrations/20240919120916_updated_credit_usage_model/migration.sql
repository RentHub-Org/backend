/*
  Warnings:

  - You are about to drop the column `userId` on the `CreditUsage` table. All the data in the column will be lost.
  - Added the required column `userAddr` to the `CreditUsage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CreditUsage" DROP CONSTRAINT "CreditUsage_userId_fkey";

-- AlterTable
ALTER TABLE "CreditUsage" DROP COLUMN "userId",
ADD COLUMN     "userAddr" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CreditUsage" ADD CONSTRAINT "CreditUsage_userAddr_fkey" FOREIGN KEY ("userAddr") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
