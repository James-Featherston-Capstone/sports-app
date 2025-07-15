/*
  Warnings:

  - Added the required column `eventId` to the `EventParkPreference` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventParkPreference" ADD COLUMN     "eventId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "EventParkPreference" ADD CONSTRAINT "EventParkPreference_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
