import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();
    
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Username, email, and password are required' }, 
        { status: 400 }
      );
    }

    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'store_it'
    });

    const [existingUsers] = await conn.execute(
      'SELECT * FROM users WHERE Email = ?', 
      [email]
    );
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'Email already registered' }, 
        { status: 409 }
      );
    }

    await conn.execute(
      'INSERT INTO users (Username, Email, Password, Role, CompanyID, CreatedAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [username, email, password, 'Staff', 1]
    );

    await conn.end();
    
    return NextResponse.json(
      { message: 'Registration successful' }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Server error during registration' }, 
      { status: 500 }
    );
  }
}