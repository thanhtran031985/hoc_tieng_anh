-- AlterTable
ALTER TABLE `learner_rewards` ADD COLUMN `opened_at` DATETIME(3) NULL,
    ADD COLUMN `source_attempt_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `rewards` ADD COLUMN `album` VARCHAR(30) NULL,
    ADD COLUMN `coins` INTEGER NULL,
    ADD COLUMN `name_en` VARCHAR(150) NULL,
    ADD COLUMN `status` ENUM('draft', 'published') NOT NULL DEFAULT 'published';

-- Phần thưởng đã có trước bản này (huy hiệu trùm, qua đảo) coi như đã mở.
UPDATE `learner_rewards` SET `opened_at` = `acquired_at` WHERE `opened_at` IS NULL;
