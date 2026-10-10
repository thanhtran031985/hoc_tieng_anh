-- CreateTable
CREATE TABLE `word_families` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pattern` VARCHAR(10) NOT NULL,
    `kind` ENUM('rime', 'root') NOT NULL DEFAULT 'rime',
    `sound_ipa` VARCHAR(40) NOT NULL,
    `level_id` INTEGER NOT NULL,
    `build_rime` VARCHAR(10) NULL,
    `decoys` JSON NOT NULL,
    `trap_note` VARCHAR(500) NOT NULL DEFAULT '',
    `status` ENUM('planned', 'draft', 'published') NOT NULL DEFAULT 'draft',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `word_families_level_id_idx`(`level_id`),
    UNIQUE INDEX `word_families_pattern_sound_ipa_key`(`pattern`, `sound_ipa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `word_family_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `family_id` INTEGER NOT NULL,
    `word_id` INTEGER NOT NULL,
    `same_sound` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER NOT NULL,

    INDEX `word_family_members_word_id_idx`(`word_id`),
    UNIQUE INDEX `word_family_members_family_id_word_id_key`(`family_id`, `word_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `word_families` ADD CONSTRAINT `word_families_level_id_fkey` FOREIGN KEY (`level_id`) REFERENCES `levels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `word_family_members` ADD CONSTRAINT `word_family_members_family_id_fkey` FOREIGN KEY (`family_id`) REFERENCES `word_families`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `word_family_members` ADD CONSTRAINT `word_family_members_word_id_fkey` FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
