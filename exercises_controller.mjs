import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

/**
 * Create a new exercise with the data provided in the body
 */
app.post('/exercises', (req, res) => {
    res.status(501).send({ Error: "Not implemented yet" });
});


/**
 * Retrieve the exercise corresponding to the ID provided in the URL.
 */
app.get('/exercises/:_id', (req, res) => {
    res.status(501).send({ Error: "Not implemented yet" });
});

/**
 * Retrieve exercises. 
 */
app.get('/exercises', (req, res) => {
    res.status(501).send({ Error: "Not implemented yet" });
});

/**
 * Update the exercise whose id is provided in the path parameter and set
 * the values provided in the body.
 */
app.put('/exercises/:_id', (req, res) => {
    res.status(501).send({ Error: "Not implemented yet" });
});

/**
 * Delete the exercise whose id is provided in the query parameters
 */
app.delete('/exercises/:_id', (req, res) => {
    res.status(501).send({ Error: "Not implemented yet" });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});