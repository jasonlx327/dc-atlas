CREATE TABLE `admin_audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`before_json` text,
	`after_json` text,
	`reason` text NOT NULL,
	`run_id` text,
	`event_id` text,
	`source_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`run_id`) REFERENCES `ingestion_runs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_admin_audit_logs_created_at` ON `admin_audit_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_admin_audit_logs_targets` ON `admin_audit_logs` (`run_id`,`event_id`,`source_id`);--> statement-breakpoint
CREATE TABLE `entities` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`canonical_name` text NOT NULL,
	`name_zh` text,
	`name_en` text,
	`ticker` text,
	`country` text,
	`aliases_json` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_entities_canonical_name` ON `entities` (`canonical_name`);--> statement-breakpoint
CREATE INDEX `idx_entities_type_name` ON `entities` (`entity_type`,`canonical_name`);--> statement-breakpoint
CREATE TABLE `event_entities` (
	`event_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`role` text NOT NULL,
	`added_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`event_id`, `entity_id`, `role`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_event_entities_entity` ON `event_entities` (`entity_id`);--> statement-breakpoint
CREATE TABLE `event_facts` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`fact_type` text NOT NULL,
	`value_text` text,
	`value_number` real,
	`unit` text,
	`qualifier` text,
	`period_start` text,
	`period_end` text,
	`source_observation_id` text NOT NULL,
	`confidence_state` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_observation_id`) REFERENCES `observations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_event_facts_event_type` ON `event_facts` (`event_id`,`fact_type`);--> statement-breakpoint
CREATE INDEX `idx_event_facts_source` ON `event_facts` (`source_observation_id`);--> statement-breakpoint
CREATE TABLE `event_observations` (
	`event_id` text NOT NULL,
	`observation_id` text NOT NULL,
	`relationship` text NOT NULL,
	`is_independent_confirmation` integer DEFAULT false NOT NULL,
	`is_main` integer DEFAULT false NOT NULL,
	`added_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`event_id`, `observation_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`observation_id`) REFERENCES `observations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_event_observations_observation` ON `event_observations` (`observation_id`);--> statement-breakpoint
CREATE INDEX `idx_event_observations_relationship` ON `event_observations` (`relationship`);--> statement-breakpoint
CREATE TABLE `event_updates` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`status_from` text,
	`status_to` text NOT NULL,
	`change_type` text NOT NULL,
	`observed_at` text NOT NULL,
	`source_observation_id` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_observation_id`) REFERENCES `observations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_event_updates_event_observed` ON `event_updates` (`event_id`,`observed_at`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_key` text NOT NULL,
	`event_type` text NOT NULL,
	`title_zh` text NOT NULL,
	`title_en` text NOT NULL,
	`summary_zh` text NOT NULL,
	`summary_en` text NOT NULL,
	`first_seen_at` text NOT NULL,
	`last_updated_at` text NOT NULL,
	`event_time` text,
	`region` text NOT NULL,
	`evidence_status` text NOT NULL,
	`publication_state` text DEFAULT 'internal' NOT NULL,
	`main_observation_id` text,
	`strategy_version` text NOT NULL,
	`internal_priority` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`main_observation_id`) REFERENCES `observations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_events_event_key` ON `events` (`event_key`);--> statement-breakpoint
CREATE INDEX `idx_events_status_priority` ON `events` (`evidence_status`,`internal_priority`);--> statement-breakpoint
CREATE INDEX `idx_events_last_updated_at` ON `events` (`last_updated_at`);--> statement-breakpoint
CREATE TABLE `ingestion_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`trigger` text NOT NULL,
	`started_at` text NOT NULL,
	`finished_at` text,
	`status` text NOT NULL,
	`strategy_version` text NOT NULL,
	`fetched_count` integer DEFAULT 0 NOT NULL,
	`normalized_count` integer DEFAULT 0 NOT NULL,
	`classified_relevant_count` integer DEFAULT 0 NOT NULL,
	`deep_scored_count` integer DEFAULT 0 NOT NULL,
	`clustered_count` integer DEFAULT 0 NOT NULL,
	`published_count` integer DEFAULT 0 NOT NULL,
	`error_count` integer DEFAULT 0 NOT NULL,
	`summary_json` text DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `observation_analysis` (
	`observation_id` text PRIMARY KEY NOT NULL,
	`classifier_version` text NOT NULL,
	`topic_bucket` text NOT NULL,
	`is_relevant` integer NOT NULL,
	`uncertain` integer DEFAULT false NOT NULL,
	`topic_relevance_score` real,
	`mechanism_depth_score` real,
	`specificity_score` real,
	`research_value_score` real,
	`reader_value_score` real,
	`editor_judgment` text,
	`reason` text DEFAULT '' NOT NULL,
	`entities_json` text DEFAULT '[]' NOT NULL,
	`facts_json` text DEFAULT '[]' NOT NULL,
	`translated_title_zh` text,
	`translated_title_en` text,
	`summary_zh` text,
	`summary_en` text,
	`embedding_model` text,
	`embedding_ref` text,
	`analysis_status` text DEFAULT 'pending' NOT NULL,
	`analyzed_at` text,
	FOREIGN KEY (`observation_id`) REFERENCES `observations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `observations` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`endpoint_id` text NOT NULL,
	`canonical_url` text NOT NULL,
	`original_url` text NOT NULL,
	`external_id` text,
	`title_original` text NOT NULL,
	`summary_original` text DEFAULT '' NOT NULL,
	`language` text NOT NULL,
	`author` text,
	`published_at` text,
	`discovered_at` text NOT NULL,
	`fetched_at` text NOT NULL,
	`content_hash` text NOT NULL,
	`canonical_url_hash` text NOT NULL,
	`raw_payload_json` text DEFAULT '{}' NOT NULL,
	`access_status` text NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`endpoint_id`) REFERENCES `source_endpoints`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_observations_canonical_url_hash` ON `observations` (`canonical_url_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_observations_source_external_id` ON `observations` (`source_id`,`external_id`);--> statement-breakpoint
CREATE INDEX `idx_observations_published_at` ON `observations` (`published_at`);--> statement-breakpoint
CREATE INDEX `idx_observations_source_id` ON `observations` (`source_id`);--> statement-breakpoint
CREATE INDEX `idx_observations_content_hash` ON `observations` (`content_hash`);--> statement-breakpoint
CREATE TABLE `pipeline_stage_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`run_id` text NOT NULL,
	`stage` text NOT NULL,
	`observation_id` text,
	`event_id` text,
	`status` text NOT NULL,
	`duration_ms` integer,
	`model` text,
	`input_tokens` integer,
	`output_tokens` integer,
	`estimated_cost_usd` real,
	`retry_count` integer DEFAULT 0 NOT NULL,
	`error` text,
	`started_at` text NOT NULL,
	`finished_at` text,
	FOREIGN KEY (`run_id`) REFERENCES `ingestion_runs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`observation_id`) REFERENCES `observations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_pipeline_stage_runs_run_stage` ON `pipeline_stage_runs` (`run_id`,`stage`);--> statement-breakpoint
CREATE INDEX `idx_pipeline_stage_runs_observation` ON `pipeline_stage_runs` (`observation_id`);--> statement-breakpoint
CREATE INDEX `idx_pipeline_stage_runs_event` ON `pipeline_stage_runs` (`event_id`);--> statement-breakpoint
CREATE TABLE `publication_records` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`language` text NOT NULL,
	`route` text NOT NULL,
	`target` text NOT NULL,
	`publication_key` text NOT NULL,
	`published_at` text NOT NULL,
	`snapshot_version` text NOT NULL,
	`rollback_of` text,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_publication_records_key` ON `publication_records` (`event_id`,`language`,`target`);--> statement-breakpoint
CREATE INDEX `idx_publication_records_target_published` ON `publication_records` (`target`,`published_at`);--> statement-breakpoint
CREATE TABLE `scoring_versions` (
	`version` text PRIMARY KEY NOT NULL,
	`code_version` text NOT NULL,
	`classifier_version` text NOT NULL,
	`prompt_hash` text,
	`weights_json` text NOT NULL,
	`thresholds_json` text NOT NULL,
	`published_at` text NOT NULL,
	`replay_report_ref` text,
	`is_active` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `selection_decisions` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`strategy_version` text NOT NULL,
	`eligible` integer NOT NULL,
	`priority_score` real NOT NULL,
	`route` text NOT NULL,
	`reason_codes_json` text DEFAULT '[]' NOT NULL,
	`decided_at` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_selection_decisions_event_strategy` ON `selection_decisions` (`event_id`,`strategy_version`);--> statement-breakpoint
CREATE INDEX `idx_selection_decisions_route_priority` ON `selection_decisions` (`route`,`priority_score`);--> statement-breakpoint
CREATE TABLE `source_endpoints` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`endpoint_type` text NOT NULL,
	`url` text NOT NULL,
	`poll_interval_minutes` integer DEFAULT 60 NOT NULL,
	`parser_key` text NOT NULL,
	`access_notes` text DEFAULT '' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_source_endpoints_source_url` ON `source_endpoints` (`source_id`,`url`);--> statement-breakpoint
CREATE INDEX `idx_source_endpoints_enabled_poll` ON `source_endpoints` (`enabled`,`poll_interval_minutes`);--> statement-breakpoint
CREATE TABLE `source_sync_state` (
	`endpoint_id` text PRIMARY KEY NOT NULL,
	`cursor` text,
	`etag` text,
	`last_modified` text,
	`last_attempt_at` text,
	`last_success_at` text,
	`last_status` text DEFAULT 'never-run' NOT NULL,
	`consecutive_failures` integer DEFAULT 0 NOT NULL,
	`last_error` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`endpoint_id`) REFERENCES `source_endpoints`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sources` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`tier` text NOT NULL,
	`publisher_type` text NOT NULL,
	`region` text NOT NULL,
	`language` text NOT NULL,
	`independence_group` text NOT NULL,
	`topics_json` text DEFAULT '[]' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`access_notes` text DEFAULT '' NOT NULL,
	`copyright_notes` text DEFAULT '' NOT NULL,
	`last_attempt_at` text,
	`last_success_at` text,
	`last_http_status` integer,
	`last_response_ms` real,
	`etag` text,
	`last_modified` text,
	`consecutive_failures` integer DEFAULT 0 NOT NULL,
	`rolling_7d_success_rate` real,
	`last_new_count` integer DEFAULT 0 NOT NULL,
	`last_duplicate_count` integer DEFAULT 0 NOT NULL,
	`last_parse_error_count` integer DEFAULT 0 NOT NULL,
	`parser_version` text DEFAULT 'v1' NOT NULL,
	`last_error` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_sources_slug` ON `sources` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_sources_tier_enabled` ON `sources` (`tier`,`enabled`);--> statement-breakpoint
CREATE INDEX `idx_sources_health` ON `sources` (`last_success_at`,`consecutive_failures`);