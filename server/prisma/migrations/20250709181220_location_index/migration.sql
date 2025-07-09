-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "latitudeKey" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "longitudeKey" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "latitudeKey" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "longitudeKey" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Event_latitudeKey_longitudeKey_idx" ON "Event"("latitudeKey", "longitudeKey");

-- CreateIndex
CREATE INDEX "User_latitudeKey_longitudeKey_idx" ON "User"("latitudeKey", "longitudeKey");
