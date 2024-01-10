/*
  Warnings:

  - Added the required column `audio_link` to the `CaseScenarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_link` to the `CaseScenarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scenario` to the `CaseScenarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CaseScenarios" ADD COLUMN     "audio_link" TEXT NOT NULL,
ADD COLUMN     "image_link" TEXT NOT NULL,
ADD COLUMN     "scenario" TEXT NOT NULL;
