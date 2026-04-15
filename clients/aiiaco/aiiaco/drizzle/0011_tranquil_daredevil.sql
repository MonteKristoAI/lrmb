CREATE TABLE `knowledge_base` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`category` enum('packages','company','processes','faq','other') NOT NULL DEFAULT 'other',
	`source` enum('document','website','conversation','manual') NOT NULL DEFAULT 'manual',
	`sourceFile` varchar(512),
	`isActive` int NOT NULL DEFAULT 1,
	`lastPushedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `knowledge_base_id` PRIMARY KEY(`id`)
);
