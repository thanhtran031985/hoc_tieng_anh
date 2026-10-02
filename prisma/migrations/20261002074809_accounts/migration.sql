/*
  Warnings:

  - You are about to drop the `setupcheck` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `setupcheck`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `role` ENUM('admin', 'parent') NOT NULL DEFAULT 'parent',
    `parent_pin` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `birth_year` SMALLINT NULL,
    `school_grade` TINYINT NULL,
    `textbook` VARCHAR(100) NULL,
    `avatar` VARCHAR(30) NOT NULL DEFAULT 'short',
    `mascot` VARCHAR(20) NOT NULL DEFAULT 'ngoc',
    `mascot_name` VARCHAR(50) NOT NULL DEFAULT 'Bông',
    `ui_theme` ENUM('tieu-hoc', 'thcs', 'auto') NOT NULL DEFAULT 'auto',
    `current_level_id` INTEGER NULL,
    `stars` INTEGER NOT NULL DEFAULT 0,
    `coins` INTEGER NOT NULL DEFAULT 0,
    `xp` INTEGER NOT NULL DEFAULT 0,
    `streak_days` INTEGER NOT NULL DEFAULT 0,
    `streak_freezes` INTEGER NOT NULL DEFAULT 1,
    `last_study_date` DATE NULL,
    `pin` VARCHAR(100) NULL,
    `settings` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `learners_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `learners` ADD CONSTRAINT `learners_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
