import { date, decimal, integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const documentsTable = pgTable('documents', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  emitter: varchar({ length: 255 }).notNull(),
  totalTaxes: decimal('total_taxes', { precision: 10, scale: 2 }).notNull(),
  netValue: decimal('net_value', { precision: 10, scale: 2 }).notNull(),
  originId: integer('origin_id').references(() => documentOriginsTable.id).notNull(),
  typeId: integer('type_id').references(() => documentTypesTable.id).notNull(),
  filePath: varchar({ length: 255 }),
  createdAt: date('created_at').defaultNow().notNull(),
  updatedAt: date('updated_at').defaultNow().notNull(),
})

export const documentOriginsTable = pgTable('document_origins', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
})

export const documentTypesTable = pgTable('document_types', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
})
