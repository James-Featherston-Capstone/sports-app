-- CreateTable
CREATE TABLE "RecommendationData" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "timeOfDayBuckets" JSONB NOT NULL,
    "timeOfDayCount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "timeOfDayWeight" DECIMAL(65,30) NOT NULL DEFAULT 0.15,
    "sportBuckets" JSONB NOT NULL,
    "sportCount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "sportWeight" DECIMAL(65,30) NOT NULL DEFAULT 0.35,
    "dateCount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dateWeight" DECIMAL(65,30) NOT NULL DEFAULT 0.5,

    CONSTRAINT "RecommendationData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecommendationData_userId_key" ON "RecommendationData"("userId");

-- AddForeignKey
ALTER TABLE "RecommendationData" ADD CONSTRAINT "RecommendationData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
