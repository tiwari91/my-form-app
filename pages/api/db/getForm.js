import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Method Not Allowed
  }
  const prisma = new PrismaClient();

  try {
    const forms = await prisma.Form.findMany();

    res.status(200).json({ forms });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching forms." });
  }
}
