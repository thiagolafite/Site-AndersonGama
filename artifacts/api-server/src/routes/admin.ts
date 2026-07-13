import { Router } from "express";
import { db } from "@workspace/db";
import {
  appointmentsTable,
  testimonialsTable,
  blogPostsTable,
  contactsTable,
} from "@workspace/db";
import { eq, count, gte } from "drizzle-orm";

const router = Router();

// GET /api/admin/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalAppts] = await db.select({ count: count() }).from(appointmentsTable);
    const [pendingAppts] = await db
      .select({ count: count() })
      .from(appointmentsTable)
      .where(eq(appointmentsTable.status, "pending"));
    const [confirmedAppts] = await db
      .select({ count: count() })
      .from(appointmentsTable)
      .where(eq(appointmentsTable.status, "confirmed"));
    const [apptThisMonth] = await db
      .select({ count: count() })
      .from(appointmentsTable)
      .where(gte(appointmentsTable.createdAt, startOfMonth));

    const [totalTestimonials] = await db.select({ count: count() }).from(testimonialsTable);

    const [totalPosts] = await db.select({ count: count() }).from(blogPostsTable);
    const [publishedPosts] = await db
      .select({ count: count() })
      .from(blogPostsTable)
      .where(eq(blogPostsTable.published, true));

    const [totalContacts] = await db.select({ count: count() }).from(contactsTable);
    const [unreadContacts] = await db
      .select({ count: count() })
      .from(contactsTable)
      .where(eq(contactsTable.read, false));
    const [contactsThisMonth] = await db
      .select({ count: count() })
      .from(contactsTable)
      .where(gte(contactsTable.createdAt, startOfMonth));

    res.json({
      totalAppointments: Number(totalAppts.count),
      pendingAppointments: Number(pendingAppts.count),
      confirmedAppointments: Number(confirmedAppts.count),
      totalTestimonials: Number(totalTestimonials.count),
      totalBlogPosts: Number(totalPosts.count),
      publishedBlogPosts: Number(publishedPosts.count),
      totalContacts: Number(totalContacts.count),
      unreadContacts: Number(unreadContacts.count),
      appointmentsThisMonth: Number(apptThisMonth.count),
      contactsThisMonth: Number(contactsThisMonth.count),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
