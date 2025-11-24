import { Router } from "express"
import { createPost } from "../controllers/post.controller"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { Role } from "../models/User"
import { upload } from "../middleware/upload"

const router = Router()

// ADMIN & AUTHOR can create posts
router.post(
  "/create",
  authenticate,
  requireRole([Role.ADMIN, Role.AUTHOR]),
  upload.single("image"), //form data
  createPost
)

export default router