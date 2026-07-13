import { Router } from "express";
import { db } from "@workspace/db";
import { blogPostsTable, insertBlogPostSchema } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

// GET /api/blog
router.get("/", async (req, res) => {
  try {
    const { category, limit, published } = req.query as {
      category?: string;
      limit?: string;
      published?: string;
    };
    let query = db.select().from(blogPostsTable).$dynamic();

    const conditions = [];
    if (published === "true") conditions.push(eq(blogPostsTable.published, true));
    if (published === "false") conditions.push(eq(blogPostsTable.published, false));
    if (category) {
      conditions.push(eq(blogPostsTable.category, category as "treino" | "alimentacao" | "emagrecimento" | "hipertrofia" | "saude"));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const posts = await query.orderBy(blogPostsTable.createdAt);
    const result = posts.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list blog posts");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/blog
router.post("/", async (req, res) => {
  try {
    const parsed = insertBlogPostSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation error", details: parsed.error.issues });
      return;
    }
    const [created] = await db.insert(blogPostsTable).values(parsed.data).returning();
    res.status(201).json({
      ...created,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/blog/:id
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [post] = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.id, id));
    if (!post) {
      res.status(404).json({ error: "Blog post not found" });
      return;
    }
    res.json({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/blog/:id
router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, slug, category, excerpt, content, imageUrl, published } = req.body;
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (category !== undefined) updateData.category = category;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (published !== undefined) updateData.published = published;

    const [updated] = await db
      .update(blogPostsTable)
      .set(updateData)
      .where(eq(blogPostsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Blog post not found" });
      return;
    }
    res.json({
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/blog/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
