import { CorsOptions } from "cors";
//console.log(process.argv);

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whitList = [process.env.FRONTEND_URL]

        if (process.argv[2] === '--api') { 
            whitList.push(undefined)
        }

        if (whitList.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Rechazado por CORS"));
        }
    },
}