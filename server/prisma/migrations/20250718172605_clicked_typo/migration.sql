/*
  Warnings:

  - You are about to drop the `ClickedEvents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClickedEvents" DROP CONSTRAINT "ClickedEvents_eventId_fkey";

-- DropForeignKey
ALTER TABLE "ClickedEvents" DROP CONSTRAINT "ClickedEvents_userId_fkey";

-- DropTable
DROP TABLE "ClickedEvents";

-- CreateTable
CREATE TABLE "ClickedEvent" (
    "id" SERIAL NOT NULL,
    "eventDistance" DECIMAL(65,30) NOT NULL,
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClickedEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClickedEvent" ADD CONSTRAINT "ClickedEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClickedEvent" ADD CONSTRAINT "ClickedEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
