// app/api/auth/route.ts
import { NextResponse } from 'next/server';

// Dummy data untuk testing
const dummyUsers = [
    {
        id: 1,
        email: 'admin@salary.com',
        password: 'admin123',
        name: 'Administrator',
        role: 'admin'
    },
    {
        id: 2,
        email: 'hr@salary.com',
        password: 'hr123',
        name: 'HR Manager',
        role: 'hr'
    },
    {
        id: 3,
        email: 'employee@salary.com',
        password: 'employee123',
        name: 'Employee',
        role: 'employee'
    }
];

export async function POST(request: Request) {
    try {
        // Parse request body
        const body = await request.json();
        const { email, password } = body;

        // Validasi input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Cari user berdasarkan email
        const user = dummyUsers.find(u => u.email === email);

        // Cek apakah user ditemukan
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Cek password
        if (user.password !== password) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Login berhasil - return user data (tanpa password)
        const { password: _, ...userWithoutPassword } = user;
        
        return NextResponse.json(
            {
                success: true,
                message: 'Login successful',
                data: userWithoutPassword
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}