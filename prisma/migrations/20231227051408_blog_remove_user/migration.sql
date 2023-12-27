/*
  Warnings:

  - You are about to drop the column `authorId` on the `blogs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `blogs` DROP FOREIGN KEY `blogs_authorId_fkey`;

-- AlterTable
ALTER TABLE `blogs` DROP COLUMN `authorId`;
