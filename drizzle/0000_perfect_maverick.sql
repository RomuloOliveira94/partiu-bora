CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`registrante_nome` text NOT NULL,
	`quantidade_maxima` integer,
	`link_publico` text NOT NULL,
	`link_admin` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `participantes` (
	`id` integer PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`telefone` text NOT NULL,
	`evento_id` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_link_publico_unique` ON `users` (`link_publico`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_link_admin_unique` ON `users` (`link_admin`);