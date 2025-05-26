import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email dan password wajib diisi' }, { status: 400 });
  }

  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // ganti kalau kamu pakai password di XAMPP
      database: 'store_it' // sesuaikan nama DB
    });

    // Cek apakah user sudah ada
    const [rows] = await conn.execute('SELECT * FROM users WHERE Email = ? AND Password = ?', [email, password]);

    if (rows.length > 0) {
      return NextResponse.json({ message: 'Login berhasil', user: rows[0] }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Email atau password salah' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}