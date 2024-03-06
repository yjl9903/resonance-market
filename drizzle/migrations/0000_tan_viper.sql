CREATE TABLE `logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`source_city` text NOT NULL,
	`target_city` text NOT NULL,
	`type` text NOT NULL,
	`trend` text NOT NULL,
	`price` integer NOT NULL,
	`percent` integer NOT NULL,
	`uploaded_at` integer NOT NULL,
	`uploader_id` integer NOT NULL,
	FOREIGN KEY (`uploader_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_city`,`name`) REFERENCES `products`(`city`,`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`name` text NOT NULL,
	`city` text NOT NULL,
	`type` text NOT NULL,
	`valuable` integer NOT NULL,
	`base_volume` integer,
	`base_price` integer NOT NULL,
	`cost` integer,
	PRIMARY KEY(`city`, `name`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`source_city` text NOT NULL,
	`target_city` text NOT NULL,
	`mileage` integer NOT NULL,
	`base_price` integer NOT NULL,
	FOREIGN KEY (`source_city`,`name`) REFERENCES `products`(`city`,`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `logs_name_source_city_target_city_uploaded_at_unique` ON `logs` (`name`,`source_city`,`target_city`,`uploaded_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_name_source_city_target_city_unique` ON `transactions` (`name`,`source_city`,`target_city`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_name_unique` ON `users` (`name`);