require("dotenv").config();
require("../db");

const TasteItem = require("../models/TasteItem.model");
const data = require("./tastes.json"); // 👈 path to YOUR json

async function seed() {
  try {
    console.log("🌱 Seeding taste items from JSON...");

    const allowedCategories = ["movie", "show", "game", "artist"];

    const tasteItems = data.tasteItems
      .filter(item => allowedCategories.includes(item.type))
      .map(item => ({
        name: item.name,
        category: item.type,
      }));

    await TasteItem.deleteMany();
    await TasteItem.insertMany(tasteItems);

    console.log(`✅ Seeded ${tasteItems.length} taste items`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
