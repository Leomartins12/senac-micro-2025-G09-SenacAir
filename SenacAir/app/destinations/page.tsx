'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Destinations() {
  const [busca, setBusca] = useState('');
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [destinos, setDestinos] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('http://34.138.169.230:8000/destinations')
      .then(res => setDestinos(res.data))
      .catch(() => setDestinos([]));
  }, []);

  const destinosFiltrados = destinos.filter(destino =>
    destino.name.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="flex flex-col items-center justify-center py-10">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#18398A] mb-6">Selecione seu Destino</h1>
        <input
          type="text"
          placeholder="Buscar destino..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full mb-8 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#18398A]"
        />
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Destinos Populares</h2>
        <div className="flex flex-col gap-4 mb-6">
          {destinosFiltrados.length === 0 && (
            <div className="text-center text-gray-500">Nenhum destino encontrado.</div>
          )}
          {destinosFiltrados.map(destino => (
            <button
              key={destino.code}
              onClick={() => setSelecionado(destino.code)}
              className={`flex items-center justify-between w-full bg-white border rounded-lg px-6 py-4 shadow-sm transition font-bold text-left
                ${selecionado === destino.code ? 'border-[#18398A] ring-2 ring-[#18398A] bg-blue-50' : 'border-gray-200 hover:shadow-md'}`}
            >
              <div>
                <span className="block text-lg font-extrabold text-[#18398A]">{destino.name}</span>
                <span className="block text-sm text-gray-500">{destino.code}</span>
              </div>
            </button>
          ))}
        </div>
        <button
          className={`w-full py-3 rounded-lg text-lg font-bold transition ${selecionado ? 'bg-[#18398A] text-white hover:bg-[#2851b6]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          disabled={!selecionado}
          onClick={() => {
            if (selecionado) {
              localStorage.setItem('destination_code', selecionado);
              localStorage.removeItem('origin_code');
              localStorage.removeItem('flight_id');
              localStorage.removeItem('reserva_temp');
              router.push('/origin');
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