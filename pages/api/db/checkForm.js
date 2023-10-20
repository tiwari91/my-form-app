import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const prisma = new PrismaClient();

  try {
    const { formName } = req.query;

    const existingForm = await prisma.formTemplate.findFirst({
      where: {
        formName: formName,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (existingForm) {
      res.status(200).json({ existingForm });
    } else {
      res.status(200).json({ existingForm: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while checking the form." });
  } finally {
    await prisma.$disconnect();
  }
}
