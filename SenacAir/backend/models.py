from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class Destination(Base):
    __tablename__ = 'destinations'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False)

class Flight(Base):
    __tablename__ = 'flights'
    id = Column(Integer, primary_key=True, index=True)
    origin_id = Column(Integer, ForeignKey('destinations.id'))
    destination_id = Column(Integer, ForeignKey('destinations.id'))
    departure_time = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    origin = relationship('Destination', foreign_keys=[origin_id])
    destination = relationship('Destination', foreign_keys=[destination_id])

class Seat(Base):
    __tablename__ = 'seats'
    id = Column(Integer, primary_key=True, index=True)
    flight_id = Column(Integer, ForeignKey('flights.id'))
    seat_number = Column(String, nullable=False)
    status = Column(String, default='available')
    flight = relationship('Flight')

class Baggage(Base):
    __tablename__ = 'baggage'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    weight = Column(Integer)
    price = Column(Integer)

class Reservation(Base):
    __tablename__ = 'reservations'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    flight_id = Column(Integer, ForeignKey('flights.id'))
    seat_ids = Column(String)  # Ex: '12A,12B'
    baggage_id = Column(Integer, ForeignKey('baggage.id'))
    created_at = Column(DateTime)
    origin_code = Column(String, nullable=True)
    destination_code = Column(String, nullable=True)
    user = relationship('User')
    flight = relationship('Flight')
    baggage = relationship('Baggage') 