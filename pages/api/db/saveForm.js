import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { formName, formElements } = req.body;

  console.log("formName", formName);
  console.log("formElements", formElements);

  try {
    const form = await prisma.form.create({
      data: {
        formName,
        formElements,
      },
    });
    return res.status(200).json({ message: "Form saved successfully", form });
  } catch (error) {
    console.error("Error saving the form:", error);
    return res.status(500).json({ message: "Error saving the form" });
  }
}
