-- DropForeignKey
ALTER TABLE "menus" DROP CONSTRAINT "menus_parentId_fkey";

-- AlterTable
ALTER TABLE "menus" ADD COLUMN     "isDynamic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pattern" TEXT;

-- CreateIndex
CREATE INDEX "menus_parentId_idx" ON "menus"("parentId");
