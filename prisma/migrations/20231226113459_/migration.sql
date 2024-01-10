/*
  Warnings:

  - A unique constraint covering the columns `[id,first_name,last_name]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `first_name` to the `TestHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `TestHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TestHistory" DROP CONSTRAINT "TestHistory_user_id_fkey";

-- AlterTable
ALTER TABLE "TestHistory" ADD COLUMN     "date_taken" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_first_name_last_name_key" ON "Users"("id", "first_name", "last_name");

-- AddForeignKey
ALTER TABLE "TestHistory" ADD CONSTRAINT "TestHistory_user_id_first_name_last_name_fkey" FOREIGN KEY ("user_id", "first_name", "last_name") REFERENCES "Users"("id", "first_name", "last_name") ON DELETE CASCADE ON UPDATE CASCADE;
