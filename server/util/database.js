import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongo = new MongoClient(process.env.MONGO_URI);
const db = mongo.db('besound');
const userCollection = db.collection('users');

export const db_findOne = (requirements) => {
    try {
        const result = userCollection.findOne(requirements);
        return result;
    }
    catch (error) {
        console.warn(error);
        return null;
    }
};

export const db_findAll = (requirements) => {
    try {
        const cursor = userCollection.find(requirements);
        const results = cursor.toArray();
        return results;
    }
    catch (error) {
        console.warn(error);
        return null;
    }
};

export const db_createUser = async (properties) => {
    try {
        const inserted = await userCollection.insertOne(properties);
        return inserted;
    } catch (error) {
        throw (new Error(`Unable to create User! ${error}`));
    }
};

export const db_updateOne = async (document, newProperties) => {
    try {
        const result = await userCollection.updateOne(document, newProperties);
        return result;
    }
    catch (error) {
        console.warn(error);
        return null;
    }
};
