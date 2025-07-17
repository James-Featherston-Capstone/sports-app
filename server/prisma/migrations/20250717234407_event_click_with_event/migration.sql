/*
  Warnings:

  - Added the required column `eventId` to the `ClickedEvents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClickedEvents" ADD COLUMN     "eventId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ClickedEvents" ADD CONSTRAINT "ClickedEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
