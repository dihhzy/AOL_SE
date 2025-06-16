import { db } from '../../../lib/db.js';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!id || isNaN(parseInt(id))) {
      return new Response(JSON.stringify({ 
        message: 'Invalid product ID' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (quantity === undefined || quantity < 0) {
      return new Response(JSON.stringify({ 
        message: 'Valid quantity is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [existingProduct] = await db.query(
      'SELECT * FROM products WHERE ProductID = ?',
      [parseInt(id)]
    );

    if (existingProduct.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'Product not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update product quantity
    await db.query(
      'UPDATE products SET Quantity = ? WHERE ProductID = ?',
      [parseInt(quantity), parseInt(id)]
    );

    // Return updated product data
    return new Response(JSON.stringify({
      message: 'Product quantity updated successfully',
      quantity: parseInt(quantity)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error updating product quantity:', err);
    return new Response(JSON.stringify({ 
      message: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}