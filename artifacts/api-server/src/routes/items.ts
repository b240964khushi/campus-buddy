import { Router } from "express";
import { Item } from "../models/Item";
import { requireAuth, type AuthRequest } from "../middlewares/auth";
import { User } from "../models/User";
import type { Response } from "express";

const router = Router();

router.get("/items", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(
      items.map((item) => ({
        id: String(item._id),
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description,
        condition: item.condition ?? "",
        sellerName: item.sellerName,
        sellerWhatsapp: item.sellerWhatsapp,
        sellerId: item.sellerId,
        createdAt: item.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "List items error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/items/stats", async (req, res) => {
  try {
    const total = await Item.countDocuments();
    const categories = await Item.distinct("category");
    const priceAgg = await Item.aggregate([{ $group: { _id: null, avg: { $avg: "$price" } } }]);
    const avgPrice = priceAgg[0]?.avg ?? 0;
    res.json({ total, categories: categories.length, avgPrice: Math.round(avgPrice * 100) / 100 });
  } catch (err) {
    req.log.error({ err }, "Item stats error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/items", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, category, description, condition, sellerWhatsapp } = req.body;

    if (!name || price == null || !category || !description || !sellerWhatsapp) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const user = await User.findById(req.user!.userId);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const item = await Item.create({
      name,
      price: Number(price),
      category,
      description,
      condition: condition ?? "",
      sellerName: user.name,
      sellerWhatsapp,
      sellerId: String(user._id),
    });

    res.status(201).json({
      id: String(item._id),
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      condition: item.condition ?? "",
      sellerName: item.sellerName,
      sellerWhatsapp: item.sellerWhatsapp,
      sellerId: item.sellerId,
      createdAt: item.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Create item error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/items/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const item = await Item.findById(req.params["id"]);
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    if (item.sellerId !== req.user!.userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    await item.deleteOne();
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Delete item error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
