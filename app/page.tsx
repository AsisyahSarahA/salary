import React from "react";
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/sign-in');
  return (
    <h1>asa</h1>
  );
}
