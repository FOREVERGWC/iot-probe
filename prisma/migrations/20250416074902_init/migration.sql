-- CreateTable
CREATE TABLE `device` (
    `device_id` VARCHAR(18) NOT NULL,
    `latest_device_log_id` INTEGER NOT NULL,
    `intranet_array` VARCHAR(300) NOT NULL,
    `extranet_array` VARCHAR(300) NOT NULL,
    `heartbeat` VARCHAR(3) NOT NULL,
    `is_online` BOOLEAN NOT NULL,
    `serial_tx` VARCHAR(200) NOT NULL,
    `alias_name` VARCHAR(20) NOT NULL DEFAULT '',
    `user_id` INTEGER NULL,

    INDEX `device_user_id_idx`(`user_id`),
    PRIMARY KEY (`device_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `device_change_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_id` VARCHAR(18) NULL,
    `device_log_before` INTEGER NOT NULL,
    `device_log_after` INTEGER NOT NULL,
    `online` INTEGER NOT NULL,
    `update_time` DATETIME(0) NULL,
    `card_number` BOOLEAN NULL,
    `iccid` BOOLEAN NULL,
    `electric` INTEGER NULL,
    `ethernet` INTEGER NULL,
    `ip` BOOLEAN NULL,
    `gateway` BOOLEAN NULL,
    `intranet_ping` BOOLEAN NULL,
    `intranet_ping_large` BOOLEAN NULL,
    `intranet_ping_array` BOOLEAN NULL,
    `extranet_ping` BOOLEAN NULL,
    `extranet_ping_large` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `device_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_id` VARCHAR(18) NULL,
    `update_time` DATETIME(0) NULL,
    `card_number` VARCHAR(15) NULL,
    `iccid` VARCHAR(21) NULL,
    `electric` VARCHAR(15) NULL,
    `ethernet` VARCHAR(15) NULL,
    `ip` VARCHAR(15) NULL,
    `gateway` VARCHAR(15) NULL,
    `intranet_ping` VARCHAR(8) NULL,
    `intranet_ping_large` VARCHAR(8) NULL,
    `intranet_ping_array` VARCHAR(300) NULL,
    `extranet_ping` VARCHAR(8) NULL,
    `extranet_ping_large` VARCHAR(8) NULL,
    `serial_rx` VARCHAR(1000) NULL,
    `serial_tx` VARCHAR(200) NULL,
    `signal_quality_rssi` INTEGER NOT NULL,
    `firmware_version` VARCHAR(50) NOT NULL,
    `importance_level` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL,
    `password` VARCHAR(80) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `level` INTEGER NOT NULL,
    `remark` VARCHAR(50) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `sort` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_role_link` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,

    INDEX `user_role_link_user_id_idx`(`user_id`),
    INDEX `user_role_link_role_id_idx`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `code` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(20) NOT NULL,
    `code` VARCHAR(4) NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enclosure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `key` VARCHAR(20) NOT NULL,
    `file_path` VARCHAR(50) NOT NULL,
    `file_name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
