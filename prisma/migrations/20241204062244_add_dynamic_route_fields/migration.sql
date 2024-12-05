/*
  Warnings:

  - Made the column `dynamicName` on table `menus` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "menus" ALTER COLUMN "dynamicName" SET NOT NULL,
ALTER COLUMN "dynamicName" SET DEFAULT 'id';
