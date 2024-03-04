CREATE TABLE `logs` (
	`id` integer NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`type` text NOT NULL,
	`price` integer NOT NULL,
	`percent` integer NOT NULL,
	`uploaded_at` integer NOT NULL,
	FOREIGN KEY (`name`) REFERENCES `products`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`name` text PRIMARY KEY NOT NULL,
	`city` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
