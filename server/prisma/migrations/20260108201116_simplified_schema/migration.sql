/*
  Warnings:

  - You are about to drop the column `coin_weight_kg` on the `MoneyInEvent` table. All the data in the column will be lost.
  - You are about to drop the column `event_uuid` on the `MoneyInEvent` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `MoneyInEvent` table. All the data in the column will be lost.
  - You are about to drop the column `note_detected` on the `MoneyInEvent` table. All the data in the column will be lost.
  - You are about to drop the column `saldo_before` on the `MoneyInEvent` table. All the data in the column will be lost.
  - You are about to drop the column `tcs_cE` on the `MoneyInEvent` table. All the data in the column will be lost.
  - You are about to drop the column `tcs_rb` on the `MoneyInEvent` table. All the data in the column will be lost.
  - You are about to drop the column `tcs_rg` on the `MoneyInEvent` table. All the data in the column will be lost.
  - You are about to alter the column `saldo_after` on the `MoneyInEvent` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The primary key for the `UserCard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `active` on the `UserCard` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserCard` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `UserCard` table. All the data in the column will be lost.
  - You are about to drop the column `replacedBy` on the `UserCard` table. All the data in the column will be lost.
  - You are about to drop the `Device` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DeviceState` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EnrollEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RfidLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SaldoResetEvent` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `MoneyInEvent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `UserCard` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "DeviceState" DROP CONSTRAINT "DeviceState_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "EnrollEvent" DROP CONSTRAINT "EnrollEvent_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "EnrollEvent" DROP CONSTRAINT "EnrollEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "MoneyInEvent" DROP CONSTRAINT "MoneyInEvent_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "MoneyInEvent" DROP CONSTRAINT "MoneyInEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "RfidLog" DROP CONSTRAINT "RfidLog_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "RfidLog" DROP CONSTRAINT "RfidLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "SaldoResetEvent" DROP CONSTRAINT "SaldoResetEvent_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "SaldoResetEvent" DROP CONSTRAINT "SaldoResetEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserCard" DROP CONSTRAINT "UserCard_userId_fkey";

-- DropIndex
DROP INDEX "MoneyInEvent_deviceId_createdAt_idx";

-- DropIndex
DROP INDEX "MoneyInEvent_event_uuid_idx";

-- DropIndex
DROP INDEX "MoneyInEvent_event_uuid_key";

-- DropIndex
DROP INDEX "MoneyInEvent_userId_createdAt_idx";

-- DropIndex
DROP INDEX "UserCard_uid_idx";

-- DropIndex
DROP INDEX "UserCard_uid_key";

-- DropIndex
DROP INDEX "UserCard_userId_idx";

-- AlterTable
ALTER TABLE "MoneyInEvent" DROP COLUMN "coin_weight_kg",
DROP COLUMN "event_uuid",
DROP COLUMN "method",
DROP COLUMN "note_detected",
DROP COLUMN "saldo_before",
DROP COLUMN "tcs_cE",
DROP COLUMN "tcs_rb",
DROP COLUMN "tcs_rg",
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "saldo_after" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserCard" DROP CONSTRAINT "UserCard_pkey",
DROP COLUMN "active",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "replacedBy",
ALTER COLUMN "userId" SET NOT NULL,
ADD CONSTRAINT "UserCard_pkey" PRIMARY KEY ("uid");

-- DropTable
DROP TABLE "Device";

-- DropTable
DROP TABLE "DeviceState";

-- DropTable
DROP TABLE "EnrollEvent";

-- DropTable
DROP TABLE "RfidLog";

-- DropTable
DROP TABLE "SaldoResetEvent";

-- AddForeignKey
ALTER TABLE "UserCard" ADD CONSTRAINT "UserCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyInEvent" ADD CONSTRAINT "MoneyInEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
