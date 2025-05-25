'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    try {
      const response = await axios.post('http://34.138.169.230:8000/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      // Salvar dados do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Redirecionar para a página de boas-vindas
      router.push('/welcome');
    } catch (error: any) {
      if (error.response?.status === 400) {
        alert('Este email já está cadastrado!');
      } else {
        alert('Erro ao realizar cadastro. Tente novamente.');
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center py-10">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#18398A] mb-8">Criar Conta</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Nome Completo"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#18398A] text-white py-2 px-4 rounded-md font-bold hover:bg-[#2851b6] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cadastrar
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <a href="/" className="font-medium text-blue-600 hover:text-blue-500">Faça login</a>
        </p>
      </div>
    </main>
  );
} 