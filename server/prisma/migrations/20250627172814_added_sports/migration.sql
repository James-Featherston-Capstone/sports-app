/*
  Warnings:

  - The `sports` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Sports" AS ENUM ('FOOTBALL', 'SOCCER', 'BASKETBALL', 'BASEBALL', 'TENNIS', 'PICKLEBALL', 'SOFTBALL', 'RACQUETBALL', 'FRISBEE', 'VOLLEYBALL', 'GOLF', 'HOCKEY');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sports",
ADD COLUMN     "sports" "Sports"[] DEFAULT ARRAY[]::"Sports"[];
