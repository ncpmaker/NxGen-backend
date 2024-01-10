/*
  Warnings:

  - Added the required column `score` to the `TestHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestHistory" ADD COLUMN     "score" TEXT NOT NULL;
