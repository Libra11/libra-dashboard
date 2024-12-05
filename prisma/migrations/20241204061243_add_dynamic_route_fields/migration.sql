-- AlterTable
ALTER TABLE "menus" ADD COLUMN     "dynamicName" TEXT,
ADD COLUMN     "isDynamic" BOOLEAN NOT NULL DEFAULT false;
