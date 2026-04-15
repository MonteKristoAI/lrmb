CREATE TABLE `agent_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateKey` varchar(64) NOT NULL,
	`displayName` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`defaultPrompt` text NOT NULL,
	`defaultFirstMessage` text NOT NULL,
	`defaultKnowledgeBase` text,
	`icon` varchar(32),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agent_templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `agent_templates_templateKey_unique` UNIQUE(`templateKey`)
);
--> statement-breakpoint
CREATE TABLE `client_agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`agentName` varchar(255) NOT NULL,
	`templateType` enum('real_estate','mortgage','law','hospitality','manufacturing') NOT NULL,
	`elevenlabsAgentId` varchar(128),
	`personality` text,
	`firstMessage` text,
	`knowledgeBase` text,
	`voiceId` varchar(128),
	`voiceTier` enum('free','premium') NOT NULL DEFAULT 'free',
	`widgetConfig` text,
	`embedToken` varchar(128) NOT NULL,
	`agentStatus` enum('draft','active','paused','locked') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_agents_id` PRIMARY KEY(`id`),
	CONSTRAINT `client_agents_embedToken_unique` UNIQUE(`embedToken`)
);
--> statement-breakpoint
CREATE TABLE `client_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientAgentId` int NOT NULL,
	`clientId` int NOT NULL,
	`elevenlabsConversationId` varchar(128),
	`callerName` varchar(255),
	`callerEmail` varchar(320),
	`callerPhone` varchar(64),
	`transcript` text,
	`structuredTranscript` text,
	`intelligenceSummary` text,
	`painPoints` text,
	`wants` text,
	`durationSeconds` int,
	`leadScore` int,
	`conversationStatus` enum('new','reviewed','contacted','converted','archived') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `client_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`websiteUrl` varchar(512),
	`phone` varchar(64),
	`industry` varchar(128),
	`clientStatus` enum('trial','active','suspended','cancelled') NOT NULL DEFAULT 'trial',
	`stripeCustomerId` varchar(128),
	`stripeSubscriptionId` varchar(128),
	`promoCodeUsed` varchar(64),
	`monthlyPriceCents` int NOT NULL DEFAULT 99900,
	`trialSecondsUsed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `promo_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`discountType` enum('fixed','percent') NOT NULL,
	`discountValue` int NOT NULL,
	`resultPriceCents` int,
	`maxUses` int,
	`usesCount` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `promo_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `promo_codes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `voice_tiers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`voiceId` varchar(128) NOT NULL,
	`name` varchar(128) NOT NULL,
	`description` text,
	`previewUrl` varchar(512),
	`tier` enum('free','premium') NOT NULL DEFAULT 'free',
	`monthlyCostCents` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `voice_tiers_id` PRIMARY KEY(`id`),
	CONSTRAINT `voice_tiers_voiceId_unique` UNIQUE(`voiceId`)
);
