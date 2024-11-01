// test/phonebook.test.js
const chai = require('chai');
const chaiHttp = require('chai-http')
const expect = chai.expect;

const Phonebook = require('../models/phonebook')
const app = require('../app.js'); // Adjust the path to your app's entry file
var testId = 0

chai.should();
chai.use(chaiHttp);

describe('Phonebook API', function () {

    describe('GET /phonebooks', function () {
        it('should retrieve a list of phonebooks', async function () {
            const res = await chai.request(app).get('/api/phonebooks').query({ page: 1, limit: 10 });
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('phonebooks').that.is.an('array');
            expect(res.body).to.have.property('page').that.equals(1);
            expect(res.body).to.have.property('limit').that.equals(10);
        });

        it('should return results filtered by keyword [name]', async function () {
            const res = await chai.request(app).get('/api/phonebooks').query({ keyword: 'Aa' });
            expect(res.status).to.equal(200);
            expect(res.body.phonebooks.every(pb => pb.name.includes('Aa') || pb.phone.includes('Aa'))).to.be.true;
        });

        it('should return results filtered by keyword [phone]', async function () {
            const res = await chai.request(app).get('/api/phonebooks').query({ keyword: '0811' });
            expect(res.status).to.equal(200);
            expect(res.body.phonebooks.every(pb => pb.name.includes('0811') || pb.phone.includes('0811'))).to.be.true;
        });
    });

    describe('POST /phonebooks', function () {
        it('should create a new phonebook entry [Test Person]', async function () {
            const newEntry = { name: 'Test Person', phone: '081299999999' };
            const res = await chai.request(app).post('/api/phonebooks').send(newEntry);
            expect(res.status).to.equal(201);
            expect(res.body).to.include(newEntry);
            testId = parseInt(res.body.id)
        });
    });

    describe('PUT /phonebooks/:id', function () {
        it('should update an existing phonebook entry [Test Person]', async function () {
            const updatedData = { name: 'Person Test', phone: '081211111111' };
            const res = await chai.request(app).put(`/api/phonebooks/${testId}`).send(updatedData); // Adjust id for actual data
            expect(res.status).to.equal(201);
            expect(res.body).to.include(updatedData);
        });
    });

    describe('DELETE /phonebooks/:id', function () {
        it('should delete an existing phonebook entry', async function () {
            const res = await chai.request(app).delete(`/api/phonebooks/${testId}`); // Adjust id for actual data
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('name');
            expect(res.body).to.have.property('phone');
        });
    });

    describe('PUT /phonebooks/:id/avatar', function () {
        it('should upload an avatar for a phonebook entry', async function () {
            const res = await chai.request(app)
                .put(`/api/phonebooks/${testId}/avatar`) // Adjust id for actual data
                .attach('avatar', 'test/fixtures/avatar-test.png'); // Adjust path to your test image
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('avatar');
        });
    });
});
