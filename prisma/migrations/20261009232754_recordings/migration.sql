-- CreateTable
CREATE TABLE `recordings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `learner_id` INTEGER NOT NULL,
    `question_id` INTEGER NULL,
    `sentence` VARCHAR(255) NOT NULL,
    `file` VARCHAR(100) NOT NULL,
    `duration_ms` INTEGER NOT NULL,
    `stars` TINYINT NOT NULL,
    `transcript` VARCHAR(500) NULL,
    `scored` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `recordings_learner_id_question_id_created_at_idx`(`learner_id`, `question_id`, `created_at`),
    INDEX `recordings_learner_id_created_at_idx`(`learner_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recordings` ADD CONSTRAINT `recordings_learner_id_fkey` FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recordings` ADD CONSTRAINT `recordings_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
