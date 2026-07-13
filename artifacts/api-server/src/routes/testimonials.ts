import { Router } from "express";
import { db } from "@workspace/db";
import { testimonialsTable, insertTestimonialSchema } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

// GET /api/testimonials
router.get("/", async (req, res) => {
  try {
    const { featured } = req.query as { featured?: string };
    let query = db.select().from(testimonialsTable).$dynamic();

    if (featured === "true") {
      query = query.where(and(
        eq(testimonialsTable.approved, true),
        eq(testimonialsTable.featured, true)
      ));
    } else {
      query = query.where(eq(testimonialsTable.approved, true));
    }

    const testimonials = await query.orderBy(testimonialsTable.createdAt);
    const result = testimonials.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
    }));
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list testimonials");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/testimonials
router.post("/", async (req, res) => {
  try {
    const parsed = insertTestimonialSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation error", details: parsed.error.issues });
      return;
    }
    const [created] = await db.insert(testimonialsTable).values(parsed.data).returning();
    res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to create testimonial");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/testimonials/:id
router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { studentName, goalType, content, weightLost, duration, beforeImageUrl, afterImageUrl, featured, approved } = req.body;
    const updateData: Record<string, unknown> = {};
    if (studentName !== undefined) updateData.studentName = studentName;
    if (goalType !== undefined) updateData.goalType = goalType;
    if (content !== undefined) updateData.content = content;
    if (weightLost !== undefined) updateData.weightLost = weightLost;
    if (duration !== undefined) updateData.duration = duration;
    if (beforeImageUrl !== undefined) updateData.beforeImageUrl = beforeImageUrl;
    if (afterImageUrl !== undefined) updateData.afterImageUrl = afterImageUrl;
    if (featured !== undefined) updateData.featured = featured;
    if (approved !== undefined) updateData.approved = approved;

    const [updated] = await db
      .update(testimonialsTable)
      .set(updateData)
      .where(eq(testimonialsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update testimonial");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/testimonials/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete testimonial");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
