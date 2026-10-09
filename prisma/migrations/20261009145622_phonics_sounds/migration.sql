-- CreateTable
CREATE TABLE `phonics_sounds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grapheme` VARCHAR(8) NOT NULL,
    `kind` ENUM('single', 'consonant_digraph', 'vowel_digraph') NOT NULL,
    `ipa` VARCHAR(16) NOT NULL,
    `examples` JSON NOT NULL,
    `audio` VARCHAR(255) NULL,
    `audio_ms` INTEGER NULL,
    `audio_auto` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` INTEGER NOT NULL,
    `status` ENUM('planned', 'draft', 'published') NOT NULL DEFAULT 'published',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `phonics_sounds_grapheme_key`(`grapheme`),
    INDEX `phonics_sounds_sort_order_idx`(`sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
