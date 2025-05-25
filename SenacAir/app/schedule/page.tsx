'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Schedule() {
  const [selecionado, setSelecionado] = useState<number | null>(null);
  const [voos, setVoos] = useState<any[]>([]);
  const [destino, setDestino] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const origin_code = localStorage.getItem('origin_code');
    const destination_code = localStorage.getItem('destination_code');
    setDestino(destination_code || '');
    if (origin_code && destination_code) {
      axios.get(`http://34.138.169.230:8000/flights?origin_code=${origin_code}&destination_code=${destination_code}`)
        .then(res => setVoos(res.data))
        .catch(() => setVoos([]));
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center py-10">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-[#18398A]">Selecione o Horário</h1>
          <span className="text-xl font-bold text-gray-800 text-center">Voo para {destino}</span>
        </div>
        <div className="flex flex-col gap-4 mb-6">
          {voos.length === 0 && (
            <div className="text-center text-gray-500">Nenhum voo encontrado.</div>
          )}
          {voos.map((h, idx) => (
            <button
              key={h.id}
              onClick={() => setSelecionado(idx)}
              className={`flex items-center justify-between w-full bg-white border rounded-lg px-6 py-4 shadow-sm transition font-bold text-left
                ${selecionado === idx ? 'border-[#18398A] ring-2 ring-[#18398A] bg-blue-50' : 'border-gray-200 hover:shadow-md'}`}
            >
              <div>
                <span className="block text-2xl font-extrabold text-[#18398A]">{h.departure_time}</span>
                <span className="block text-sm text-gray-500">{h.duration}</span>
              </div>
              <span className="bg-blue-100 text-[#18398A] font-bold px-6 py-2 rounded-lg text-lg">R$ {h.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
        <button
          className={`w-full py-3 rounded-lg text-lg font-bold transition ${selecionado !== null ? 'bg-[#18398A] text-white hover:bg-[#2851b6]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          disabled={selecionado === null}
          onClick={() => {
            if (selecionado !== null) {
              localStorage.setItem('flight_id', voos[selecionado].id);
              localStorage.removeItem('reserva_temp');
              // Redirecionar para a página de assentos
              router.push('/seats');
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