'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  const translator = new Translator();
  

  app.route('/api/translate')
    .post((req, res) => {
      const {text, locale} = req.body;
      
      if (text == undefined || locale == undefined) return res.status(200).json({ 'error': 'Required field(s) missing' })
      if(text == '') return res.status(200).json({ 'error': 'No text to translate' })
      if(locale != 'american-to-british' && locale != 'british-to-american') return res.status(200).json({ 'error': 'Invalid value for locale field' });
      
      const translation = translator.translate(text, locale);

      return res.status(201).json({ text, translation });
    });
};