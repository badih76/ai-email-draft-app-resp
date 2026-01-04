CREATE TABLE `email_drafts` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`recipRoll` varchar(255) DEFAULT '',
	`senderRoll` varchar(255) DEFAULT '',
	`emailTone` int DEFAULT 0,
	`emailDetails` text,
	`createDateTime` datetime DEFAULT '2025-12-08 01:10:56.199',
	`deleted` boolean DEFAULT false,
	`enabled` boolean DEFAULT true,
	CONSTRAINT `email_drafts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`profileImage` varchar(255) NOT NULL,
	`userSettings` text DEFAULT (''),
	`createdAt` datetime DEFAULT '2025-12-08 01:10:56.198',
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
