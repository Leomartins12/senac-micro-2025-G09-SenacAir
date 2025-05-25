# Documentação da API SenacAir

## Autenticação

### POST /register
- Cadastro de novo usuário
- Body: {"name": "string", "email": "string", "password": "string"}
- Response: 201 Created ou 400 (email já cadastrado)

### POST /login
- Login de usuário
- Body: {"email": "string", "password": "string"}
- Response: 200 OK (token) ou 401 (credenciais inválidas)

---

## Destinos

### GET /destinations
- Lista todos os destinos
- Response: 200 OK (lista de destinos)

---

## Voos

### GET /flights?destination_id=ID
- Lista voos para um destino
- Response: 200 OK (lista de voos)

---

## Assentos

### GET /seats?flight_id=ID
- Lista assentos de um voo
- Response: 200 OK (lista de assentos)

### POST /seats/select
- Seleciona assentos para reserva
- Body: {"flight_id": int, "seat_numbers": ["12A", "12B"]}
- Response: 200 OK ou 400 (assento ocupado)

---

## Bagagem

### GET /baggage
- Lista tipos de bagagem
- Response: 200 OK (lista de opções)

---

## Reserva

### POST /reservation
- Cria uma reserva
- Body: {"user_id": int, "flight_id": int, "seat_numbers": ["12A"], "baggage_id": int}
- Response: 201 Created (dados da reserva)

### GET /reservation/{id}
- Detalhes de uma reserva
- Response: 200 OK (dados da reserva)

### GET /my-reservations
- Lista reservas do usuário autenticado
- Response: 200 OK (lista de reservas) 