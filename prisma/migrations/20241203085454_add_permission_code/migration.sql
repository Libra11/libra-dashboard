/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "menus_name_key";

-- DropIndex
DROP INDEX "permissions_name_key";

-- AlterTable
ALTER TABLE "menus" ALTER COLUMN "icon" DROP NOT NULL,
ALTER COLUMN "sort" SET DEFAULT 0;

-- 删除现有权限数据
TRUNCATE TABLE "permissions" CASCADE;

-- 添加 code 列
ALTER TABLE "permissions" ADD COLUMN "code" TEXT NOT NULL;
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateTable
CREATE TABLE "_RoleMenus" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RoleMenus_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RoleMenus_B_index" ON "_RoleMenus"("B");

-- AddForeignKey
ALTER TABLE "_RoleMenus" ADD CONSTRAINT "_RoleMenus_A_fkey" FOREIGN KEY ("A") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleMenus" ADD CONSTRAINT "_RoleMenus_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
