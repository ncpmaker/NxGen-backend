-- DropForeignKey
ALTER TABLE "TestHistory" DROP CONSTRAINT "TestHistory_case_id_case_category_fkey";

-- DropForeignKey
ALTER TABLE "TestHistory" DROP CONSTRAINT "TestHistory_user_id_first_name_last_name_fkey";

-- DropIndex
DROP INDEX "CaseScenarios_id_category_key";

-- DropIndex
DROP INDEX "Users_id_first_name_last_name_key";

-- AddForeignKey
ALTER TABLE "TestHistory" ADD CONSTRAINT "TestHistory_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "CaseScenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestHistory" ADD CONSTRAINT "TestHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
