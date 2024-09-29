CREATE TABLE `eventos` (
	`id` integer PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`registrante_nome` text NOT NULL,
	`registrante_whatsapp` text NOT NULL,
	`imagem_url` text,
	`quantidade_maxima` integer,
	`link_publico` text NOT NULL,
	`link_admin` text NOT NULL,
	`data` numeric NOT NULL,
	`data_da_criacao` numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE `participantes` (
	`id` integer PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`avatar_url` text NOT NULL,
	`telefone` text NOT NULL,
	`evento_id` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `eventos_link_publico_unique` ON `eventos` (`link_publico`);--> statement-breakpoint
CREATE UNIQUE INDEX `eventos_link_admin_unique` ON `eventos` (`link_admin`);