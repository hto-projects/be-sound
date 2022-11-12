import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongo = new MongoClient(process.env.MONGO_URI);
const userCollection = db.collection('users');

export default async () => {
    const result = await userCollection.findOne({});
    console.log(result);
    mongo.close();
}
