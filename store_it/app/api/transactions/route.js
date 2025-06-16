import { db } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    let query = `
      SELECT 
        t.TransactionID, 
        t.QuantityChange, 
        t.TransactionType, 
        DATE_FORMAT(t.Timestamp, '%Y-%m-%d %H:%i:%s') as Timestamp, 
        t.ProductID,
        p.ProductName,
        t.UserID
      FROM transactions t
      JOIN products p ON t.ProductID = p.ProductID
    `;
    const queryParams = [];

    if (userId) {
      query += ' WHERE t.UserID = ?';
      queryParams.push(userId);
    }

    query += ' ORDER BY t.Timestamp DESC';

    const [rows] = await db.query(query, queryParams);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json({ message: 'Failed to fetch transactions', error: error.message }, { status: 500 });
  }
}