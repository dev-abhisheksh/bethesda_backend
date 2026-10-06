import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import Project from "../modules/project/project.model.js";

const initialProjects = [
  {
    order: 0,
    icon: "👪",
    color: "pu",
    title: "Family Care & Counselling",
    desc: "Support for families affected by HIV/AIDS with groceries, counselling, encouragement and moral support.",
    goal: "To remind families that they are not alone.",
    aboutText:
      "Bethesda Charitable Trust, together with its volunteers, visits established elderly care and children’s homes to provide compassionate humanitarian service. Through food assistance, encouragement, counselling, and practical care, we bring dignity, hope, and a sense of belonging to those in need.",
    photos: [],
    isVisible: true,
  },
  {
    order: 1,
    icon: "📖",
    color: "bl",
    title: "Project Hope Thru Education",
    desc: "Educational assistance and essential school materials for children from disadvantaged families.",
    goal: "Helping children pursue education with confidence and hope.",
    aboutText:
      "Project Hope Thru Education ensures that financial constraints do not stand between a child and their education. We provide school kits, uniforms, textbooks, tuition support, and mentorship to equip children for a brighter future.",
    photos: [],
    isVisible: true,
  },
  {
    order: 2,
    icon: "🧒",
    color: "gr",
    title: "Morning Star Play School",
    desc: "Early childhood education and care in a safe and nurturing environment.",
    goal: "Building a strong foundation for the next generation.",
    aboutText:
      "Morning Star Play School creates a loving, supportive, and stimulating environment for young children during their critical early developmental years, preparing them with fundamental learning, nutrition, and values.",
    photos: [],
    isVisible: true,
  },
  {
    order: 3,
    icon: "🍲",
    color: "or",
    title: "Project SMS",
    desc: "Meals and practical care for people experiencing food insecurity and vulnerable families.",
    goal: "Meeting a basic need while showing people they are valued and cared for.",
    aboutText:
      "Project SMS – Sharing Meals with Someone\n\nProject SMS provides nutritious meals, essential groceries, and emergency food support to people facing food insecurity, including underprivileged families, migrant workers, and homeless individuals—sharing food, care, and hope with those in need.",
    photos: [],
    isVisible: true,
  },
  {
    order: 4,
    icon: "✂",
    color: "rd",
    title: "Project Sakhi",
    desc: "Tailoring skills and livelihood opportunities for women.",
    goal: "Empowering women with skills, confidence and opportunity.",
    aboutText:
      "Project Sakhi provides vocational training in tailoring, garment making, and craft creation, enabling women from vulnerable backgrounds to attain financial self-reliance, dignity, and sustainable livelihoods.",
    photos: [],
    isVisible: true,
  },
  {
    order: 5,
    icon: "✚",
    color: "tl",
    title: "Compassion & Care",
    desc: "Medical assistance, counselling and community care.",
    goal: "Bringing compassionate care to people who need it.",
    aboutText:
      "Compassion & Care responds to healthcare disparities through medical aid, doctor visits, health camps, essential medicines, and emotional counselling for seniors and vulnerable patients.",
    photos: [],
    isVisible: true,
  },
  {
    order: 6,
    icon: "🎓",
    color: "bl",
    title: "Child Development",
    desc: "Holistic development through learning, mentoring, fellowship, encouragement and practical support.",
    goal: "Helping children grow into confident and responsible individuals.",
    aboutText:
      "Our Child Development initiative nurtures physical, emotional, and social well-being through after-school study classes, life skills workshops, arts, sports, and moral guidance.",
    photos: [],
    isVisible: true,
  },
];

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding...");

    // Remove existing projects to have clean order 0..6
    await Project.deleteMany({});
    console.log("Cleared old projects.");

    const created = await Project.insertMany(initialProjects);
    console.log(`Successfully seeded ${created.length} projects:`);
    created.forEach((p) => {
      console.log(`- [order ${p.order}] ${p.title} (_id: ${p._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
