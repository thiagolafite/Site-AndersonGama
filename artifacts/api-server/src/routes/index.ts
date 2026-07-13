import { Router, type IRouter } from "express";
import healthRouter from "./health";
import appointmentsRouter from "./appointments";
import testimonialsRouter from "./testimonials";
import blogRouter from "./blog";
import contactsRouter from "./contacts";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/appointments", appointmentsRouter);
router.use("/testimonials", testimonialsRouter);
router.use("/blog", blogRouter);
router.use("/contacts", contactsRouter);
router.use("/admin", adminRouter);

export default router;
