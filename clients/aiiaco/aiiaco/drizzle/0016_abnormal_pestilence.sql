CREATE TABLE `sms_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int,
	`phone` varchar(32) NOT NULL,
	`messageType` varchar(64) NOT NULL,
	`messageText` text NOT NULL,
	`telnyxMessageId` varchar(128),
	`smsStatus` enum('scheduled','queued','sent','delivered','failed','rate_limited') NOT NULL DEFAULT 'queued',
	`scheduledFor` timestamp,
	`sentAt` timestamp,
	`deliveredAt` timestamp,
	`errorMessage` text,
	`costAmount` varchar(16),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sms_events_id` PRIMARY KEY(`id`)
);
