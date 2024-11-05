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
            try {
                const res = await chai.request(app).get('/api/phonebooks').query({ page: 1, limit: 10 });
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('phonebooks').that.is.an('array').with.lengthOf.at.most(10);
                expect(res.body).to.have.property('page').that.equals(1);
                expect(res.body).to.have.property('limit').that.equals(10);
                expect(res.body).to.have.property('pages').that.is.an('number');
                expect(res.body).to.have.property('total').that.is.an('number');
            } catch (error) {
                expect.fail(`Error occurred: ${error.message}`);
            }
        });

        it('should return results filtered by keyword [name]', async function () {
            try {
                const res = await chai.request(app).get('/api/phonebooks').query({ keyword: 'Aa' });
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body.phonebooks.every(pb => pb.name.includes('Aa') || pb.phone.includes('Aa'))).to.be.true;
            } catch (error) {
                expect.fail(`Error occurred: ${error.message}`);
            }
        });

        it('should return results filtered by keyword [phone]', async function () {
            try {
                const res = await chai.request(app).get('/api/phonebooks').query({ keyword: '0811' });
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body.phonebooks.every(pb => pb.name.includes('0811') || pb.phone.includes('0811'))).to.be.true;
            } catch (error) {
                expect.fail(`Error occurred: ${error.message}`);
            }
        });
    });

    describe('POST /phonebooks', function () {
        it('should create a new phonebook entry [Test Person]', async function () {
            try {
                const newEntry = { name: 'Test Person', phone: '081299999999' };
                const res = await chai.request(app).post('/api/phonebooks').send(newEntry);
                expect(res.status).to.equal(201);
                expect(res).to.be.json;
                expect(res.body).to.have.property('id').that.is.a('number')
                expect(res.body).to.include(newEntry);
                expect(res.body).to.have.property('createdAt')
                expect(res.body).to.have.property('updatedAt')
                expect(res.body).to.have.property('avatar').that.is.a('null')
                testId = parseInt(res.body.id)
            } catch (error) {
                expect.fail(`Error occurred: ${error.message}`);
            }
        });

        it('should get error bad request', async function () {
            try {
                const newEntry = { name: 'Test Person Invalid' };
                const res = await chai.request(app).post('/api/phonebooks').send(newEntry);
                expect(res.status).to.equal(400);
                expect(res).to.be.json;
            } catch (error) {
                expect.fail(`Error occurred: ${error.message}`);
            }
        });

        it('should get error bad request', async function () {
            try {
                const newEntry = { phone: '0811' };
                const res = await chai.request(app).post('/api/phonebooks').send(newEntry);
                expect(res.status).to.equal(400);
                expect(res).to.be.json;
            } catch (error) {
                expect.fail(`Error occurred: ${error.message}`);
            }
        });
    });

    describe('PUT /phonebooks/:id', function () {
        it('should update an existing phonebook entry [Test Person]', async function () {
            try {
                const updatedData = { name: 'Person Test', phone: '081211111111' };
                const res = await chai.request(app).put(`/api/phonebooks/${testId}`).send(updatedData); // Adjust id for actual data
                expect(res.status).to.equal(201);
                expect(res).to.be.json;
                expect(res.body).to.have.property('id').that.is.a('number')
                expect(res.body).to.include(updatedData);
                expect(res.body).to.have.property('createdAt')
                expect(res.body).to.have.property('updatedAt')
                expect(res.body).to.have.property('avatar').that.is.a('null')
            } catch (error) {
                expect.fail(`Error occurred: ${error.message}`);
            }
        });
    });

    describe('PUT /phonebooks/:id/avatar', function () {
        it('should upload an avatar for a phonebook entry', async function () {
            try {
                const res = await chai.request(app)
                    .put(`/api/phonebooks/${testId}/avatar`) // Adjust id for actual data
                    .attach('avatar', 'test/fixtures/avatar-test.png'); // Adjust path to your test image
                expect(res.status).to.equal(201);
                expect(res).to.be.json;
                expect(res.body).to.have.property('id').that.is.a('number')
                expect(res.body).to.have.property('name').that.is.equal("Person Test")
                expect(res.body).to.have.property('phone').that.is.equal("081211111111")
                expect(res.body).to.have.property('createdAt')
                expect(res.body).to.have.property('updatedAt')
                expect(res.body).to.have.property('avatar').that.is.not.a('null')
            } catch (error) {
                expect.fail(`Error occurred: ${error.message}`);
            }
        });
    });

    describe('DELETE /phonebooks/:id', function () {
        it('should delete an existing phonebook entry', async function () {
            try {
                const res = await chai.request(app).delete(`/api/phonebooks/${testId}`); // Adjust id for actual data
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('id').that.is.a('number')
                expect(res.body).to.have.property('name').that.is.equal("Person Test")
                expect(res.body).to.have.property('phone').that.is.equal("081211111111")
                expect(res.body).to.have.property('createdAt')
                expect(res.body).to.have.property('updatedAt')
            } catch (error) {
                expect.fail(`Error occurred: ${error.message}`);
            }
        });
    });
});
