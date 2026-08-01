"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function moderateGalleryImageAction(imageId: string, status: "APPROVED" | "REJECTED") {
  await prisma.galleryImage.update({ where: { id: imageId }, data: { status } });
  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
}
