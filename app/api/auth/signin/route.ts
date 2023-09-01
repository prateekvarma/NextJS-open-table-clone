import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const formData = await request.json();
  const { email, password } = formData;

  const errors: string[] = [];

  const validationSchema = [
    {
      valid: validator.isEmail(email),
      errorMessage: "Email is invalid",
    },
    {
      valid: validator.isLength(password, { min: 1 }),
      errorMessage: "Invalid password",
    },
  ];

  validationSchema.forEach((check) => {
    if (!check.valid) {
      errors.push(check.errorMessage);
    }
  });

  if (errors.length) {
    return NextResponse.json({ errorMessage: errors }, { status: 400 });
  }

  const userWithEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!userWithEmail)
    return NextResponse.json(
      { errorMessage: "Email or password invalid" },
      { status: 401 }
    );

  // compare form text pwd - with pwd from the DB
  const isMatch = await bcrypt.compare(password, userWithEmail.password);

  if (!isMatch)
    return NextResponse.json(
      { errorMessage: "Email or password invalid" },
      { status: 401 }
    );

    //if reached here, user-pwd is good, send JWT now.
    const alg = "HS256";

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  
    const token = await new jose.SignJWT({ email: userWithEmail.email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);
  
    return NextResponse.json({ token });
}
