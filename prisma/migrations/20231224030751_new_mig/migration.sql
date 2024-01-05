-- CreateTable
CREATE TABLE `clients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `type` INTEGER NULL,
    `userID` VARCHAR(100) NOT NULL,

    INDEX `clients_FK`(`userID`),
    INDEX `clients_type_IDX`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `clientId` INTEGER NOT NULL,
    `info` VARCHAR(100) NOT NULL,
    `value` INTEGER NOT NULL,
    `alert` BOOLEAN NOT NULL,
    `lng` DECIMAL(18, 9) NOT NULL,
    `lat` DECIMAL(18, 9) NOT NULL,
    `report` TIMESTAMP(0) NOT NULL,

    INDEX `messages_clientId_IDX`(`clientId`),
    INDEX `messages_lng_IDX`(`lng`, `lat`),
    INDEX `messages_report_IDX`(`report`),
    PRIMARY KEY (`clientId`, `info`, `value`, `alert`, `lng`, `lat`, `report`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_FK` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
