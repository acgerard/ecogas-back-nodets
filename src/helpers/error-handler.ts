

export function errorHandler(err: any, req: any, res: any, next: any) {
    if (typeof (err) === 'string') {
        // custom application error
        res.status(400).json({ message: err });
    } else if (err.name === 'NotFound') {
        res.status(404).send({message: err.message})
    } else {
        console.error(err.stack);
        res.status(500).send('Erf, something broke :/');
    }
}


export class NotFound {
        constructor(type: string, id: string) {
        let message = `${type} with id ${id} not found`;
        const error = Error(message)
        // set immutable object properties
        Object.defineProperty(error, 'message', {
            get() {
                return message;
            }
        });
        Object.defineProperty(error, 'name', {
            get() {
                return 'NotFound';
            }
        });
        // capture where error occured
        Error.captureStackTrace(error, NotFound);
        return error
    }
}