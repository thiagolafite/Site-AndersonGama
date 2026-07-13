import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable, insertAppointmentSchema } from "@workspace/db";
import { eq, count, and, gte, sql } from "drizzle-orm";

const router = Router();

// GET /api/appointments
router.get("/", async (req, res) => {
  try {
    const { status, date } = req.query as { status?: string; date?: string };
    let query = db.select().from(appointmentsTable).$dynamic();

    if (status && ["pending", "confirmed", "cancelled"].includes(status)) {
      query = query.where(eq(appointmentsTable.status, status as "pending" | "confirmed" | "cancelled"));
    }

    const appointments = await query.orderBy(appointmentsTable.createdAt);
    const result = appointments.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    }));
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list appointments");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/appointments
router.post("/", async (req, res) => {
  try {
    const parsed = insertAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation error", details: parsed.error.issues });
      return;
    }
    const [created] = await db.insert(appointmentsTable).values(parsed.data).returning();
    res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to create appointment");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/appointments/stats
router.get("/stats", async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalRow] = await db.select({ count: count() }).from(appointmentsTable);
    const [pendingRow] = await db
      .select({ count: count() })
      .from(appointmentsTable)
      .where(eq(appointmentsTable.status, "pending"));
    const [confirmedRow] = await db
      .select({ count: count() })
      .from(appointmentsTable)
      .where(eq(appointmentsTable.status, "confirmed"));
    const [cancelledRow] = await db
      .select({ count: count() })
      .from(appointmentsTable)
      .where(eq(appointmentsTable.status, "cancelled"));
    const [thisMonthRow] = await db
      .select({ count: count() })
      .from(appointmentsTable)
      .where(gte(appointmentsTable.createdAt, startOfMonth));

    res.json({
      total: Number(totalRow.count),
      pending: Number(pendingRow.count),
      confirmed: Number(confirmedRow.count),
      cancelled: Number(cancelledRow.count),
      thisMonth: Number(thisMonthRow.count),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get appointment stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/appointments/:id
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [appointment] = await db
      .select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, id));
    if (!appointment) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }
    res.json({ ...appointment, createdAt: appointment.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to get appointment");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/appointments/:id
router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, notes } = req.body as { status?: string; notes?: string };
    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const [updated] = await db
      .update(appointmentsTable)
      .set(updateData)
      .where(eq(appointmentsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }
    res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update appointment");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/appointments/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(appointmentsTable).where(eq(appointmentsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete appointment");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
