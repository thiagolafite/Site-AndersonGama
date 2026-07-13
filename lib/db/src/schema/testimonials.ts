import { pgTable, serial, text, timestamp, boolean, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const testimonialGoalEnum = pgEnum("testimonial_goal_type", [
  "emagrecimento",
  "hipertrofia",
  "condicionamento",
  "iniciantes",
]);

export const testimonialsTable = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  goalType: testimonialGoalEnum("goal_type").notNull(),
  content: text("content").notNull(),
  weightLost: real("weight_lost"),
  duration: text("duration").notNull(),
  beforeImageUrl: text("before_image_url"),
  afterImageUrl: text("after_image_url"),
  featured: boolean("featured").notNull().default(false),
  approved: boolean("approved").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonialsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonialsTable.$inferSelect;
