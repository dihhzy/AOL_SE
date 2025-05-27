import { db } from '../../lib/db.js';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}