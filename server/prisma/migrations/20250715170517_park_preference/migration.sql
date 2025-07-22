-- CreateTable
CREATE TABLE "EventParkPreference" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventParkPreference_pkey" PRIMARY KEY ("id")
);
