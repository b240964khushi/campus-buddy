import { Router } from "express";
import { Demand } from "../models/Demand";
import { requireAuth, type AuthRequest } from "../middlewares/auth";
import { User } from "../models/User";
import type { Response } from "express";

const router = Router();

router.get("/demands", async (req, res) => {
  try {
    const demands = await Demand.find().sort({ createdAt: -1 });
    res.json(
      demands.map((d) => ({
        id: String(d._id),
        itemName: d.itemName,
        description: d.description,
        budget: d.budget ?? null,
        posterName: d.posterName,
        posterWhatsapp: d.posterWhatsapp,
        posterId: d.posterId,
        createdAt: d.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "List demands error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/demands", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { itemName, description, budget, posterWhatsapp } = req.body;

    if (!itemName || !description || !posterWhatsapp) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const user = await User.findById(req.user!.userId);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const demand = await Demand.create({
      itemName,
      description,
      budget: budget != null ? Number(budget) : null,
      posterName: user.name,
      posterWhatsapp,
      posterId: String(user._id),
    });

    res.status(201).json({
      id: String(demand._id),
      itemName: demand.itemName,
      description: demand.description,
      budget: demand.budget ?? null,
      posterName: demand.posterName,
      posterWhatsapp: demand.posterWhatsapp,
      posterId: demand.posterId,
      createdAt: demand.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Create demand error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/demands/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const demand = await Demand.findById(req.params["id"]);
    if (!demand) {
      res.status(404).json({ error: "Demand not found" });
      return;
    }
    if (demand.posterId !== req.user!.userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    await demand.deleteOne();
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Delete demand error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
