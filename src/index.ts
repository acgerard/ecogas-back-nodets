import express, {Application, Request, Response} from 'express'
import cors from 'cors'
import {closeDB, initDB} from "./db/db";
import {errorHandler} from "./helpers/error-handler";
import {basicAuth} from './helpers/basic-auth';
import {authenticate, create, getUsers, resetPassword, update} from "./user/user-controller";
import {createUser, isUser} from "./user/user-repository";
import {create as createMeasure, getAll as getMeasures} from "./measure/measure-controller";
import {createStation, createUserStation, deleteUserStation, getUserStation} from './station/station-controller';

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
app.post('/ecogas/users/authenticate', authenticate)
app.post('/ecogas/users', create)
app.get('/ecogas/users', getUsers)
app.put('/ecogas/users/:id', update)
app.put('/ecogas/users/:id/reset', resetPassword)
// user station
app.post('/ecogas/users/:userId/stations/:id', createUserStation)
app.delete('/ecogas/users/:userId/stations/:id', deleteUserStation)


// routes STATION
app.post('/ecogas/stations/:id', createStation)
app.get('/ecogas/stations', getUserStation)


// routes MEASURES
app.post('/ecogas/stations/:id/measures', createMeasure)
// with query parameters : startdate & granularity
app.get('/ecogas/stations/:id/measures', getMeasures)


const adminLogin = 'admin@ecogas.com'
const server = app.listen(port, async function () {
    try {
        console.log(`Initializing database...`)
        await initDB()
        console.log(`Database initialized!`)
        console.log("Checking admin user...")

        if(!await isUser(adminLogin)) {
            await createUser(adminLogin, 'admin', 'changeit')
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

