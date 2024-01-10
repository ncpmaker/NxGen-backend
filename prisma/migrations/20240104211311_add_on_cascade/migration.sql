-- DropForeignKey
ALTER TABLE "CaseScenarioHistory" DROP CONSTRAINT "CaseScenarioHistory_case_id_fkey";

-- DropForeignKey
ALTER TABLE "CaseScenarioHistory" DROP CONSTRAINT "CaseScenarioHistory_user_id_fkey";

-- DropForeignKey
ALTER TABLE "TestHistory" DROP CONSTRAINT "TestHistory_user_id_fkey";

-- AddForeignKey
ALTER TABLE "TestHistory" ADD CONSTRAINT "TestHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseScenarioHistory" ADD CONSTRAINT "CaseScenarioHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseScenarioHistory" ADD CONSTRAINT "CaseScenarioHistory_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "CaseScenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
