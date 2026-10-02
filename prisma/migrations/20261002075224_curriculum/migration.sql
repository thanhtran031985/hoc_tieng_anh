-- CreateTable
CREATE TABLE `stages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `sort_order` INTEGER NOT NULL,

    UNIQUE INDEX `stages_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `levels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stage_id` INTEGER NOT NULL,
    `number` TINYINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `cefr` VARCHAR(30) NOT NULL,
    `description` TEXT NOT NULL,
    `color` VARCHAR(30) NOT NULL,
    `theme` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `levels_number_key`(`number`),
    INDEX `levels_stage_id_idx`(`stage_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `units` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level_id` INTEGER NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `title_vi` VARCHAR(150) NOT NULL,
    `image` VARCHAR(255) NULL,
    `sort_order` INTEGER NOT NULL,
    `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',

    INDEX `units_level_id_sort_order_idx`(`level_id`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lessons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unit_id` INTEGER NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `kind` ENUM('lesson', 'unit_test', 'level_test', 'review') NOT NULL DEFAULT 'lesson',
    `sort_order` INTEGER NOT NULL,
    `minutes` TINYINT NOT NULL DEFAULT 10,
    `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',

    INDEX `lessons_unit_id_sort_order_idx`(`unit_id`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lesson_steps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lesson_id` INTEGER NOT NULL,
    `sort_order` INTEGER NOT NULL,
    `activity_type` VARCHAR(50) NOT NULL,
    `word_id` INTEGER NULL,
    `question_id` INTEGER NULL,
    `config` JSON NULL,

    INDEX `lesson_steps_lesson_id_sort_order_idx`(`lesson_id`, `sort_order`),
    INDEX `lesson_steps_word_id_idx`(`word_id`),
    INDEX `lesson_steps_question_id_idx`(`question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `words` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `word` VARCHAR(100) NOT NULL,
    `ipa` VARCHAR(100) NULL,
    `part_of_speech` VARCHAR(30) NULL,
    `meaning_vi` VARCHAR(255) NOT NULL,
    `example_en` VARCHAR(500) NULL,
    `example_vi` VARCHAR(500) NULL,
    `image` VARCHAR(255) NULL,
    `audio` VARCHAR(255) NULL,
    `example_audio` VARCHAR(255) NULL,
    `level_id` INTEGER NOT NULL,
    `extra` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `words_word_idx`(`word`),
    INDEX `words_level_id_idx`(`level_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `name_vi` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `topics_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `word_topic` (
    `word_id` INTEGER NOT NULL,
    `topic_id` INTEGER NOT NULL,

    INDEX `word_topic_topic_id_idx`(`topic_id`),
    PRIMARY KEY (`word_id`, `topic_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(50) NOT NULL,
    `prompt` JSON NOT NULL,
    `options` JSON NULL,
    `answer` JSON NOT NULL,
    `explanation` TEXT NULL,
    `level_id` INTEGER NOT NULL,
    `skill` VARCHAR(30) NOT NULL DEFAULT 'vocabulary',
    `difficulty` TINYINT NOT NULL DEFAULT 1,
    `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `questions_level_id_type_idx`(`level_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(255) NOT NULL,
    `type` ENUM('image', 'audio') NOT NULL,
    `size` INTEGER NOT NULL,
    `alt` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `media_path_key`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `learners_current_level_id_idx` ON `learners`(`current_level_id`);

-- AddForeignKey
ALTER TABLE `learners` ADD CONSTRAINT `learners_current_level_id_fkey` FOREIGN KEY (`current_level_id`) REFERENCES `levels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `levels` ADD CONSTRAINT `levels_stage_id_fkey` FOREIGN KEY (`stage_id`) REFERENCES `stages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `units` ADD CONSTRAINT `units_level_id_fkey` FOREIGN KEY (`level_id`) REFERENCES `levels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lesson_steps` ADD CONSTRAINT `lesson_steps_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lesson_steps` ADD CONSTRAINT `lesson_steps_word_id_fkey` FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lesson_steps` ADD CONSTRAINT `lesson_steps_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `words` ADD CONSTRAINT `words_level_id_fkey` FOREIGN KEY (`level_id`) REFERENCES `levels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `word_topic` ADD CONSTRAINT `word_topic_word_id_fkey` FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `word_topic` ADD CONSTRAINT `word_topic_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_level_id_fkey` FOREIGN KEY (`level_id`) REFERENCES `levels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
