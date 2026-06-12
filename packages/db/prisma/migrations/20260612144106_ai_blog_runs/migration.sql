-- CreateTable
CREATE TABLE `blog_generation_runs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('PENDING', 'RUNNING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `trigger` ENUM('MANUAL', 'SCHEDULED') NOT NULL DEFAULT 'MANUAL',
    `current_step` VARCHAR(191) NULL,
    `pillar` VARCHAR(191) NULL,
    `topic` TEXT NULL,
    `blog_post_id` INTEGER NULL,
    `seo_score` INTEGER NULL,
    `quality_score` INTEGER NULL,
    `retry_count` INTEGER NOT NULL DEFAULT 0,
    `image_source` VARCHAR(191) NULL,
    `generation_ms` INTEGER NULL,
    `error_message` TEXT NULL,
    `metadata` JSON NULL,
    `triggered_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `blog_generation_runs_status_created_at_idx`(`status`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
