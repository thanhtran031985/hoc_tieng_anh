-- AlterTable
ALTER TABLE `lessons` MODIFY `status` ENUM('planned', 'draft', 'published') NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE `questions` MODIFY `status` ENUM('planned', 'draft', 'published') NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE `units` ADD COLUMN `slug` VARCHAR(100) NOT NULL,
    ADD COLUMN `source` VARCHAR(100) NULL,
    ADD COLUMN `target_words` JSON NULL,
    MODIFY `status` ENUM('planned', 'draft', 'published') NOT NULL DEFAULT 'draft';

-- CreateIndex
CREATE UNIQUE INDEX `units_level_id_slug_key` ON `units`(`level_id`, `slug`);

