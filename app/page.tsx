
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/sign-in');
  return (
    <div>
      {/* Konten halaman utama */}
    </div>
  );
}
