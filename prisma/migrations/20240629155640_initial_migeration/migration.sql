-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('FILE', 'IMAGE', 'JSON', 'TEXT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "QuotaType" AS ENUM ('Qt_1', 'Qt_2', 'Qt_3');

-- CreateTable
CREATE TABLE "User" (
    "wallet_address" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("wallet_address")
);

-- CreateTable
CREATE TABLE "File" (
    "hash" TEXT NOT NULL,
    "type" "FileType" NOT NULL DEFAULT 'FILE',
    "custom_extension" TEXT NOT NULL DEFAULT '',
    "size" INTEGER NOT NULL,
    "pinned_at" TIMESTAMP(3) NOT NULL,
    "expires_in_days" INTEGER NOT NULL,
    "createdBy_wallet_address" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "Quota" (
    "quotaId" TEXT NOT NULL,
    "createdFor_wallet_address" TEXT NOT NULL,
    "quotaType" "QuotaType" NOT NULL,
    "credits" BIGINT NOT NULL,

    CONSTRAINT "Quota_pkey" PRIMARY KEY ("quotaId")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_createdBy_wallet_address_fkey" FOREIGN KEY ("createdBy_wallet_address") REFERENCES "User"("wallet_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quota" ADD CONSTRAINT "Quota_createdFor_wallet_address_fkey" FOREIGN KEY ("createdFor_wallet_address") REFERENCES "User"("wallet_address") ON DELETE RESTRICT ON UPDATE CASCADE;
