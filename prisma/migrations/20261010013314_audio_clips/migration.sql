-- CreateTable
CREATE TABLE `audio_clips` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text_key` VARCHAR(500) NOT NULL,
    `text` VARCHAR(500) NOT NULL,
    `file` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `audio_clips_text_key_key`(`text_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
