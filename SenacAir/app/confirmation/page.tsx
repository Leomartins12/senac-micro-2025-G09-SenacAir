'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const reservaId = searchParams.get('id');
  const [reserva, setReserva] = useState<any>(null);
  const [voo, setVoo] = useState<any>(null);
  const [destinos, setDestinos] = useState<any[]>([]);
  const [bagagem, setBagagem] = useState<any>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!reservaId) return;
    axios.get(`http://34.138.169.230:8000/reservation/${reservaId}`)
      .then(async res => {
        setReserva(res.data);
        // Buscar detalhes do voo pelo id
        const vooRes = await axios.get(`http://34.138.169.230:8000/flight/${res.data.flight_id}`);
        setVoo(vooRes.data);
        // Buscar destinos
        const destRes = await axios.get('http://34.138.169.230:8000/destinations');
        setDestinos(destRes.data);
        // Buscar bagagem
        const bagRes = await axios.get('http://34.138.169.230:8000/baggage');
        setBagagem(bagRes.data.find((b: any) => b.id === res.data.baggage_id));
      })
      .catch(() => setErro('Reserva não encontrada.'));
  }, [reservaId]);

  if (erro) {
    return <div className="text-center text-red-600 font-bold py-10">{erro}</div>;
  }
  if (!reserva || !voo || destinos.length === 0 || !bagagem) {
    return <div className="text-center text-gray-600 py-10">Carregando reserva...</div>;
  }

  // Encontrar nome da origem e destino a partir dos códigos salvos na reserva
  const origem = voo.origin_name || reserva.origin_code;
  const destino = voo.destination_name || reserva.destination_code;
  // Assentos
  const assentos = reserva.seat_ids.split(',');
  // Valor total
  const valorTotal = (voo.price * assentos.length) + (bagagem.price || 0);

  return (
    <main className="flex flex-col items-center justify-center py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#18398A] mb-6 flex items-center gap-3">
        Confirmação da Reserva
        <span className="inline-block bg-green-100 text-green-600 rounded-full p-2">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
        </span>
      </h1>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Detalhes da Reserva</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-6 text-sm">
          <div className="text-gray-500">Nº Reserva</div>
          <div className="font-bold">{reserva.id}</div>
          <div className="text-gray-500">Data</div>
          <div className="font-bold">{new Date(reserva.created_at).toLocaleString()}</div>
          <div className="text-gray-500">Origem</div>
          <div className="font-bold">{origem}</div>
          <div className="text-gray-500">Destino</div>
          <div className="font-bold">{destino}</div>
          <div className="text-gray-500">Horário do Voo</div>
          <div className="font-bold">{voo.departure_time}</div>
          <div className="text-gray-500">Assentos</div>
          <div className="font-bold">{reserva.seat_ids}</div>
          <div className="text-gray-500">Bagagem</div>
          <div className="font-bold">{bagagem.name} ({bagagem.weight}kg)</div>
        </div>
        <div className="border-t pt-4 flex items-center justify-between mt-2">
          <span className="font-bold text-lg text-gray-800">Valor Total</span>
          <span className="font-extrabold text-2xl text-green-700">R$ {valorTotal.toFixed(2)}</span>
        </div>
      </div>
    </main>
  );
}

export default function Confirmation() {
  return (
    <Suspense fallback={<div className="text-center text-gray-600 py-10">Carregando...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
} 