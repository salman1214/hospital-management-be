const request = require('supertest');
const app = require('../../app');
const knex = require('../../db');

describe('Treatment Endpoints', () => {

    beforeAll(async () => {
        await knex.migrate.latest();
        await knex.seed.run();
    });

    it('should create a treatment', async () => {
        const res = await request(app)
            .post('/api/treatments')
            .send({
                treatment: {
                    description: 'Description 1',
                    treatment_date: '2022-12-12',
                    patient_id: 1,
                },
                prescription: {
                    medicine: 'Medicine 1',
                    dosage: 'Dosage 1',
                    duration: '4 days',
                }
            });
        if (res.statusCode === 401) {
            expect(res.error.text).toEqual('Access Denied');
        } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('treatment');
        }
    });

    it('should get all treatments', async () => {
        const res = await request(app).get('/api/treatments/all');
        if (res.statusCode === 401) {
            expect(res.error.text).toEqual('Access Denied');
        } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('All treatments fetched successfully');
            expect(res.body.treatments).toBeInstanceOf(Array);
        }
    });

    it('should get a treatment by id', async () => {
        const res = await request(app).get('/api/treatments/1');
        if (res.statusCode === 404) {
            expect(JSON.parse(res.error.text).message).toEqual('Treatment not found');
        } else if (res.statusCode === 401) {
            expect(res.error.text).toEqual('Access Denied');
        } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.treatment).toHaveProperty('id');
        }
    });

    it('should update a treatment', async () => {
        const res = await request(app)
            .patch('/api/treatments/1')
            .send({
                description: 'Description 2',
            });
        if (res.statusCode === 404) {
            expect(JSON.parse(res.error.text).message).toEqual('Treatment not found');
        } else if (res.statusCode === 401) {
            expect(res.error.text).toEqual('Access Denied');
        } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.treatment).toEqual(1);
        }
    });

    it('should delete a treatment', async () => {
        const res = await request(app).delete('/api/treatments/1');
        if (res.statusCode === 404) {
            expect(JSON.parse(res.error.text).message).toEqual('Treatment not found');
        } else if (res.statusCode === 401) {
            expect(res.error.text).toEqual('Access Denied');
        } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.treatment).toEqual(1);
        }
    });

    afterAll(async () => {
        await knex.destroy(); // This closes the Knex connection to the database
    });
});