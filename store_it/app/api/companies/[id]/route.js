import { db } from "../../../lib/db.js";

export async function DELETE(req, { params }) {
  const companyId = params.id;

  if (!companyId) {
    return new Response(JSON.stringify({ message: "Missing companyId" }), { status: 400 });
  }

  try {
    const [result] = await db.query("DELETE FROM companies WHERE CompanyID = ?", [companyId]);
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("Error deleting company:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
