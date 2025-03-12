'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const {text, locale} = req.body;
      if (text == undefined || locale == undefined) return res.json({ error: 'Required field(s) missing' })
      if(text == '') return res.json({ error: 'No text to translate' })
      if(locale != 'american-to-british' || locale != 'british-to-american') return res.json({ error: 'Invalid value for locale field' });
      //shpuld handle time translation as well
      console.log(req.body);
      //return res.send("Tracking...");
      return res.status(201).json({ "text": "testing text", "translation": 'testing translation' });
    });
};
