require("dotenv").config();
import { listen } from "./src/app.js";
import connectToDB from "./src/config/database.js";


connectToDB();

listen(3000, () => {
    console.log("Server is running on port 3000");
})
