import { db } from "../../lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ownerId = searchParams.get("ownerId");

  if (!ownerId) {
    return new Response(JSON.stringify({ message: "Missing ownerId" }), { status: 400 });
  }

  try {
    const [rows] = await db.query(
      "SELECT CompanyID, CompanyName, Email, CreatedAt, OwnerUserID FROM companies WHERE OwnerUserID = ?",
      [ownerId]
    );

    return new Response(JSON.stringify(rows), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("MySQL error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
