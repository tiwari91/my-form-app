import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const { name, email, displayMonth } = req.body;
  const prisma = new PrismaClient();

  try {
    const newForm = await prisma.Form.create({
      data: {
        name,
        email,
        displayMonth,
      },
    });

    res.json({ user: newForm, error: null });
  } catch (error) {
    res.json({ error: error.message, user: null });
  }
}
