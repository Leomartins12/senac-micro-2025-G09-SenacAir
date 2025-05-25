'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Profile() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [reservas, setReservas] = useState<any[]>([]);
  const [destinos, setDestinos] = useState<any[]>([]);
  const [voos, setVoos] = useState<any[]>([]);

  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  }

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/');
      return;
    }
    const user = JSON.parse(userStr);
    setUsuario(user);
    // Buscar reservas do usuário na API
    axios.get(`http://34.138.169.230:8000/my-reservations`, {
      params: { user_id: user.id },
    })
      .then(res => setReservas(res.data))
      .catch(() => setReservas([]));
    // Buscar destinos
    axios.get('http://34.138.169.230:8000/destinations')
      .then(res => setDestinos(res.data))
      .catch(() => setDestinos([]));
    // Buscar todos voos (para mapear destino)
    axios.get('http://34.138.169.230:8000/flights?destination_code=GRU')
      .then(res => setVoos(res.data))
      .catch(() => setVoos([]));
  }, [router]);

  // Função para excluir reserva
  async function handleDeleteReserva(id: number) {
    if (!window.confirm('Tem certeza que deseja excluir esta reserva?')) return;
    try {
      await axios.delete(`http://34.138.169.230:8000/reservation/${id}`);
      setReservas(reservas.filter(r => r.id !== id));
    } catch {
      alert('Erro ao excluir reserva.');
    }
  }

  function getOrigemDestinoAbreviado(reserva: any) {
    return `${reserva.origin_code || '?'} - ${reserva.destination_code || '?'}`;
  }

  if (!usuario) return null;

  return (
    <main className="flex flex-col items-center justify-center py-20">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-10 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#18398A] mb-6 text-center">
          Perfil do Usuário
        </h1>
        <div className="w-full mb-8">
          <div className="mb-4">
            <span className="block text-gray-500 text-sm">Nome</span>
            <span className="font-bold text-lg">{usuario.name}</span>
          </div>
          <div className="mb-8">
            <span className="block text-gray-500 text-sm">Email</span>
            <span className="font-bold text-lg">{usuario.email}</span>
          </div>
          <div>
            <span className="block text-gray-500 text-sm mb-2">Reservas Feitas</span>
            {reservas.length === 0 ? (
              <span className="text-gray-400">Nenhuma reserva encontrada.</span>
            ) : (
              <ul className="list-disc pl-6">
                {reservas.map((r, idx) => (
                  <li key={idx} className="mb-2 flex items-center gap-2">
                    <span>
                      <span className="inline-block bg-gray-200 rounded px-2 py-0.5 text-xs font-bold mr-2">{getOrigemDestinoAbreviado(r)}</span>
                      Voo: {r.flight_id} | Assentos: {r.seat_ids} | Bagagem: {r.baggage_id}
                    </span>
                    <button
                      onClick={() => handleDeleteReserva(r.id)}
                      className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 text-xs font-bold"
                    >
                      Excluir
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-[#18398A] hover:bg-[#2851b6] text-white font-bold px-8 py-3 rounded-lg text-lg shadow transition"
        >
          Sair
        </button>
      </div>
    </main>
  );
} 