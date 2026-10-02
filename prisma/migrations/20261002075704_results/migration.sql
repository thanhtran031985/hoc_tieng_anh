-- CreateTable
CREATE TABLE `lesson_progress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `learner_id` INTEGER NOT NULL,
    `lesson_id` INTEGER NOT NULL,
    `best_stars` TINYINT NOT NULL DEFAULT 0,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `completed_at` DATETIME(3) NULL,

    INDEX `lesson_progress_lesson_id_idx`(`lesson_id`),
    UNIQUE INDEX `lesson_progress_learner_id_lesson_id_key`(`learner_id`, `lesson_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lesson_attempts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `learner_id` INTEGER NOT NULL,
    `lesson_id` INTEGER NOT NULL,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finished_at` DATETIME(3) NULL,
    `correct` INTEGER NOT NULL DEFAULT 0,
    `wrong` INTEGER NOT NULL DEFAULT 0,
    `stars` TINYINT NOT NULL DEFAULT 0,
    `xp` INTEGER NOT NULL DEFAULT 0,
    `coins` INTEGER NOT NULL DEFAULT 0,

    INDEX `lesson_attempts_learner_id_lesson_id_idx`(`learner_id`, `lesson_id`),
    INDEX `lesson_attempts_learner_id_started_at_idx`(`learner_id`, `started_at`),
    INDEX `lesson_attempts_lesson_id_idx`(`lesson_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `answer_logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `learner_id` INTEGER NOT NULL,
    `question_id` INTEGER NULL,
    `word_id` INTEGER NULL,
    `source` ENUM('lesson', 'review', 'exam') NOT NULL,
    `attempt_id` INTEGER NULL,
    `is_correct` BOOLEAN NOT NULL,
    `answer` JSON NULL,
    `time_ms` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `answer_logs_learner_id_created_at_idx`(`learner_id`, `created_at`),
    INDEX `answer_logs_learner_id_word_id_idx`(`learner_id`, `word_id`),
    INDEX `answer_logs_question_id_idx`(`question_id`),
    INDEX `answer_logs_word_id_idx`(`word_id`),
    INDEX `answer_logs_attempt_id_idx`(`attempt_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_cards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `learner_id` INTEGER NOT NULL,
    `word_id` INTEGER NULL,
    `question_id` INTEGER NULL,
    `box` TINYINT NOT NULL DEFAULT 1,
    `due_on` DATE NOT NULL,
    `correct_count` INTEGER NOT NULL DEFAULT 0,
    `wrong_count` INTEGER NOT NULL DEFAULT 0,
    `last_reviewed_at` DATETIME(3) NULL,

    INDEX `review_cards_learner_id_due_on_idx`(`learner_id`, `due_on`),
    INDEX `review_cards_word_id_idx`(`word_id`),
    INDEX `review_cards_question_id_idx`(`question_id`),
    UNIQUE INDEX `review_cards_learner_id_word_id_key`(`learner_id`, `word_id`),
    UNIQUE INDEX `review_cards_learner_id_question_id_key`(`learner_id`, `question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `study_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `learner_id` INTEGER NOT NULL,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ended_at` DATETIME(3) NULL,
    `minutes` INTEGER NOT NULL DEFAULT 0,

    INDEX `study_sessions_learner_id_started_at_idx`(`learner_id`, `started_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lesson_progress` ADD CONSTRAINT `lesson_progress_learner_id_fkey` FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lesson_progress` ADD CONSTRAINT `lesson_progress_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lesson_attempts` ADD CONSTRAINT `lesson_attempts_learner_id_fkey` FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lesson_attempts` ADD CONSTRAINT `lesson_attempts_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answer_logs` ADD CONSTRAINT `answer_logs_learner_id_fkey` FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answer_logs` ADD CONSTRAINT `answer_logs_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answer_logs` ADD CONSTRAINT `answer_logs_word_id_fkey` FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answer_logs` ADD CONSTRAINT `answer_logs_attempt_id_fkey` FOREIGN KEY (`attempt_id`) REFERENCES `lesson_attempts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_cards` ADD CONSTRAINT `review_cards_learner_id_fkey` FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_cards` ADD CONSTRAINT `review_cards_word_id_fkey` FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_cards` ADD CONSTRAINT `review_cards_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `study_sessions` ADD CONSTRAINT `study_sessions_learner_id_fkey` FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
