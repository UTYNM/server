/*
  Warnings:

  - You are about to alter the column `deadline` on the `time_managements` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `time_managements` MODIFY `deadline` DATETIME(3) NOT NULL;
