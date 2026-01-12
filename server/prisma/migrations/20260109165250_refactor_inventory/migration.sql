/*
  Warnings:

  - You are about to drop the column `currentAvatar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserAvatar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserAvatar" DROP CONSTRAINT "UserAvatar_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentAvatar",
ADD COLUMN     "equippedAccessory" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "equippedBase" TEXT NOT NULL DEFAULT 'base',
ADD COLUMN     "equippedClothing" TEXT NOT NULL DEFAULT 'shirt01',
ADD COLUMN     "equippedHair" TEXT NOT NULL DEFAULT 'short01';

-- DropTable
DROP TABLE "UserAvatar";

-- CreateTable
CREATE TABLE "UserItem" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserItem_userId_itemId_key" ON "UserItem"("userId", "itemId");

-- AddForeignKey
ALTER TABLE "UserItem" ADD CONSTRAINT "UserItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
