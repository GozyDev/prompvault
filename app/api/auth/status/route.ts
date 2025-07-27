import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { loggedIn: false, message: "Token not found" },
        { status: 401 }
      );
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const user = jwt.verify(token, JWT_SECRET); // this throws if token is invalid

    const decoded = jwt.decode(token);
    console.log("Decoded token:", decoded);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("Token:", token);

    return NextResponse.json(
      { loggedIn: true, message: "Token found", user },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("JWT error:", err);

    return NextResponse.json(
      { loggedIn: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
