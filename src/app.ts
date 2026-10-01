import express from 'express';
import { logMiddleware } from './middlewares/log.middleware';
import  clientRouter  from './routes/client.routes';
import  instructorRouter  from './routes/instructor.routes';
import  appointmentRouter  from './routes/appointment.routes';


const app = express();
app.use(express.json());
app.use(logMiddleware);
app.use('/clients' , clientRouter);
app.use('/instructors' , instructorRouter);
app.use('/appointments' , appointmentRouter);
app.get('/canary-check', (req, res) => {
    res.status(200).json({
        success: true,
        message: "API da Clinica FisioV1 está operativa",
        timestamp: new Date().toISOString()
    });
});

export default app;