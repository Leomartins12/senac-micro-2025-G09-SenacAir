'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Seats() {
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [assentos, setAssentos] = useState<any[]>([]);
  const router = useRouter();

  // Pega o flight_id do localStorage
  const [flightId, setFlightId] = useState<number | null>(null);

  useEffect(() => {
    const storedFlightId = localStorage.getItem('flight_id');
    if (storedFlightId) {
      setFlightId(Number(storedFlightId));
      axios.get(`http://34.138.169.230:8000/seats?flight_id=${storedFlightId}`)
        .then(res => setAssentos(res.data))
        .catch(() => setAssentos([]));
    }
  }, []);

  function toggleAssento(assento: string, status: string) {
    if (status === 'reserved') return;
    setSelecionados(sel =>
      sel.includes(assento)
        ? sel.filter(a => a !== assento)
        : [...sel, assento]
    );
  }

  // Organizar assentos em grid 6x5
  const grid: any[][] = [[], [], [], [], [], []];
  assentos.forEach((a: any) => {
    const row = a.seat_number.charCodeAt(0) - 65; // 'A' = 0
    grid[row].push(a);
  });

  return (
    <main className="flex flex-col items-center justify-center py-10">
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 border-2 border-blue-400 rounded bg-white" />
          <span>Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-400 rounded" />
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-300 rounded" />
          <span>Ocupado</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-10 flex flex-col items-center">
        <div className="grid grid-cols-6 gap-4 mb-8">
          {grid.map((col, i) =>
            col.map((assento, j) => {
              const ocupado = assento.status === 'reserved';
              const selecionado = selecionados.includes(assento.seat_number);
              return (
                <button
                  key={assento.seat_number}
                  className={`w-12 h-12 flex items-center justify-center border-2 rounded font-bold text-[#18398A] text-lg mb-2
                    ${ocupado ? 'bg-gray-300 border-gray-300 cursor-not-allowed' : selecionado ? 'bg-blue-400 border-blue-400 text-white' : 'bg-white border-blue-400 hover:bg-blue-100'}`}
                  disabled={ocupado}
                  onClick={() => toggleAssento(assento.seat_number, assento.status)}
                >
                  {assento.seat_number[0]}
                  <span className="text-xs ml-1">{assento.seat_number[1]}</span>
                </button>
              );
            })
          )}
        </div>
        <div className="w-full bg-gray-100 rounded-lg p-4 mb-4 text-lg font-semibold text-gray-700">
          Assentos Selecionados: {selecionados.length > 0 ? selecionados.join(', ') : 'Nenhum'}
        </div>
        <button
          className={`w-full py-3 rounded-lg text-lg font-bold transition ${selecionados.length > 0 ? 'bg-[#18398A] text-white hover:bg-[#2851b6]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          disabled={selecionados.length === 0 || !flightId}
          onClick={() => {
            if (!flightId) return;
            // Salvar dados da reserva temporária
            const origin_code = localStorage.getItem('origin_code');
            const destination_code = localStorage.getItem('destination_code');
            localStorage.setItem('reserva_temp', JSON.stringify({
              flight_id: flightId,
              seat_numbers: selecionados,
              origin_code,
              destination_code
            }));
            router.push('/baggage');
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