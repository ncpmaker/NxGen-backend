/*
  Warnings:

  - Changed the type of `assessment` on the `CaseScenarios` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `nursing_diagnosis` on the `CaseScenarios` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `planning` on the `CaseScenarios` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `intervention` on the `CaseScenarios` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `answers` on the `TestHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CaseScenarios" DROP COLUMN "assessment",
ADD COLUMN     "assessment" JSONB NOT NULL,
DROP COLUMN "nursing_diagnosis",
ADD COLUMN     "nursing_diagnosis" JSONB NOT NULL,
DROP COLUMN "planning",
ADD COLUMN     "planning" JSONB NOT NULL,
DROP COLUMN "intervention",
ADD COLUMN     "intervention" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "TestHistory" DROP COLUMN "answers",
ADD COLUMN     "answers" JSONB NOT NULL;
