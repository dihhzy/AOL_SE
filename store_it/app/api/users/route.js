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

export async function POST(request) {
  try {
    const body = await request.json();
    const { Username, Email, Password, Role } = body;

    if (!Username || !Email || !Password || !Role) {
      return new Response(JSON.stringify({ 
        message: 'All fields are required: Username, Email, Password, Role' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return new Response(JSON.stringify({ 
        message: 'Invalid email format' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const validRoles = ['admin', 'company_owner', 'staff'];
    if (!validRoles.includes(Role.toLowerCase())) {
      return new Response(JSON.stringify({ 
        message: 'Invalid role. Must be admin, company_owner, or staff' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [existingUserByUsername] = await db.query(
      'SELECT UserID FROM users WHERE Username = ?',
      [Username]
    );

    if (existingUserByUsername.length > 0) {
      return new Response(JSON.stringify({ 
        message: 'Username already exists' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [existingUserByEmail] = await db.query(
      'SELECT UserID FROM users WHERE Email = ?',
      [Email]
    );

    if (existingUserByEmail.length > 0) {
      return new Response(JSON.stringify({ 
        message: 'Email already exists' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    const [result] = await db.query(
      'INSERT INTO users (Username, Email, Password, Role, CreatedAt) VALUES (?, ?, ?, ?, NOW())',
      [Username, Email, hashedPassword, Role]
    );

    const [newUser] = await db.query(
      'SELECT UserID, Username, Email, Role, CreatedAt FROM users WHERE UserID = ?',
      [result.insertId]
    );

    return new Response(JSON.stringify({
      message: 'User created successfully',
      user: newUser[0]
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error creating user:', err);
    

    if (err.code === 'ER_DUP_ENTRY') {
      return new Response(JSON.stringify({ 
        message: 'Username or email already exists' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      message: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}