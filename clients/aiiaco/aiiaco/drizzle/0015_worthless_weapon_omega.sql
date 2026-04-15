CREATE TABLE `email_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`emailId` varchar(128) NOT NULL,
	`eventType` varchar(64) NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`leadId` int,
	`subject` varchar(512),
	`clickedLink` text,
	`clickUserAgent` text,
	`clickIpAddress` varchar(64),
	`eventTimestamp` timestamp,
	`rawPayload` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_events_id` PRIMARY KEY(`id`)
);
