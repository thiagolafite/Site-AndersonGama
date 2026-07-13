import { Router } from "express";
import { db } from "@workspace/db";
import { contactsTable, insertContactSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// GET /api/contacts
router.get("/", async (req, res) => {
  try {
    const { read } = req.query as { read?: string };
    let query = db.select().from(contactsTable).$dynamic();

    if (read === "true") query = query.where(eq(contactsTable.read, true));
    if (read === "false") query = query.where(eq(contactsTable.read, false));

    const contacts = await query.orderBy(contactsTable.createdAt);
    const result = contacts.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    }));
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list contacts");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/contacts
router.post("/", async (req, res) => {
  try {
    const parsed = insertContactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation error", details: parsed.error.issues });
      return;
    }
    const [created] = await db.insert(contactsTable).values(parsed.data).returning();
    res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to create contact");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/contacts/:id
router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { read } = req.body as { read?: boolean };
    const updateData: Record<string, unknown> = {};
    if (read !== undefined) updateData.read = read;

    const [updated] = await db
      .update(contactsTable)
      .set(updateData)
      .where(eq(contactsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }
    res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update contact");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
