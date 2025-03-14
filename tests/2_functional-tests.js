const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
    test('Translation with text and locale fields: POST request to /api/translate', function(done){
        chai
        .request(server)
        .post('/api/translate')
        .send({
            "text": "No Mr. Bond, I expect you to die.",
            "locale": "american-to-british"
        })
        .end((err, res) => {
            assert.equal(res.status, 201);
            assert.property(res.body, "translation");
            assert.property(res.body, "text");
            assert.equal(res.body.translation, `No <span class="highlight">Mr</span> Bond, I expect you to die.`);
            assert.equal(res.body.text, 'No Mr. Bond, I expect you to die.')
            done();
        })
    });
    
    test('Translation with text and invalid locale field: POST request to /api/translate', function(done){
        chai
        .request(server)
        .post('/api/translate')
        .send({
            "text": "No Mr. Bond, I expect you to die.",
            "locale": "american-to-jstd"
        })
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.property(res.body, "error");
            assert.equal(res.body.error, 'Invalid value for locale field')
            done();
        })
    });

    test('Translation with missing text field: POST request to /api/translate', function(done){
        chai
        .request(server)
        .post('/api/translate')
        .send({
            "locale": "american-to-british"
        })
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.property(res.body, "error");
            assert.equal(res.body.error, "Required field(s) missing");
            done();
        })
    });
    
    test('Translation with missing locale field: POST request to /api/translate', function(done){
        chai
        .request(server)
        .post('/api/translate')
        .send({
            "text": "No Mr. Bond, I expect you to die."
        })
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.property(res.body, "error");
            assert.equal(res.body.error, "Required field(s) missing");
            done();
        })
    });
    
    test('Translation with empty text: POST request to /api/translate', function(done){
        chai
        .request(server)
        .post('/api/translate')
        .send({
            "text": "",
            "locale": "american-to-british"
        })
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "error");
            assert.equal(res.body.error, "No text to translate");
            done();
        })
    });

    test('Translation with text that needs no translation: POST request to /api/translate', function(done){
        chai
        .request(server)
        .post('/api/translate')
        .send({
            "text": "Mango is my favorite",
            "locale": "british-to-american"
        })
        .end((err, res) => {
            assert.equal(res.status, 201)
            assert.property(res.body, "translation");
            assert.equal(res.body.translation, "Everything looks good to me!")
            done();
        })
    });
});
