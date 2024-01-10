/*
  Warnings:

  - The primary key for the `TestHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[test_history_id]` on the table `Evaluation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `test_history_id` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "test_history_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TestHistory" DROP CONSTRAINT "TestHistory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TestHistory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TestHistory_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_test_history_id_key" ON "Evaluation"("test_history_id");

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_test_history_id_fkey" FOREIGN KEY ("test_history_id") REFERENCES "TestHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
