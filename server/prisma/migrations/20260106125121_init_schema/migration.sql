-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCard" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "userId" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "replacedBy" INTEGER,

    CONSTRAINT "UserCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "deviceId" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceState" (
    "id" SERIAL NOT NULL,
    "deviceId" TEXT NOT NULL,
    "admin_enroll_mode" BOOLEAN NOT NULL DEFAULT false,
    "user_card_registered" BOOLEAN NOT NULL DEFAULT false,
    "servo_state" TEXT NOT NULL DEFAULT 'IDLE',
    "servo_hold_ms" INTEGER,
    "saldo_rp" BIGINT NOT NULL DEFAULT 0,
    "last_add_rp" INTEGER,
    "ir_in" BOOLEAN NOT NULL DEFAULT false,
    "note_detected" TEXT NOT NULL DEFAULT 'NONE',
    "note_add_rp" INTEGER NOT NULL DEFAULT 0,
    "coin_weight_kg" DOUBLE PRECISION,
    "coin_candidate" TEXT NOT NULL DEFAULT 'NONE',
    "coin_stable_count" INTEGER NOT NULL DEFAULT 0,
    "coin_add_rp" INTEGER NOT NULL DEFAULT 0,
    "rfid_tap_type" TEXT NOT NULL DEFAULT 'NONE',
    "rfid_action" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyInEvent" (
    "id" SERIAL NOT NULL,
    "event_uuid" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "userId" INTEGER,
    "method" TEXT NOT NULL,
    "amount_rp" INTEGER NOT NULL,
    "saldo_before" BIGINT NOT NULL,
    "saldo_after" BIGINT NOT NULL,
    "coin_weight_kg" DOUBLE PRECISION,
    "note_detected" TEXT,
    "tcs_rg" INTEGER,
    "tcs_rb" INTEGER,
    "tcs_cE" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoneyInEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfidLog" (
    "id" SERIAL NOT NULL,
    "deviceId" TEXT NOT NULL,
    "uid" TEXT,
    "rfid_tap_type" TEXT NOT NULL,
    "rfid_action" TEXT,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RfidLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnrollEvent" (
    "id" SERIAL NOT NULL,
    "deviceId" TEXT NOT NULL,
    "uid" TEXT,
    "userId" INTEGER,
    "hasUserCard" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnrollEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaldoResetEvent" (
    "id" SERIAL NOT NULL,
    "deviceId" TEXT NOT NULL,
    "userId" INTEGER,
    "saldo_before" BIGINT NOT NULL,
    "saldo_after" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaldoResetEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserCard_uid_key" ON "UserCard"("uid");

-- CreateIndex
CREATE INDEX "UserCard_uid_idx" ON "UserCard"("uid");

-- CreateIndex
CREATE INDEX "UserCard_userId_idx" ON "UserCard"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_deviceId_key" ON "Device"("deviceId");

-- CreateIndex
CREATE INDEX "DeviceState_deviceId_updatedAt_idx" ON "DeviceState"("deviceId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MoneyInEvent_event_uuid_key" ON "MoneyInEvent"("event_uuid");

-- CreateIndex
CREATE INDEX "MoneyInEvent_deviceId_createdAt_idx" ON "MoneyInEvent"("deviceId", "createdAt");

-- CreateIndex
CREATE INDEX "MoneyInEvent_userId_createdAt_idx" ON "MoneyInEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "MoneyInEvent_event_uuid_idx" ON "MoneyInEvent"("event_uuid");

-- CreateIndex
CREATE INDEX "RfidLog_deviceId_createdAt_idx" ON "RfidLog"("deviceId", "createdAt");

-- CreateIndex
CREATE INDEX "RfidLog_uid_idx" ON "RfidLog"("uid");

-- CreateIndex
CREATE INDEX "EnrollEvent_deviceId_createdAt_idx" ON "EnrollEvent"("deviceId", "createdAt");

-- CreateIndex
CREATE INDEX "SaldoResetEvent_deviceId_createdAt_idx" ON "SaldoResetEvent"("deviceId", "createdAt");

-- CreateIndex
CREATE INDEX "SaldoResetEvent_userId_idx" ON "SaldoResetEvent"("userId");

-- AddForeignKey
ALTER TABLE "UserCard" ADD CONSTRAINT "UserCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceState" ADD CONSTRAINT "DeviceState_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("deviceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyInEvent" ADD CONSTRAINT "MoneyInEvent_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("deviceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyInEvent" ADD CONSTRAINT "MoneyInEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfidLog" ADD CONSTRAINT "RfidLog_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("deviceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfidLog" ADD CONSTRAINT "RfidLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollEvent" ADD CONSTRAINT "EnrollEvent_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("deviceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollEvent" ADD CONSTRAINT "EnrollEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaldoResetEvent" ADD CONSTRAINT "SaldoResetEvent_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("deviceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaldoResetEvent" ADD CONSTRAINT "SaldoResetEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
