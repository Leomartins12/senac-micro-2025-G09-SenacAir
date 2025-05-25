# Backend SenacAir (FastAPI + SQLite)

## Instalação

1. Acesse a pasta backend:
   ```bash
   cd backend
   ```
2. Crie um ambiente virtual (opcional, mas recomendado):
   ```bash
   python -m venv venv
   venv\Scripts\activate  # No Windows
   # source venv/bin/activate  # No Linux/Mac
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

## Execução

```bash
uvicorn main:app --reload
```

A API estará disponível em http://localhost:8000

A documentação automática estará em http://localhost:8000/docs 