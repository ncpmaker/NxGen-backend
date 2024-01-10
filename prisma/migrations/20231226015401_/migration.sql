/*
  Warnings:

  - You are about to drop the column `inervention` on the `CaseScenarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CaseScenarios" DROP COLUMN "inervention",
ADD COLUMN     "intervention" TEXT[];
