'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const CODIGOS_ORIGEM = ["POA", "CWB", "CNF", "FOR", "MAO"];

export default function Origin() {
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [origens, setOrigens] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('http://34.138.169.230:8000/destinations')
      .then(res => setOrigens(res.data.filter((o: any) => CODIGOS_ORIGEM.includes(o.code))))
      .catch(() => setOrigens([]));
  }, []);

  return (
    <main className="flex flex-col items-center justify-center py-10">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#18398A] mb-6">Selecione sua Origem</h1>
        <div className="flex flex-col gap-4 mb-6">
          {origens.map(origem => (
            <button
              key={origem.code}
              onClick={() => setSelecionado(origem.code)}
              className={`flex items-center justify-between w-full bg-white border rounded-lg px-6 py-4 shadow-sm transition font-bold text-left
                ${selecionado === origem.code ? 'border-[#18398A] ring-2 ring-[#18398A] bg-blue-50' : 'border-gray-200 hover:shadow-md'}`}
            >
              <div>
                <span className="block text-lg font-extrabold text-[#18398A]">{origem.name}</span>
                <span className="block text-sm text-gray-500">{origem.code}</span>
              </div>
            </button>
          ))}
        </div>
        <button
          className={`w-full py-3 rounded-lg text-lg font-bold transition ${selecionado ? 'bg-[#18398A] text-white hover:bg-[#2851b6]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          disabled={!selecionado}
          onClick={() => {
            if (selecionado) {
              localStorage.setItem('origin_code', selecionado);
              localStorage.removeItem('flight_id');
              localStorage.removeItem('reserva_temp');
              router.push('/schedule');
            }
          }}
        >
          Continuar
        </button>
        <button
          className="w-full mt-2 py-3 rounded-lg text-lg font-bold bg-gray-200 text-gray-700 hover:bg-gray-300"
          onClick={() => router.back()}
        >
          Voltar
        </button>
      </div>
    </main>
  );
} 