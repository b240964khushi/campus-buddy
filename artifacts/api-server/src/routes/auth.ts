import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { generateToken, requireAuth, type AuthRequest } from "../middlewares/auth";
import type { Response } from "express";

const router = Router();

router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, college, year } = req.body;

    if (!name || !email || !password || !college || !year) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, college, year, password: hashed });

    const token = generateToken(String(user._id), user.email);

    res.status(201).json({
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        college: user.college,
        year: user.year,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Register error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken(String(user._id), user.email);

    res.json({
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        college: user.college,
        year: user.year,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/auth/me", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    res.json({
      id: String(user._id),
      name: user.name,
      email: user.email,
      college: user.college,
      year: user.year,
    });
  } catch (err) {
    req.log.error({ err }, "Get me error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
