'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Função utilitária para recuperar dados do localStorage
function getReservaTemp() {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('reserva_temp');
  return data ? JSON.parse(data) : null;
}

export default function Baggage() {
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [bagagens, setBagagens] = useState<any[]>([]);
  const [erro, setErro] = useState('');
  const router = useRouter();

  useEffect(() => {
    axios.get('http://34.138.169.230:8000/baggage')
      .then(res => setBagagens(res.data))
      .catch(() => setBagagens([]));
  }, []);

  const handleConcluir = async () => {
    setErro('');
    const reservaTemp = getReservaTemp();
    const userStr = localStorage.getItem('user');
    if (!reservaTemp || !userStr || selecionada === null) {
      setErro('Dados da reserva incompletos.');
      return;
    }
    const user = JSON.parse(userStr);
    try {
      const res = await axios.post('http://34.138.169.230:8000/reservation', {
        user_id: user.id,
        flight_id: reservaTemp.flight_id,
        seat_numbers: reservaTemp.seat_numbers,
        baggage_id: bagagens[selecionada].id,
        origin_code: reservaTemp.origin_code,
        destination_code: reservaTemp.destination_code,
      });
      router.push(`/confirmation?id=${res.data.id}`);
    } catch (err: any) {
      setErro('Erro ao concluir reserva. Tente novamente.');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center py-10">
      <div className="flex flex-wrap gap-6 mb-8 w-full max-w-4xl">
        {bagagens.map((op, idx) => (
          <button
            key={op.id}
            onClick={() => setSelecionada(idx)}
            className={`flex-1 min-w-[260px] bg-white rounded-xl shadow-lg p-6 relative text-left border-2 transition
              ${selecionada === idx ? 'border-[#18398A] ring-2 ring-[#18398A] bg-blue-50' : 'border-transparent hover:border-blue-200'}`}
          >
            <span className="absolute top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded font-bold text-sm">{op.weight}kg</span>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{op.name}</h2>
            <p className="text-gray-600 mb-2">{op.description}</p>
            {op.price === 0 ? (
              <span className="text-blue-600 font-bold">Incluso</span>
            ) : (
              <span className="text-blue-600 font-bold">R$ {op.price}</span>
            )}
          </button>
        ))}
      </div>
      {erro && <div className="text-red-600 font-bold text-center mb-4">{erro}</div>}
      <button
        className={`w-full max-w-4xl py-3 rounded-lg text-lg font-bold mb-8 transition ${selecionada !== null ? 'bg-[#18398A] text-white hover:bg-[#2851b6]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        disabled={selecionada === null}
        onClick={handleConcluir}
      >
        Concluir
      </button>
      <button
        className="w-full max-w-4xl py-3 rounded-lg text-lg font-bold mb-4 bg-gray-200 text-gray-700 hover:bg-gray-300"
        onClick={() => router.back()}
      >
        Voltar
      </button>
      <div className="w-full max-w-4xl bg-gray-100 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-2">Informações Importantes:</h3>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Bagagem de mão (10kg) é sempre incluída</li>
          <li>Dimensões máximas da bagagem: 158cm (altura + largura + profundidade)</li>
          <li>Bagagem extra pode ser comprada no check-in (preços mais altos)</li>
        </ul>
      </div>
    </main>
  );
} 