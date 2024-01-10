/*
  Warnings:

  - You are about to drop the `Evaluation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,category]` on the table `CaseScenarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assessment_score` to the `TestHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `case_category` to the `TestHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluation_score` to the `TestHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intervention_score` to the `TestHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nursing_diagnosis_score` to the `TestHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overall_score` to the `TestHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planning_score` to the `TestHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_test_history_id_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_user_id_fkey";

-- DropForeignKey
ALTER TABLE "TestHistory" DROP CONSTRAINT "TestHistory_case_id_fkey";

-- AlterTable
ALTER TABLE "TestHistory" ADD COLUMN     "assessment_score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "case_category" TEXT NOT NULL,
ADD COLUMN     "evaluation_score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "intervention_score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "nursing_diagnosis_score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "overall_score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "planning_score" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Evaluation";

-- CreateIndex
CREATE UNIQUE INDEX "CaseScenarios_id_category_key" ON "CaseScenarios"("id", "category");

-- AddForeignKey
ALTER TABLE "TestHistory" ADD CONSTRAINT "TestHistory_case_id_case_category_fkey" FOREIGN KEY ("case_id", "case_category") REFERENCES "CaseScenarios"("id", "category") ON DELETE CASCADE ON UPDATE CASCADE;
