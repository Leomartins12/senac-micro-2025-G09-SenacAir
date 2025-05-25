"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  function handleInicioClick(e: React.MouseEvent) {
    e.preventDefault();
    if (typeof window !== 'undefined' && localStorage.getItem('user')) {
      router.push('/welcome');
    } else {
      router.push('/');
    }
  }

  return (
    <header className="w-full bg-[#18398A] shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-[#18398A]">◆</span>
          </div>
          <span className="text-2xl font-extrabold text-white">Senac<span className="text-yellow-400">Air</span></span>
        </div>
        <nav className="flex gap-6 items-center">
          <a href="/" onClick={handleInicioClick} className="text-white font-semibold hover:text-yellow-400 px-2 py-1 rounded transition">Início</a>
          <Link href="/destinations" className="text-white font-semibold hover:text-yellow-400 px-2 py-1 rounded transition">Destinos</Link>
          <Link href="/offers" className="text-white font-semibold hover:text-yellow-400 px-2 py-1 rounded transition">Ofertas</Link>
          <Link href="/about" className="text-white font-semibold hover:text-yellow-400 px-2 py-1 rounded transition">Sobre</Link>
          <Link href="/contact" className="text-white font-semibold hover:text-yellow-400 px-2 py-1 rounded transition">Contato</Link>
          <Link href="/profile" className="ml-4 bg-white text-[#18398A] font-bold px-4 py-2 rounded-lg shadow hover:bg-yellow-400 hover:text-[#18398A] transition">Perfil</Link>
        </nav>
      </div>
    </header>
  );
} 