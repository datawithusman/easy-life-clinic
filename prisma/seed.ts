import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clinic Settings
  const existingSettings = await prisma.clinicSettings.findFirst();
  if (!existingSettings) {
    await prisma.clinicSettings.create({
      data: {
        skinFee: 4000,
        hairFee: 4000,
        bothFee: 8000,
        openDays: "Thursday,Friday,Saturday",
        openTime: "18:30",
        closeTime: "20:30",
        slotDuration: 20,
        discountPct: 0,
      },
    });
    console.log("✓ Clinic settings created");
  }

  // Admin user
  const adminEmail = "admin@easyliftclinic.com";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: "Dr. Zakia Noor",
        email: adminEmail,
        phone: "+923000000000",
        password: await bcrypt.hash("admin@clinic123", 12),
        role: "ADMIN",
      },
    });
    console.log("✓ Admin user created — email: admin@easyliftclinic.com | password: admin@clinic123");
  }

  // Assistant user
  const assistantEmail = "assistant@easyliftclinic.com";
  const existingAssistant = await prisma.user.findUnique({ where: { email: assistantEmail } });
  if (!existingAssistant) {
    await prisma.user.create({
      data: {
        name: "Clinic Assistant",
        email: assistantEmail,
        phone: "+923001111111",
        password: await bcrypt.hash("assistant@clinic123", 12),
        role: "ASSISTANT",
      },
    });
    console.log("✓ Assistant user created — email: assistant@easyliftclinic.com | password: assistant@clinic123");
  }

  // Treatments
  const treatments = [
    { name: "Laser Hair Removal", description: "Permanent hair reduction using advanced laser technology. Safe for all skin types.", price: 12000, category: "Laser" },
    { name: "Carbon Laser Facial", description: "Deep cleansing carbon peel for glowing, smooth skin. Reduces acne and pores.", price: 8000, category: "Laser" },
    { name: "PRP Hair Treatment", description: "Platelet-rich plasma injected to stimulate natural hair growth.", price: 15000, category: "Hair" },
    { name: "Hydra Facial", description: "Multi-step facial: cleanse, exfoliate, hydrate using Hydrafacial machine.", price: 6000, category: "Skin" },
    { name: "Chemical Peel", description: "Exfoliating treatment for pigmentation, acne scars and skin texture.", price: 4500, category: "Skin" },
    { name: "Dermal Fillers", description: "Hyaluronic acid fillers for lips, cheeks, under-eyes. Natural results.", price: 25000, category: "Aesthetic" },
    { name: "Botox / Anti-Aging", description: "Muscle-relaxing injections to smooth forehead lines and crow's feet.", price: 20000, category: "Aesthetic" },
    { name: "Mesotherapy", description: "Microinjections of vitamins and minerals for hair and skin rejuvenation.", price: 10000, category: "Both" },
    { name: "Acne Scar Treatment", description: "Combination of microneedling + chemical peels for deep scar revision.", price: 7000, category: "Skin" },
    { name: "Mole / Tag Removal", description: "Safe removal of skin tags, moles, and warts using RF or laser.", price: 3000, category: "Skin" },
  ];

  const existingTreatments = await prisma.treatment.count();
  if (existingTreatments === 0) {
    await prisma.treatment.createMany({ data: treatments });
    console.log(`✓ ${treatments.length} treatments seeded`);
  }

  // Sample announcement
  const existingAnn = await prisma.announcement.count();
  if (existingAnn === 0) {
    await prisma.announcement.create({
      data: {
        title: "Welcome to Easy Life Aesthetic Clinic!",
        message: "Book your appointment online and get a confirmed slot. Limited slots available per session.",
        type: "info",
        isActive: true,
      },
    });
    console.log("✓ Sample announcement created");
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
