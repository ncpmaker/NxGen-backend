/*
  Warnings:

  - You are about to drop the column `case_category` on the `TestHistory` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `TestHistory` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `TestHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TestHistory" DROP COLUMN "case_category",
DROP COLUMN "first_name",
DROP COLUMN "last_name";
