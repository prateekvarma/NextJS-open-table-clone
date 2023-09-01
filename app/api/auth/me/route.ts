import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const headersList = headers();
  const bearerToken = headersList.get("authorization");

  if (!bearerToken)
    return NextResponse.json(
      { errorMessage: "Unauthorized Request: No bearerToken" },
      { status: 401 }
    );

  const token = bearerToken.split(" ")[1];

  const payload = jwt.decode(token) as { email: string };

  if (!payload.email)
    return NextResponse.json(
      { errorMessage: "Unauthorized Request: No email in payload" },
      { status: 401 }
    );

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      city: true,
      phone: true,
    },
  });

  return NextResponse.json({ user });
}
