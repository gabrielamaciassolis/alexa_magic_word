/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
* https://github.com/alexa/skill-sample-nodejs-fact
**/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

 
    const word_english = [
                        "DOG",
                        "BLUE",
                        "girl",
                        "apartment"
                    ];
                    
    const list_words = {
        'animal':['DOG','CAT'],
        'color':['BLUE','YELLOW'],
        'school thing':['PENCIL','NOTEBOOK']
    };
                    
                    
    var cw_index =0;
    var magic_word = '';
        
const handlers = {

    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {

      console.log('hola');

        cw_index = 1; //Math.floor(Math.random() * 3);
        magic_word = word_english[cw_index];
        
          this.response
         .speak('Okay, Lets start with the first Word. It has ' + magic_word.length +' letters. Guess the letters one by one. Which one do you wanna try?')
         .listen('Which letter do you wanna try to guess the word?');
        
         this.emit(':responseReady');
        
    },
 'AnswerIntent': function() {
     
  var lt =    this.event.request.intent.slots.letter.value;
      lt = lt.replace('.', '');
  var lt_string = lt.toUpperCase();
  var cw_c = magic_word.split(lt_string).length - 1;
   
   console.log(cw_c + ' & ' + lt_string + ' &  '+ lt + ' & ' + magic_word );
    
     this.response
         .speak('The letter you said : ' + lt + ', is ' + cw_c +' times, Try another letter or, Tell me the word you guess')
         .listen('Try another letter or Tell me the word you guess.');
    
      this.emit(':responseReady');
  }, 
  
   'WinIntent': function() {
     
  var wd =    this.event.request.intent.slots.words.value.toUpperCase();
   
  var feedback =  '';
   
   if(wd == magic_word){
       
    feedback =   'WOW you did it, The Magic Word was : ' + wd;
       
   }else{
     
     feedback =   'OMM the word :' + wd + ', is not the correct one, the Magic word is: ' + magic_word + ', Try again.' ;  
   }
    
     this.response
         .speak('WOW you did it, The Magic Word was : ' + wd);
    
      this.emit(':responseReady');
  },  
    'AMAZON.HelpIntent': function () {
        const speechOutput ='Help Message';
        const reprompt = 'Help Message';
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Ok, let\'s play again soon.');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Ok, let\'s play again soon.');
    },
};

exports.handler = function (event, context) {
    
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;

    alexa.registerHandlers(handlers);
    alexa.execute();
};
