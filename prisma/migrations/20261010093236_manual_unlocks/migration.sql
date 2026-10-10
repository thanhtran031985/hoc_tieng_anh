-- CreateTable
CREATE TABLE `manual_unlocks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `learner_id` INTEGER NOT NULL,
    `target_type` ENUM('level', 'unit', 'lesson') NOT NULL,
    `target_id` INTEGER NOT NULL,
    `unlocked_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `manual_unlocks_learner_id_created_at_idx`(`learner_id`, `created_at`),
    INDEX `manual_unlocks_unlocked_by_idx`(`unlocked_by`),
    UNIQUE INDEX `manual_unlocks_learner_id_target_type_target_id_key`(`learner_id`, `target_type`, `target_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `manual_unlocks` ADD CONSTRAINT `manual_unlocks_learner_id_fkey` FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manual_unlocks` ADD CONSTRAINT `manual_unlocks_unlocked_by_fkey` FOREIGN KEY (`unlocked_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
