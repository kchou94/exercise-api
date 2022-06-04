import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';
import { body, validationResult, checkSchema } from 'express-validator';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

/**
 * Create a new exercise with the data provided in the body
 */
app.post('/exercises',
    body('reps').isNumeric(),
    body('weight').isNumeric(),
    (req, res) => {
        try {
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                if (validatePost(req.body)) {
                    const result = exercises.createExercise(req.body);
                    res.status(201).json(result);
                } else {
                    res.status(400).json({ Error: "Invalid request" });
                }
            } else {
                res.status(400).json({ Error: "Invalid request" });
            }
        } catch (err) {
            console.error(err);
            res.status(500);
            res.send({ Error: err });
        }
    });

/* 
Validates request body
*/
function validatePost(body) {
    function hasProps(body) {
        const props = ["name", "reps", "weight", "unit", "date"];
        return props.every(prop => {
            return body.hasOwnProperty(prop) && body[prop] !== undefined
        });
    }

    function nameVal({ name }) {
        return typeof name === "string" && name.length > 0;
    }

    function repsVal({ reps }) {
        return reps > 0;
    }

    function weightVal({ weight }) {
        return weight > 0;
    }

    function unitVal({ unit }) {
        return unit === "kgs" || unit === "lbs";
    }

    function dateVal({ date }) {
        return isDateValid(date);
    }

    const arr = [hasProps, nameVal, repsVal, weightVal, unitVal, dateVal];

    return arr.every(fn => {
        return fn(body);
    });
}

/**
 * Retrieve the exercise corresponding to the ID provided in the URL.
 */
app.get('/exercises/:_id', async (req, res) => {
    try {
        const result = await exercises.findExercises({ _id: req.params._id });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(404);
        res.send({ Error: "Not found" });
    }
});

/**
 * Retrieve exercises. 
 */
app.get('/exercises', async (req, res) => {
    try {
        const result = await exercises.findExercises({});
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send({ Error: err });
    }
});

/**
 * Update the exercise whose id is provided in the path parameter and set
 * the values provided in the body.
 */
app.put('/exercises/:_id',
    body('reps').isNumeric(),
    body('weight').isNumeric(),
    (req, res) => {
        try {
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                if (validatePost(req.body)) {
                    const updated = exercises.replaceExercise(req.params._id, req.body);
                    if (updated) {
                        res.json({
                            _id: req.params._id,
                            name: req.body.name,
                            reps: req.body.reps,
                            weight: req.body.weight,
                            unit: req.body.unit,
                            date: req.body.date
                        });
                    } else {
                        res.status(404).json({ Error: 'Not found' });
                    }
                } else {
                    res.status(400).json({ Error: "Invalid request" });
                }
            } else {
                res.status(400).json({ Error: "Invalid request" });
            }
        } catch (err) {
            console.error(err);
            res.status(500);
            res.send({ Error: err });
        }
    });

/**
*
* @param {string} date
* Return true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
*/
function isDateValid(date) {
    // Test using a regular expression. 
    // To learn about regular expressions see Chapter 6 of the text book
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

/**
 * Delete the exercise whose id is provided in the query parameters
 */
app.delete('/exercises/:_id', async (req, res) => {
    try {
        const result = await exercises.deleteById(req.params._id);
        if (result > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ Error: 'Not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send({ Error: err });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});