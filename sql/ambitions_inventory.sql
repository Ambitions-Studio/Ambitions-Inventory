CREATE TABLE IF NOT EXISTS `inventories` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `type` VARCHAR(24) NOT NULL,
  `owner_type` VARCHAR(24) NOT NULL,
  `owner_id` BIGINT UNSIGNED DEFAULT NULL,
  `owner_ref` VARCHAR(128) DEFAULT NULL,
  `label` VARCHAR(64) DEFAULT NULL,
  `max_slots` SMALLINT UNSIGNED NOT NULL DEFAULT 40,
  `max_weight` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_type_owner_id` (`type`, `owner_type`, `owner_id`),
  INDEX `idx_type_owner_ref` (`type`, `owner_type`, `owner_ref`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `inventory_items` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `inventory_id` BIGINT UNSIGNED NOT NULL,
  `slot` SMALLINT UNSIGNED NOT NULL,
  `item` VARCHAR(64) NOT NULL,
  `count` INT UNSIGNED NOT NULL DEFAULT 1,
  `uid` CHAR(26) DEFAULT NULL,
  `serial` VARCHAR(64) DEFAULT NULL,
  `owner_character_id` BIGINT UNSIGNED DEFAULT NULL,
  `meta` JSON DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_inventory_slot` (`inventory_id`, `slot`),
  UNIQUE KEY `uniq_uid` (`uid`),
  INDEX `idx_inventory_id` (`inventory_id`),
  INDEX `idx_inventory_item` (`inventory_id`, `item`),
  INDEX `idx_serial` (`serial`),
  INDEX `idx_owner_character` (`owner_character_id`),
  FOREIGN KEY (`inventory_id`) REFERENCES `inventories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `characters`
  ADD COLUMN IF NOT EXISTS `inventory_id` BIGINT UNSIGNED DEFAULT NULL,
  ADD INDEX `idx_inventory_id` (`inventory_id`),
  ADD CONSTRAINT `fk_character_inventory`
  FOREIGN KEY (`inventory_id`) REFERENCES `inventories`(`id`) ON DELETE SET NULL;



DROP TRIGGER IF EXISTS `trg_characters_delete_inventories`;

DELIMITER $$

CREATE TRIGGER `trg_characters_delete_inventories`
AFTER DELETE ON `characters`
FOR EACH ROW
BEGIN
  DELETE FROM `inventories`
  WHERE `type` = 'player'
    AND `owner_type` = 'character'
    AND `owner_id` = OLD.`id`;
END$$

DELIMITER ;
