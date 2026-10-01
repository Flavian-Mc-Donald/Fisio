import app from './app';
import { connectDB } from './config/database';

const PORT = 3000;

async function startServer() {
  // 1. Conecta ao banco de dados MongoDB (FISIOV01)
  await connectDB();

  // 2. Inicia o servidor Express após a conexão bem-sucedida
  app.listen(PORT, () => {
    console.log(`[FisioV1] Servidor rodando na porta ${PORT} conectado ao MongoDB`);
  });
}

startServer();