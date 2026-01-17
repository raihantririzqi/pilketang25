-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `google_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'COMMITTEE', 'PARTICIPANT') NOT NULL DEFAULT 'PARTICIPANT',
    `profile_picture` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_google_id_key`(`google_id`),
    UNIQUE INDEX `User_nim_key`(`nim`),
    INDEX `User_google_id_email_nim_role_idx`(`google_id`, `email`, `nim`, `role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Candidate` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `vision` TEXT NOT NULL,
    `mission` TEXT NOT NULL,
    `photo_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Candidate_nim_key`(`nim`),
    INDEX `Candidate_name_nim_idx`(`name`, `nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VotingSession` (
    `id` VARCHAR(191) NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `published_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `VotingSession_is_active_is_published_start_time_end_time_idx`(`is_active`, `is_published`, `start_time`, `end_time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QRCode` (
    `token` VARCHAR(191) NOT NULL,
    `voting_token` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `is_used` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` DATETIME(3) NOT NULL,

    INDEX `QRCode_user_id_session_id_is_used_expires_at_token_voting_to_idx`(`user_id`, `session_id`, `is_used`, `expires_at`, `token`, `voting_token`),
    UNIQUE INDEX `QRCode_user_id_session_id_key`(`user_id`, `session_id`),
    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TemporaryVotingSession` (
    `voting_token` VARCHAR(191) NOT NULL,
    `qr_token` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` DATETIME(3) NOT NULL,
    `is_used` BOOLEAN NOT NULL DEFAULT false,

    INDEX `TemporaryVotingSession_qr_token_is_used_expires_at_session_i_idx`(`qr_token`, `is_used`, `expires_at`, `session_id`),
    PRIMARY KEY (`voting_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttendanceRecord` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `has_voted` BOOLEAN NOT NULL DEFAULT false,

    INDEX `AttendanceRecord_user_id_session_id_has_voted_idx`(`user_id`, `session_id`, `has_voted`),
    UNIQUE INDEX `AttendanceRecord_user_id_session_id_key`(`user_id`, `session_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoteRecord` (
    `id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `candidate_id` VARCHAR(191) NOT NULL,
    `qr_token` VARCHAR(191) NOT NULL,
    `voting_token` VARCHAR(191) NOT NULL,

    INDEX `VoteRecord_session_id_candidate_id_qr_token_voting_token_idx`(`session_id`, `candidate_id`, `qr_token`, `voting_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `target_id` VARCHAR(191) NOT NULL,
    `old_value` VARCHAR(191) NULL,
    `new_value` VARCHAR(191) NULL,
    `ip_address` VARCHAR(191) NOT NULL,
    `user_agent` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    INDEX `AuditLog_user_id_action_created_at_target_id_idx`(`user_id`, `action`, `created_at`, `target_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TokenBlacklist` (
    `jti` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` DATETIME(3) NOT NULL,

    INDEX `TokenBlacklist_user_id_expires_at_idx`(`user_id`, `expires_at`),
    PRIMARY KEY (`jti`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QRCode` ADD CONSTRAINT `QRCode_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QRCode` ADD CONSTRAINT `QRCode_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `VotingSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TemporaryVotingSession` ADD CONSTRAINT `TemporaryVotingSession_qr_token_fkey` FOREIGN KEY (`qr_token`) REFERENCES `QRCode`(`token`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TemporaryVotingSession` ADD CONSTRAINT `TemporaryVotingSession_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `VotingSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceRecord` ADD CONSTRAINT `AttendanceRecord_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceRecord` ADD CONSTRAINT `AttendanceRecord_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `VotingSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoteRecord` ADD CONSTRAINT `VoteRecord_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `VotingSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoteRecord` ADD CONSTRAINT `VoteRecord_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `Candidate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoteRecord` ADD CONSTRAINT `VoteRecord_qr_token_fkey` FOREIGN KEY (`qr_token`) REFERENCES `QRCode`(`token`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoteRecord` ADD CONSTRAINT `VoteRecord_voting_token_fkey` FOREIGN KEY (`voting_token`) REFERENCES `TemporaryVotingSession`(`voting_token`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TokenBlacklist` ADD CONSTRAINT `TokenBlacklist_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
