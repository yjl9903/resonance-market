CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`source_city` text NOT NULL,
	`target_city` text NOT NULL,
	`mileage` integer NOT NULL,
	`base_price` integer NOT NULL,
	FOREIGN KEY (`target_city`,`name`) REFERENCES `products`(`city`,`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE products ADD `valuable` integer DEFAULT true;--> statement-breakpoint
ALTER TABLE products ADD `base_volume` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE products ADD `base_price` integer DEFAULT 0;