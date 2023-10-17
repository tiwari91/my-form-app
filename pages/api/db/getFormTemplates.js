import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  const prisma = new PrismaClient();

  try {
    const forms = await prisma.formTemplate.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.status(200).json({ forms });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching forms." });
  }
}
