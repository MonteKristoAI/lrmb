CREATE TABLE `magic_link_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`leadId` int NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`usedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `magic_link_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `magic_link_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `web_transcripts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int,
	`visitorName` varchar(255),
	`visitorEmail` varchar(320),
	`visitorPhone` varchar(64),
	`transcript` text NOT NULL,
	`transcriptText` text,
	`durationSeconds` int,
	`source` varchar(32) NOT NULL DEFAULT 'web_talk',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `web_transcripts_id` PRIMARY KEY(`id`)
);
