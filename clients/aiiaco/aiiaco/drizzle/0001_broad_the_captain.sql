CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('call','intake') NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(255),
	`phone` varchar(64),
	`industry` varchar(128),
	`engagementModel` varchar(128),
	`annualRevenue` varchar(64),
	`message` text,
	`status` enum('new','reviewed','contacted','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
