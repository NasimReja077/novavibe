import { connect } from "mongoose";

function connectToDB() {
    connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Connected to DB")
        })
        .catch(err => {
            console.log("Error connecting to DB", err)
        })
}

export default connectToDB;