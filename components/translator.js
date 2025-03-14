const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')



class Translator {
    constructor(text, locale){
        this.text = text;
        this.locale = locale;
    }
    translate(text, locale){
        text = this.sanitiseInput(text);
        let translation = text;
        if (locale == "american-to-british"){
            translation = this.translateText(translation, americanOnly, americanToBritishSpelling);
            translation = this.translateTitle(translation, americanToBritishTitles);
            translation = this.translateTime(translation, "american-to-british")
        }
        if (locale == "british-to-american"){
            translation = this.translateText(translation, britishOnly, this.reverseObj(americanToBritishSpelling));
            translation = this.translateTitle(translation, this.reverseObj(americanToBritishTitles));
            translation = this.translateTime(translation, "british-to-american")
        }
        
        return translation == text ? "Everything looks good to me!" : translation;
    }

    translateText(text, obj1, obj2){
        for (const [key, val] of Object.entries(obj1)){
            let regex = new RegExp(`\\b${key}\\b`, `gi`);
            text = text.replace(regex, `<span class="highlight">${val}</span>`);
        }
        for (const [key, val] of Object.entries(obj2)){
            let regex = new RegExp(`\\b${key}\\b`, `gi`);
            text = text.replace(regex, `<span class="highlight">${val}</span>`);
        }
        return text;
    }


    translateTitle(text, obj, locale){
        for (const [key, val] of Object.entries(obj)){
            const regex = new RegExp(`(?<!\\w)${key}\\.?(?=\\b|\\s|$)`, "gi"); 
            const regex2 = new RegExp(`(?<!\\w)${val}\\.?(?=\\b|\\s|$)`, "gi"); 
            //but if the match matches with val just update with val to uppercase(no highlight to)
            text = text.replace(regex, `<span class="highlight">${val.charAt(0).toUpperCase() + val.slice(1)}</span>`);
        }
        return text;
    }

    translateTime(text, locale){
        if(locale == "american-to-british"){
            text = text.replace(/(\d{1,2}):(\d{2})/g, `<span class="highlight">$1.$2</span>`);
        } else if (locale == "british-to-american"){
            text = text.replace(/(\d{1,2})\.(\d{2})/g, `<span class="highlight">$1:$2</span>`);
        }
        return text;
    }
    sanitiseInput(text){
        return text.trim();
    }
    
    reverseObj(obj){
        let reversedObj = {};
        for (let [key, value] of Object.entries(obj)) reversedObj[value] = key;
        return reversedObj;
    }
}

module.exports = Translator;