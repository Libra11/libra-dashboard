/*
  Warnings:

  - You are about to drop the column `isDynamic` on the `menus` table. All the data in the column will be lost.
  - You are about to drop the column `pattern` on the `menus` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "menus_parentId_idx";

-- AlterTable
ALTER TABLE "menus" DROP COLUMN "isDynamic",
DROP COLUMN "pattern";

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
