# SenacAir - Sistema de Venda de Passagens Aéreas

## Backend (FastAPI)

### Requisitos
- Python 3.10+
- pip

### Instalação
```bash
# Crie e ative um ambiente virtual
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Rode o backend
cd backend
uvicorn main:app --reload
```

### Observações
- O banco SQLite será criado automaticamente.
- Para produção, use um banco gerenciado (ex: Cloud SQL).

---

## Frontend (Next.js)

### Requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Instale as dependências
npm install
# ou
yarn install

# Rode o frontend
npm run dev
# ou
yarn dev
```

---

## Deploy no Google Cloud Platform (GCP)

### Backend
1. Faça upload do código (sem a pasta venv) para a VM ou serviço desejado.
2. Crie o ambiente virtual e instale as dependências:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
3. Configure firewall para liberar a porta 8000.

### Frontend
1. Faça upload do código do frontend.
2. Instale as dependências e rode:
   ```bash
   npm install
   npm run build
   npm start
   ```
3. Configure o domínio e variáveis de ambiente conforme necessário.

---

## Dicas
- Nunca copie a pasta `venv` ou `node_modules` para o servidor.
- Use sempre o `requirements.txt` e `package.json` para instalar dependências.
- Para dúvidas ou problemas, consulte a documentação do FastAPI, Next.js e GCP.

## Funcionalidades

- Área de login e cadastro
- Busca de voos
- Reserva de passagens
- Gerenciamento de perfil
- Histórico de compras 