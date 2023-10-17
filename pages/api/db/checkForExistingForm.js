import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  try {
    const { formName } = req.query;

    const existingForm = await prisma.form.findFirst({
      where: {
        formName: formName,
      },
    });

    return existingForm;
  } catch (error) {
    console.error("Error checking for existing form:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
