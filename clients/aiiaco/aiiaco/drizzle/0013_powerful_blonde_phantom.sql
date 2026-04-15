ALTER TABLE `leads` ADD `emailStatus` enum('pending','sent','failed','not_applicable') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `emailSentAt` timestamp;