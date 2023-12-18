-- CreateTable
CREATE TABLE `diet_plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mealType` VARCHAR(191) NOT NULL,
    `foodItem` VARCHAR(191) NOT NULL,
    `calories` INTEGER NOT NULL,
    `authorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `diet_plans` ADD CONSTRAINT `diet_plans_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
