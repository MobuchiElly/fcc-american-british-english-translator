const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

/*
    Get the key value lookups
    word spellings: americanOnly, americanToBritishSpelling
                     britishOnly, reverse americanToBritishSpelling
    titles: americanToBritishTitles
            reverse americanToBritishTitles
    time: regex for 
*/

class Translator {
    constructor(text, locale){
        this.text = text;
        this.locale = locale;
    }
    translate(text, locale){ //havent inplemnted time yet
        let sanitisedText = this.sanitiseInput(text);
        let translation = sanitisedText;
        if (locale == "american-to-british"){
            let americanDict = this.combineObjs(americanOnly, americanToBritishSpelling, americanToBritishTitles);
            for (const [key, value] of Object.entries(americanDict)){
                let regex = new RegExp(`\\b${key}\\b`, `gi`);
                // let regex = /\b${key}\b/gi;
                //console.log(regex)
                translation = translation.replace(regex, `<span class="highlight">${value}</span>`);
            }
        }
        if (locale == "british-to-american"){
            const britishToAmericanSpelling = this.reverseObj(americanToBritishSpelling);
            const britishToAmericanTitles = this.reverseObj(americanToBritishTitles);
            const britishDict = this.combineObjs(britishOnly, britishToAmericanSpelling, britishToAmericanTitles)
            for (const [key, value] of Object.entries(britishDict)){
                let regex = new RegExp(`\\b${key}\\b`, `gi`);
                translation = translation.replace(regex, `<span class="highlight">${value}</span>`);
            }
        }
        return translation == sanitisedText ? "Everything looks good to me!" : translation;
    }
    sanitiseInput(text){
        return text.trim();
    }
    combineObjs(obj1, obj2, obj3){
        const combinedDict = {};
        
        for (const [key, value] of Object.entries(obj1)) combinedDict[key] = value;
        
        for (const [key, value] of Object.entries(obj2)) combinedDict[key] = value;

        for (const [key, value] of Object.entries(obj3)) combinedDict[key] = value;

        return combinedDict;
    }
    reverseObj(obj){
        let reversedObj = {};    
        for (let [key, value] of Object.entries(obj)) reversedObj[value] = key;
        return reversedObj;
    }
}

module.exports = Translator;