from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import User, Destination, Flight, Seat, Baggage, Reservation
from passlib.context import CryptContext
from pydantic import BaseModel
import datetime
from typing import List

app = FastAPI()

# CORS para permitir acesso do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar banco e popular dados
@app.on_event("startup")
def startup_event():
    init_db()
    db = SessionLocal()
    # Usuários
    if not db.query(User).filter(User.email == "usuario@exemplo.com").first():
        user = User(name="Usuário Exemplo", email="usuario@exemplo.com", hashed_password=pwd_context.hash("123456"))
        db.add(user)
    if not db.query(User).filter(User.email == "a@a.com").first():
        user2 = User(name="Usuário Teste", email="a@a.com", hashed_password=pwd_context.hash("123"))
        db.add(user2)
    # Destinos
    if not db.query(Destination).first():
        destinos = [
            Destination(name="São Paulo", code="GRU"),
            Destination(name="Rio de Janeiro", code="GIG"),
            Destination(name="Brasília", code="BSB"),
            Destination(name="Salvador", code="SSA"),
            Destination(name="Recife", code="REC"),
        ]
        db.add_all(destinos)
        db.commit()
    # Origens
    if not db.query(Destination).filter(Destination.code.in_(["POA","CWB","CNF","FOR","MAO"])).first():
        origens = [
            Destination(name="Porto Alegre", code="POA"),
            Destination(name="Curitiba", code="CWB"),
            Destination(name="Belo Horizonte", code="CNF"),
            Destination(name="Fortaleza", code="FOR"),
            Destination(name="Manaus", code="MAO"),
        ]
        db.add_all(origens)
        db.commit()
    # Bagagens
    if not db.query(Baggage).first():
        bagagens = [
            Baggage(name="Sem Bagagem", description="Apenas bagagem de mão (10kg)", weight=10, price=0),
            Baggage(name="Bagagem Básica", description="1 mala de 23kg", weight=23, price=150),
            Baggage(name="Bagagem Premium", description="2 malas de 23kg", weight=46, price=250),
        ]
        db.add_all(bagagens)
    # Voos de exemplo
    if not db.query(Flight).first():
        cidades = db.query(Destination).all()
        horarios = ["06:00", "08:30", "10:00", "14:00", "18:00"]
        precos = [450, 380, 420, 500, 390]
        duracoes = ["2h 30min", "3h", "2h", "2h 45min", "3h 10min"]
        for origem in cidades:
            for destino in cidades:
                if origem.id == destino.id:
                    continue
                # Pelo menos um voo por rota
                db.add(Flight(
                    origin_id=origem.id,
                    destination_id=destino.id,
                    departure_time=horarios[0],
                    duration=duracoes[0],
                    price=precos[0]
                ))
                # Mais voos para rotas populares (opcional)
                for i in range(1, 3):
                    db.add(Flight(
                        origin_id=origem.id,
                        destination_id=destino.id,
                        departure_time=horarios[i % len(horarios)],
                        duration=duracoes[i % len(duracoes)],
                        price=precos[i % len(precos)]
                    ))
        db.commit()
    # Assentos de exemplo para cada voo
    if not db.query(Seat).first():
        voos = db.query(Flight).all()
        for voo in voos:
            for row in ['A', 'B', 'C', 'D', 'E', 'F']:
                for num in range(1, 6):
                    seat_num = f"{row}{num}"
                    db.add(Seat(flight_id=voo.id, seat_number=seat_num, status='available'))
        db.commit()
    garantir_assentos_para_todos_voos(db)
    db.commit()
    db.close()

def garantir_assentos_para_todos_voos(db):
    voos = db.query(Flight).all()
    for voo in voos:
        assentos_existentes = db.query(Seat).filter(Seat.flight_id == voo.id).count()
        if assentos_existentes == 0:
            for row in ['A', 'B', 'C', 'D', 'E', 'F']:
                for num in range(1, 6):
                    seat_num = f"{row}{num}"
                    db.add(Seat(flight_id=voo.id, seat_number=seat_num, status='available'))
    db.commit()

# Dependência para obter sessão do banco

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Schemas Pydantic
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ReservationCreate(BaseModel):
    user_id: int
    flight_id: int
    seat_numbers: List[str]
    baggage_id: int
    origin_code: str | None = None
    destination_code: str | None = None

# Rotas de autenticação
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    hashed = pwd_context.hash(user.password)
    db_user = User(name=user.name, email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"id": db_user.id, "name": db_user.name, "email": db_user.email}

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    # Para simplificar, retorna apenas dados do usuário (implementar JWT depois)
    return {"id": db_user.id, "name": db_user.name, "email": db_user.email}

# Listar destinos
@app.get("/destinations")
def get_destinations(db: Session = Depends(get_db)):
    destinos = db.query(Destination).all()
    return [{"id": d.id, "name": d.name, "code": d.code} for d in destinos]

@app.get("/my-reservations")
def my_reservations(user_id: int, db: Session = Depends(get_db)):
    reservas = db.query(Reservation).filter(Reservation.user_id == user_id).all()
    return [
        {
            "id": r.id,
            "flight_id": r.flight_id,
            "seat_ids": r.seat_ids,
            "baggage_id": r.baggage_id,
            "created_at": r.created_at,
            "origin_code": r.origin_code,
            "destination_code": r.destination_code,
        }
        for r in reservas
    ]

@app.post("/reservation")
def create_reservation(reserva: ReservationCreate, db: Session = Depends(get_db)):
    # Atualizar status dos assentos
    for seat_num in reserva.seat_numbers:
        seat = db.query(Seat).filter(Seat.flight_id == reserva.flight_id, Seat.seat_number == seat_num).first()
        if not seat:
            raise HTTPException(status_code=404, detail=f"Assento {seat_num} não encontrado")
        if seat.status == 'reserved':
            raise HTTPException(status_code=400, detail=f"Assento {seat_num} já reservado")
        seat.status = 'reserved'
    # Criar reserva
    nova_reserva = Reservation(
        user_id=reserva.user_id,
        flight_id=reserva.flight_id,
        seat_ids=','.join(reserva.seat_numbers),
        baggage_id=reserva.baggage_id,
        created_at=datetime.datetime.now(),
        origin_code=reserva.origin_code,
        destination_code=reserva.destination_code
    )
    db.add(nova_reserva)
    db.commit()
    db.refresh(nova_reserva)
    return {
        "id": nova_reserva.id,
        "flight_id": nova_reserva.flight_id,
        "seat_ids": nova_reserva.seat_ids,
        "baggage_id": nova_reserva.baggage_id,
        "created_at": nova_reserva.created_at,
        "origin_code": nova_reserva.origin_code,
        "destination_code": nova_reserva.destination_code,
    }

@app.get("/reservation/{id}")
def get_reservation(id: int, db: Session = Depends(get_db)):
    reserva = db.query(Reservation).filter(Reservation.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada")
    return {
        "id": reserva.id,
        "flight_id": reserva.flight_id,
        "seat_ids": reserva.seat_ids,
        "baggage_id": reserva.baggage_id,
        "created_at": reserva.created_at,
        "user_id": reserva.user_id,
        "origin_code": reserva.origin_code,
        "destination_code": reserva.destination_code,
    }

@app.delete("/reservation/{id}")
def delete_reservation(id: int, db: Session = Depends(get_db)):
    reserva = db.query(Reservation).filter(Reservation.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada")
    # Liberar assentos
    seat_numbers = reserva.seat_ids.split(',')
    for seat_num in seat_numbers:
        seat = db.query(Seat).filter(Seat.flight_id == reserva.flight_id, Seat.seat_number == seat_num).first()
        if seat:
            seat.status = 'available'
    db.delete(reserva)
    db.commit()
    return {"detail": "Reserva excluída com sucesso"}

@app.get("/flights")
def get_flights(origin_code: str = Query(...), destination_code: str = Query(...), db: Session = Depends(get_db)):
    origem = db.query(Destination).filter(Destination.code == origin_code).first()
    destino = db.query(Destination).filter(Destination.code == destination_code).first()
    if not origem or not destino:
        return []
    voos = db.query(Flight).filter(Flight.origin_id == origem.id, Flight.destination_id == destino.id).all()
    return [
        {
            "id": v.id,
            "origin_id": v.origin_id,
            "destination_id": v.destination_id,
            "departure_time": v.departure_time,
            "duration": v.duration,
            "price": v.price,
        }
        for v in voos
    ]

@app.get("/seats")
def get_seats(flight_id: int, db: Session = Depends(get_db)):
    assentos = db.query(Seat).filter(Seat.flight_id == flight_id).all()
    return [
        {
            "id": s.id,
            "seat_number": s.seat_number,
            "status": s.status,
        }
        for s in assentos
    ]

@app.get("/baggage")
def get_baggage(db: Session = Depends(get_db)):
    bagagens = db.query(Baggage).all()
    return [
        {
            "id": b.id,
            "name": b.name,
            "description": b.description,
            "weight": b.weight,
            "price": b.price,
        }
        for b in bagagens
    ]

@app.get("/flight/{id}")
def get_flight(id: int, db: Session = Depends(get_db)):
    voo = db.query(Flight).filter(Flight.id == id).first()
    if not voo:
        raise HTTPException(status_code=404, detail="Voo não encontrado")
    origem = db.query(Destination).filter(Destination.id == voo.origin_id).first()
    destino = db.query(Destination).filter(Destination.id == voo.destination_id).first()
    return {
        "id": voo.id,
        "origin_id": voo.origin_id,
        "origin_code": origem.code if origem else None,
        "origin_name": origem.name if origem else None,
        "destination_id": voo.destination_id,
        "destination_code": destino.code if destino else None,
        "destination_name": destino.name if destino else None,
        "departure_time": voo.departure_time,
        "duration": voo.duration,
        "price": voo.price,
    } 