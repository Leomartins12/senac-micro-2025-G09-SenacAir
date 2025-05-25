'use client';
import { useRouter } from 'next/navigation';

export default function Welcome() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center py-20">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-10 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#18398A] mb-6 text-center">
          Bem-vindo ao SenacAir!
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Pronto para começar sua próxima viagem?
        </p>
        <button
          onClick={() => router.push('/destinations')}
          className="bg-[#18398A] hover:bg-[#2851b6] text-white font-bold px-8 py-3 rounded-lg text-lg shadow transition"
        >
          Iniciar uma viagem
        </button>
      </div>
    </main>
  );
} 