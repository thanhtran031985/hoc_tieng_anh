-- CreateTable
CREATE TABLE `rewards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('sticker', 'badge', 'room_item', 'avatar_frame', 'theme', 'title') NOT NULL,
    `code` VARCHAR(80) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `image` VARCHAR(255) NULL,
    `price` INTEGER NULL,
    `condition` JSON NULL,
    `for_stage` TINYINT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `rewards_code_key`(`code`),
    INDEX `rewards_type_sort_order_idx`(`type`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learner_rewards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `learner_id` INTEGER NOT NULL,
    `reward_id` INTEGER NOT NULL,
    `acquired_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `equipped` BOOLEAN NOT NULL DEFAULT false,
    `position` JSON NULL,

    UNIQUE INDEX `learner_rewards_learner_id_reward_id_key`(`learner_id`, `reward_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `learner_rewards` ADD CONSTRAINT `learner_rewards_learner_id_fkey` FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `learner_rewards` ADD CONSTRAINT `learner_rewards_reward_id_fkey` FOREIGN KEY (`reward_id`) REFERENCES `rewards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
