-- CreateTable
CREATE TABLE `stories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level_id` INTEGER NOT NULL,
    `unit_id` INTEGER NULL,
    `slug` VARCHAR(100) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `title_vi` VARCHAR(150) NOT NULL,
    `cover` VARCHAR(255) NULL,
    `new_words` JSON NOT NULL,
    `status` ENUM('planned', 'draft', 'published') NOT NULL DEFAULT 'draft',
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `stories_level_id_sort_order_idx`(`level_id`, `sort_order`),
    INDEX `stories_unit_id_idx`(`unit_id`),
    UNIQUE INDEX `stories_level_id_slug_key`(`level_id`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `story_pages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `story_id` INTEGER NOT NULL,
    `sort_order` INTEGER NOT NULL,
    `kind` ENUM('page', 'question') NOT NULL DEFAULT 'page',
    `image` VARCHAR(255) NULL,
    `sentences` JSON NOT NULL,
    `audio` VARCHAR(255) NULL,
    `question_id` INTEGER NULL,

    INDEX `story_pages_story_id_sort_order_idx`(`story_id`, `sort_order`),
    INDEX `story_pages_question_id_idx`(`question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `stories` ADD CONSTRAINT `stories_level_id_fkey` FOREIGN KEY (`level_id`) REFERENCES `levels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stories` ADD CONSTRAINT `stories_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `story_pages` ADD CONSTRAINT `story_pages_story_id_fkey` FOREIGN KEY (`story_id`) REFERENCES `stories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `story_pages` ADD CONSTRAINT `story_pages_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
