/*
  Warnings:

  - You are about to drop the column `assessment_score` on the `TestHistory` table. All the data in the column will be lost.
  - You are about to drop the column `case_id` on the `TestHistory` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation_score` on the `TestHistory` table. All the data in the column will be lost.
  - You are about to drop the column `intervention_score` on the `TestHistory` table. All the data in the column will be lost.
  - You are about to drop the column `nursing_diagnosis_score` on the `TestHistory` table. All the data in the column will be lost.
  - You are about to drop the column `overall_score` on the `TestHistory` table. All the data in the column will be lost.
  - You are about to drop the column `planning_score` on the `TestHistory` table. All the data in the column will be lost.
  - You are about to drop the column `times_taken` on the `TestHistory` table. All the data in the column will be lost.
  - You are about to drop the column `finished_intro` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Users` table. All the data in the column will be lost.
  - Added the required column `test_type` to the `TestHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('PRETEST', 'POSTTEST');

-- DropForeignKey
ALTER TABLE "TestHistory" DROP CONSTRAINT "TestHistory_case_id_fkey";

-- DropForeignKey
ALTER TABLE "TestHistory" DROP CONSTRAINT "TestHistory_user_id_fkey";

-- AlterTable
ALTER TABLE "TestHistory" DROP COLUMN "assessment_score",
DROP COLUMN "case_id",
DROP COLUMN "evaluation_score",
DROP COLUMN "intervention_score",
DROP COLUMN "nursing_diagnosis_score",
DROP COLUMN "overall_score",
DROP COLUMN "planning_score",
DROP COLUMN "times_taken",
ADD COLUMN     "test_type" "TestType" NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "finished_intro",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
ADD COLUMN     "finished_pre_test" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CaseScenarioHistory" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "times_taken" INTEGER NOT NULL DEFAULT 1,
    "date_taken" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answers" JSONB NOT NULL,
    "assessment_score" DOUBLE PRECISION NOT NULL,
    "nursing_diagnosis_score" DOUBLE PRECISION NOT NULL,
    "planning_score" DOUBLE PRECISION NOT NULL,
    "intervention_score" DOUBLE PRECISION NOT NULL,
    "evaluation_score" DOUBLE PRECISION NOT NULL,
    "overall_score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CaseScenarioHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestHistory" ADD CONSTRAINT "TestHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseScenarioHistory" ADD CONSTRAINT "CaseScenarioHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseScenarioHistory" ADD CONSTRAINT "CaseScenarioHistory_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "CaseScenarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
