/*
  Warnings:

  - A unique constraint covering the columns `[eventId,userId]` on the table `EventRSVP` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventRSVP_eventId_userId_key" ON "EventRSVP"("eventId", "userId");
