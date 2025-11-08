from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

# Database setup
DATABASE_URL = "sqlite:///./quiz_history.db"

# Connects to SQLite database
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a session
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Base class for all ORM models
Base = declarative_base()

# 2️ Define table structure
class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    title = Column(String, nullable=False)

    summary = Column(Text)         
    key_entities = Column(Text)     
    sections = Column(Text)        

    scraped_content = Column(Text) 
    full_quiz_data = Column(Text)   
    date_generated = Column(DateTime, default=lambda: datetime.now())  


# Automatically creates table if not exists
def init_db():
    """Creates all database tables if they don't exist."""
    Base.metadata.create_all(bind=engine)
