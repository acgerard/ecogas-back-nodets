import express, {Application, Request, Response} from 'express'
import cors from 'cors'
import {closeDB, initDB} from "./db/db";
import {errorHandler} from "./helpers/error-handler";
import {basicAuth} from './helpers/basic-auth';
import {create, resetPassword, update} from "./user/user-controller";
import {createUser, isUser} from "./user/user-repository";
import {createMeasure, getMeasures} from "./measure/measure-repository";

const app: Application = express()
app.use(express.json())
app.use(cors());
const port: number = 8066

// use basic HTTP auth to secure the api
app.use(basicAuth);

app.get('/ecogas/health', async (req: Request, res: Response) => {
    res.send('Hello world!')
})



// routes USER
app.post('/ecogas/users', create)
app.put('/ecogas/users/:email', update)
app.put('/ecogas/users/:email/reset', resetPassword)

// routes MEASURES
app.post('/ecogas/stations/:id/measures', createMeasure)
app.get('/ecogas/stations/:id/measures', getMeasures)


const adminLogin = 'admin@ecogas.com'
const server = app.listen(port, async function () {
    try {
        console.log(`Initializing database...`)
        await initDB()
        console.log(`Database initialized!`)
        console.log("Checking admin user...")

        if(!await isUser(adminLogin)) {
            await createUser(adminLogin, 'changeit')
            console.log(adminLogin + " user created")
        }
    } catch (e) {
        console.error(`Error initializing database`, e)
        process.exit(-1)
    }
    console.log(`App is listening on port ${port} !`)
})

app.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server')
    await closeDB()
    server.close(() => {
        console.log('HTTP server closed')
    })
})

app.use(errorHandler);

