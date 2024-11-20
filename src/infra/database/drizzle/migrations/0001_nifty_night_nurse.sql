ALTER TABLE "documents" RENAME COLUMN "totalTaxes" TO "total_taxes";--> statement-breakpoint
ALTER TABLE "documents" RENAME COLUMN "netValue" TO "net_value";--> statement-breakpoint
ALTER TABLE "documents" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "documents" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "documents" RENAME COLUMN "originId" TO "origin_id";--> statement-breakpoint
ALTER TABLE "documents" RENAME COLUMN "typeId" TO "type_id";--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_originId_document_origins_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_typeId_document_types_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_origin_id_document_origins_id_fk" FOREIGN KEY ("origin_id") REFERENCES "public"."document_origins"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_type_id_document_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."document_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
