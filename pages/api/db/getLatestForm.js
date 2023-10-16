import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Method Not Allowed
  }

  const prisma = new PrismaClient();

  try {
    const latestForm = await prisma.Form.findFirst({
      orderBy: { createdAt: "desc" }, // Order by creation date in descending order
    });

    if (!latestForm) {
      return res.status(404).json({ error: "No forms found." });
    }

    res.status(200).json({ form: latestForm });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the latest form." });
  } finally {
    await prisma.$disconnect();
  }
}
