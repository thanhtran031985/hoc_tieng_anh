-- CreateTable
CREATE TABLE `game_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `learner_id` INTEGER NOT NULL,
    `game` VARCHAR(20) NOT NULL,
    `lesson_id` INTEGER NOT NULL,
    `correct` SMALLINT NOT NULL,
    `total` SMALLINT NOT NULL,
    `sequence` JSON NOT NULL,
    `played_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `game_records_learner_id_game_lesson_id_played_at_idx`(`learner_id`, `game`, `lesson_id`, `played_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `game_records` ADD CONSTRAINT `game_records_learner_id_fkey` FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_records` ADD CONSTRAINT `game_records_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
