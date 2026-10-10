-- CreateTable
CREATE TABLE `word_questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `word_id` INTEGER NOT NULL,
    `sort_order` INTEGER NOT NULL,
    `kind` VARCHAR(30) NOT NULL,
    `question_en` VARCHAR(255) NOT NULL,
    `question_vi` VARCHAR(255) NOT NULL,
    `answers` JSON NOT NULL,
    `distractors` JSON NOT NULL,
    `status` ENUM('planned', 'draft', 'published') NOT NULL DEFAULT 'draft',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `word_questions_word_id_sort_order_key`(`word_id`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `word_readings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `owner_type` ENUM('word', 'family') NOT NULL,
    `owner_id` INTEGER NOT NULL,
    `sentences` JSON NOT NULL,
    `audio` VARCHAR(255) NULL,
    `status` ENUM('planned', 'draft', 'published') NOT NULL DEFAULT 'draft',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `word_readings_owner_type_owner_id_key`(`owner_type`, `owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `word_questions` ADD CONSTRAINT `word_questions_word_id_fkey` FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
