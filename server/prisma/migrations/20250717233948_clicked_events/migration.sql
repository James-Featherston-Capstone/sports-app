-- CreateTable
CREATE TABLE "ClickedEvents" (
    "id" SERIAL NOT NULL,
    "eventDistance" DECIMAL(65,30) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ClickedEvents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClickedEvents" ADD CONSTRAINT "ClickedEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
