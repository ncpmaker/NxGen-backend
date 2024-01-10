/*
  Warnings:

  - You are about to drop the column `enabled_post_test` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "enabled_post_test";

-- CreateTable
CREATE TABLE "EnablePostTest" (
    "id" SERIAL NOT NULL,
    "A1" BOOLEAN NOT NULL DEFAULT false,
    "B1" BOOLEAN NOT NULL DEFAULT false,
    "C1" BOOLEAN NOT NULL DEFAULT false,
    "D1" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EnablePostTest_pkey" PRIMARY KEY ("id")
);
