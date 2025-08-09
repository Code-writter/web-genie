/*
  Warnings:

  - You are about to drop the `Fragement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Fragement" DROP CONSTRAINT "Fragement_messageId_fkey";

-- DropTable
DROP TABLE "public"."Fragement";

-- CreateTable
CREATE TABLE "public"."Fragment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "sandboxUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "files" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fragment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fragment_messageId_key" ON "public"."Fragment"("messageId");

-- AddForeignKey
ALTER TABLE "public"."Fragment" ADD CONSTRAINT "Fragment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
