import { db } from '../../lib/db'; // Adjust path if your db utility is elsewhere
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.query(
      'SELECT ProductID as id, ProductName as name, Quantity as quantity, Description as description, CategoryID, CompanyID, CreatedByUserID, CreatedAt FROM products'
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ message: 'Failed to fetch products', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {

  try {

    const productData = await request.json();
    const { name: productName, quantity, description, categoryId, createdByUserId } = productData;

    if (!productName || quantity === undefined || parseInt(quantity) < 0) {
      return NextResponse.json({ message: 'Missing required product fields (name, quantity) or invalid quantity.' }, { status: 400 });
    }

    const companyId = productData.companyId || 1; 
    const finalCategoryId = categoryId || null; 
    const finalCreatedByUserId = createdByUserId || 2; // MANUAL DISINI COMPANY SAMA USER
    const productQuantity = parseInt(quantity);

    const productQuery = `
      INSERT INTO products 
        (ProductName, Quantity, Description, CompanyID, CategoryID, CreatedByUserID, CreatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const [productResult] = await db.execute(productQuery, [
      productName, 
      productQuantity, 
      description, 
      companyId,
      finalCategoryId,
      finalCreatedByUserId
    ]);

    const insertedProductId = productResult.insertId;

    const transactionQuery = `
      INSERT INTO transactions
        (QuantityChange, TransactionType, Timestamp, ProductID, UserID)
      VALUES (?, ?, NOW(), ?, ?)
    `;
    await db.execute(transactionQuery, [
      productQuantity,          // QuantityChange
      'Incoming',          // TransactionType
      insertedProductId,        // ProductID
      finalCreatedByUserId      // UserID
    ]);


    const [newProductRows] = await db.query(
      'SELECT ProductID as id, ProductName as name, Quantity as quantity, Description as description, CategoryID, CompanyID, CreatedByUserID, CreatedAt FROM products WHERE ProductID = ?', 
      [insertedProductId]
    );

    if (newProductRows.length === 0) {
        return NextResponse.json({ message: 'Product created, but failed to retrieve it.' }, { status: 201 });
    }

    return NextResponse.json(newProductRows[0], { status: 201 });

  } catch (error) {
    console.error('Failed to add product or record transaction:', error);
    return NextResponse.json({ message: 'Failed to add product or record transaction', error: error.message }, { status: 500 });
  } finally {
  }
}