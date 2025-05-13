import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { ProjectStatus, ProcessType, ProjectResult, InventoryType, DeliveryType } from './type';
import { relations } from 'drizzle-orm';

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('user').$type<'user' | 'admin'>(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const eqBoard = pgTable('eq_board', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: text('name').notNull(),
  pc: text('pc'),
  type: text('type').notNull().$type<'pdf' | 'png'>(),
  file_url: text('file_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const project = pgTable('project', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').notNull().default('none').$type<ProjectStatus>(),
  imageUrl: text('image_url'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  event: text('event').notNull(),
  carType: text('car_type').notNull(),
  part: text('part').notNull(),
  quantity: integer('quantity').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projectRelations = relations(project, ({ many }) => ({
  features: many(feature),
  processes: many(process),
  lots: many(lot),
}));

export const feature = pgTable('feature', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  projectId: uuid('project_id')
    .references(() => project.id, { onDelete: 'cascade' })
    .notNull(),
});

export const featureRelations = relations(feature, ({ one }) => ({
  project: one(project, {
    fields: [feature.projectId],
    references: [project.id],
  }),
}));

export const process = pgTable('process', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull().default('process1').$type<ProcessType>(),
  imageUrl: text('image_url'),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  projectId: uuid('project_id')
    .references(() => project.id, { onDelete: 'cascade' })
    .notNull(),
});

export const processRelations = relations(process, ({ one, many }) => ({
  project: one(project, {
    fields: [process.projectId],
    references: [project.id],
  }),
  lotProcesses: many(lotProcess),
  processInventories: many(processInventory),
}));

export const lot = pgTable('lot', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  code: text('code').notNull(),
  status: text('status').notNull().default('none').$type<ProjectStatus>(),
  result: text('result').notNull().default('none').$type<ProjectResult>(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  projectId: uuid('project_id')
    .references(() => project.id, { onDelete: 'cascade' })
    .notNull(),
  featureId: uuid('feature_id')
    .references(() => feature.id, { onDelete: 'cascade' })
    .notNull(),
});

export const lotRelations = relations(lot, ({ one, many }) => ({
  project: one(project, {
    fields: [lot.projectId],
    references: [project.id],
  }),
  feature: one(feature, {
    fields: [lot.featureId],
    references: [feature.id],
  }),
  lotProcesses: many(lotProcess),
}));

export const lotProcess = pgTable('lot_process', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  status: text('status').notNull().default('none').$type<ProjectStatus>(),
  result: text('result').notNull().default('none').$type<ProjectResult>(),
  imageUrl: text('image_url'),
  date: timestamp('date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lotId: uuid('lot_id')
    .references(() => lot.id, { onDelete: 'cascade' })
    .notNull(),
  processId: uuid('process_id')
    .references(() => process.id, { onDelete: 'cascade' })
    .notNull(),
});

export const lotProcessRelations = relations(lotProcess, ({ one }) => ({
  lot: one(lot, {
    fields: [lotProcess.lotId],
    references: [lot.id],
  }),
  process: one(process, {
    fields: [lotProcess.processId],
    references: [process.id],
  }),
}));

export const inventory = pgTable('inventory', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  supplier: text('supplier').notNull(),
  quantity: integer('quantity').notNull().default(0),
  date: timestamp('date'),
  type: text('type').notNull().default('in').$type<InventoryType>(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const inventoryRelations = relations(inventory, ({ many }) => ({
  partInventories: many(partInventory),
}));

export const partInventory = pgTable('part_inventory', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  quantity: integer('quantity').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  inventoryId: uuid('inventory_id')
    .references(() => inventory.id, { onDelete: 'cascade' })
    .notNull(),
});

export const partInventoryRelations = relations(partInventory, ({ one }) => ({
  inventory: one(inventory, {
    fields: [partInventory.inventoryId],
    references: [inventory.id],
  }),
}));

export const processInventory = pgTable('process_inventory', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  quantity: integer('quantity').notNull().default(0),
  date: timestamp('date'),
  type: text('type').notNull().default('production').$type<DeliveryType>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  processId: uuid('process_id')
    .references(() => process.id, { onDelete: 'cascade' })
    .notNull(),
});

export const processInventoryRelations = relations(processInventory, ({ one }) => ({
  process: one(process, {
    fields: [processInventory.processId],
    references: [process.id],
  }),
}));
