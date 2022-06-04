import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);


// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

/**
 * Define the schema
 */
const exerciseSchema = mongoose.Schema({
    name: { type: String, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    unit: { type: String, required: true },
    date: { type: String, required: true }
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Exercise = mongoose.model("Exercise", exerciseSchema);

/*
Finds all exercises
*/
export async function findExercises(filter) {
    return await Exercise.find(filter);
}

/*
Deletes specified exercise. Returns amount deleted.
*/
export async function deleteById(_id) {
    const result = await Exercise.deleteMany({ _id: _id });
    return result.deletedCount;
}

/*
Updates specified exercise. Returns True if updated, else False.
*/
export function replaceExercise(_id, { name, reps, weight, unit, date }) {
    const info = {
        name: name,
        reps: reps,
        weight: weight,
        unit: unit,
        date: date
    }
    return Exercise.findByIdAndUpdate(_id, info, (err, updated) => {
        if (err) {
            console.error(err);
            return false
        }
        if (updated) {
            return true;
        }
        return false;
    })
}

/*
Create a new exercise
*/
export function createExercise({ name, reps, weight, unit, date }) {
    const info = {
        name: name,
        reps: reps,
        weight: weight,
        unit: unit,
        date: date
    }

    const newExercise = new Exercise(info);

    return newExercise.save();
}