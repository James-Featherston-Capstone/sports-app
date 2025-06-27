/*
  Warnings:

  - You are about to drop the column `pfp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pfp",
ADD COLUMN     "bio" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "location" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "profile_image_url" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "sports" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "username" DROP DEFAULT;

-- DropTable
DROP TABLE "Profile";

-- CreateTable
CREATE TABLE "Friendship" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
