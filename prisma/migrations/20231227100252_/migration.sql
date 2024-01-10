/*
  Warnings:

  - You are about to drop the column `created_on` on the `CaseScenarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CaseScenarios" DROP COLUMN "created_on",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
