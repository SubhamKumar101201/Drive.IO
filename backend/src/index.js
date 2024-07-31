import { app } from "./app.js";
import { connectDB } from "./db/index.js";

connectDB()
    .then(() => {

        app.on('error', (error) => {
            console.error(
                `Error: ${error}`
            );
            throw err;
        })

        app.listen(process.env.PORT || 4576, () => {
            console.log(
                `Server is running on port ${process.env.PORT || 4576}`
            )
        })

    })
    .catch((error) => {

        console.log(
            `Error connecting to MongoDB failed => ${error}`
        );
    
    })