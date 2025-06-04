import { db } from "../../lib/db";

export async function POST(req) {
  const body = await req.json();
  const { CompanyName, Email, Password, OwnerUserID } = body;

  if (!CompanyName || !Email || !Password || !OwnerUserID) {
    return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO companies (CompanyName, Email, Password, OwnerUserID) VALUES (?, ?, ?, ?)",
      [CompanyName, Email, Password, OwnerUserID]
    );

    return new Response(JSON.stringify({
      CompanyID: result.insertId,
      CompanyName,
      Email,
      CreatedAt: new Date(),
      OwnerUserID
    }), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
