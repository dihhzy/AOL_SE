import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { cookies } from 'next/headers';

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email dan password wajib diisi' }, { status: 400 });
  }

  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'store_it'
    });

    const [rows] = await conn.execute(
      'SELECT * FROM users WHERE Email = ? AND Password = ?',
      [email, password]
    );

    if (rows.length > 0) {
      const user = rows[0];

      const cookieStore = await cookies();
      console.log(cookieStore)
      cookieStore.set('session_user', JSON.stringify({
        id: user.UserID,
        username: user.Username,
        role: user.Role,
        companyId: user.CompanyID
      }), {
        path: '/',
        maxAge: 60 * 60 * 24,
        httpOnly: false // agar bisa diakses di client-side fetch
      });

      return NextResponse.json({ message: 'Login berhasil', user }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Email atau password salah' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
