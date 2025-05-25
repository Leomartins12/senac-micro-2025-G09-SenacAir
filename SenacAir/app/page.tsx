'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    try {
      const res = await axios.post('http://34.138.169.230:8000/login', {
        email,
        password,
      });
      localStorage.setItem('user', JSON.stringify(res.data));
      router.push('/welcome');
    } catch (err: any) {
      setErro('Email ou senha inválidos!');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center py-10">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#18398A] mb-8">Bem-vindo ao Check-in Aéreo</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
            required
          />
          {erro && <div className="text-red-600 font-bold text-center">{erro}</div>}
          <button
            type="submit"
            className="w-full bg-[#18398A] text-white py-2 px-4 rounded-md font-bold hover:bg-[#2851b6] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">Cadastre-se</a>
        </p>
      </div>
    </main>
  );
} 