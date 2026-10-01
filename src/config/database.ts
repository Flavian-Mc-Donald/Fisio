import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://adminfisiomongo:123456INFNET@localhost:27017/FISIOV01?authSource=admin';

    await mongoose.connect(mongoURI);

    console.log('[FisioV1] Conexão com o MongoDB (FISIOV01) estabelecida com sucesso!');
  } catch (error) {
    console.error('[FisioV1] Erro crítico ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log('[FisioV1] Conexão com o MongoDB encerrada.');
};