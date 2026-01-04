import { int, mysqlTable, varchar, text, float, boolean, datetime, timestamp } from 'drizzle-orm/mysql-core';
import { v4 as uuidv4 } from 'uuid';

export const Users = mysqlTable('users', {
    id: varchar({ length: 255 }).primaryKey(),
  
    email: varchar({ length: 255 }).notNull().unique(),
    firstName: varchar({ length: 255 }).notNull(),
    lastName: varchar({ length: 255 }).notNull(),
    profileImage: varchar({ length: 255 }).notNull(),
    userSettings: text().default(''),

    createdAt: datetime().default(new Date())

});

export const EmailDrafts = mysqlTable('email_drafts', {
    id: varchar({ length: 255 }).$defaultFn(() => uuidv4()).primaryKey(),

    userId: varchar({ length: 255 }).notNull(),

    title: varchar({ length: 255 }).notNull(),
    recipRole: varchar({ length: 255 }).default(""),
    senderRole: varchar({ length: 255 }).default(""),
    emailTone: varchar({ length: 100 }).default(""),
    emailDetails: text(),
    generatedEmail: text(),
    
    createDateTime: datetime().default(new Date()),
    deleted: boolean().default(false)
});

export const UserMetrics = mysqlTable('user_metrics', {
    userId: varchar({ length: 255 }).notNull().primaryKey(),
    monthlyGenerationlimit: int().default(1000),
    draftSaveLimit: int().default(1000),
    userPlan: int().default(1)
});

export const DraftsGenerationLog = mysqlTable('drafts_generation_track', {
    id: int().autoincrement().primaryKey(),
    userId: varchar({ length: 255}).notNull(),
    generatedOn: timestamp('generatedOn').defaultNow()
});


// export const Settings = mysqlTable('settings', {
//     id: varchar({ length: 255 }).$defaultFn(() => uuidv4()).primaryKey(),
//     setAppName: varchar({ length: 100 }).default('Dar B&B'),
//     setLogo: text()
// })
