-- DropForeignKey
ALTER TABLE `Url` DROP FOREIGN KEY `Url_userId_fkey`;

-- AlterTable
ALTER TABLE `Url` MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Url` ADD CONSTRAINT `Url_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
