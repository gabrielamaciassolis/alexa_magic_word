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
                    
     // Next Levels will have more letters              
    // const list_words = [
    //   {type:' an animal ', values:['DOG','CAT']},
    //   {type: ' a color ', values:['BLUE','YELLOW']},
    //   {type: ' a school thing ', values :['PENCIL','ERASER']}
    // ];
    
    //     const list_words = [
    //   {type:' an animal ', values:['DOG','CAT']},
    //   {type: ' a color ', values:['BLUE','YELLOW']},
    //   {type: ' a school thing ', values :['PENCIL','ERASER']}
    // ];
    
    const list_words = [
        {type:' an animal ', 
			values:[
			{name:'DOG',clues:[
			'It has four legs', 'It can be small like a Toy Poodle, Papillon or a Chihuahua', 'It can be giant like a Mastiff, Komondor, or Saint Bernard'
			]},
			{name:'CAT',clues: [
			'It is like a small dog', 'It says Miau', 'It is small'
			]}
	]},
        {type:' a color ', 
			values:[
			{name:'BLUE',clues:[
			'It has four legs', 'It can be small like a Toy Poodle, Papillon or a Chihuahua', 'It can be giant like a Mastiff, Komondor, or Saint Bernard'
			]},
			{name:'RED',clues: [
			'It is the color of the ', 'It says Miau', 'It is small'
			]}
	]},
        {type:' an number ', 
			values:[
			{name:'ONE',clues:[
			'It has four legs', 'It can be small like a Toy Poodle, Papillon or a Chihuahua', 'It can be giant like a Mastiff, Komondor, or Saint Bernard'
			]},
			{name:'TWO',clues: [
			'Toc Toc', 'How Many ', 'It is small'
			]}
	]},
    ];
	
    
                    
    var magic_word = '';
    var magic_word_type = '';
    var clues = [];
    var clue_counter = 0;
        
        
const handlers = {
    'LaunchRequest': function () {
   
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
     console.log('GetFact');
     var numberCorrectTotal = 0
     
  magic_word = '';
  magic_word_type = '';
  clues = [];
  clue_counter = 0;  
     
     
     var cw_index   = Math.floor(Math.random() * list_words.length);
         magic_word_type = list_words[cw_index].type
     var mw_index   = Math.floor(Math.random() * list_words[cw_index].values.length);
         magic_word = list_words[cw_index].values[mw_index].name;
         clues = list_words[cw_index].values[mw_index].clues;

    if(Object.keys(this.attributes).length === 0) { 
       this.attributes.wordsscores = {
         'numberCorrectTotal': 0,
         'type': {
         'animal': { 'numberCorrect': 0},
         'color': { 'numberCorrect': 0},
         'school thing': { 'numberCorrect': 0}
         }
       }; 
       
       
      this.response
     .speak('Hello! Is Nice to hear you!, Get ready with a piece of paper, and a pencil, <say-as interpret-as="interjection">okey dokey!</say-as>, <say-as interpret-as="interjection">Lets play!</say-as> , Lets find the Magic Word. It is ' + magic_word_type +', and It has ' + magic_word.length +' letters. Guess the letters one by one. Which one do you wanna try?')
     .listen('Which letter do you wanna try to guess the word?');
     
       
     } else {
         
      // Add variable to greetings
      this.response
     .speak(' Welcome Back!, I am so happy to hear you again, Your current score is '+ this.attributes.wordsscores.numberCorrectTotal +' Magic Word points, <say-as interpret-as="interjection">okey dokey!</say-as> <say-as interpret-as="interjection">Lets play!</say-as> find the Magic Word. It is ' + magic_word_type +', and It has ' + magic_word.length +' letters. Guess the letters one by one. Which one do you wanna try?')
     .listen('Which letter do you wanna try to guess the word?');
     
         
     }
     
        
         this.emit(':responseReady');
        
    },
 'AnswerIntent': function() {
     
    console.log('AnswerIntent');
     
  var lt =  this.event.request.intent.slots.letter.value;
  
      lt = lt.replace('.', '');
  var lt_string = lt.toUpperCase();
  var cw_c = magic_word.split(lt_string).length - 1;
   
   console.log(cw_c + ' & ' + lt_string + ' &  '+ lt + ' & ' + magic_word );
   
 var listenOnAnswer = '';
 
   if(cw_c != 0 ){
    listenOnAnswer = 'Let\'s try another letter or tell me what is the word you guess is the Magic Word we are looking for';
   }else{
     listenOnAnswer = 'I have some clues to get the Magic Word, just say, give me a clue!';
   }
    
    
     this.response
         .speak('The letter you said : ' + lt + ', is ' + cw_c +' times, Let\'s try another letter or, tell me the word you guess is the magic word')
         .listen('Let\'s try another letter or tell me the word you guess is the Magic Word we are looking for.');
    
      this.emit(':responseReady');
  }, 
  
   'WinIntent': function() {
     
  var wd =    this.event.request.intent.slots.words.value.toUpperCase();
   
  var feedback =  '';
   
     console.log('WIN: ' + wd + '-' + magic_word );
   
   if(wd == magic_word){
       // variable wahoo  - well done - wow  - yay  - yippee  - bravo - hurray
    feedback =   '<say-as interpret-as="interjection">WOW!</say-as> you did it, The Magic Word was, ' + wd + ', Your score is '+ this.attributes.wordsscores.numberCorrectTotal +' of Magic Word points!';
     this.attributes.wordsscores.numberCorrectTotal = this.attributes.wordsscores.numberCorrectTotal + 5 ;
       
   }else{
     // variables  good luck
     feedback =   '<say-as interpret-as="interjection">meow!</say-as> the word ' + wd + ', is not the correct one, the Magic word was ' + magic_word + ', <say-as interpret-as="interjection"> it\'s okay!</say-as>, <say-as interpret-as="interjection">Do you want to try Again?</say-as>, just say, Alexa, Start <say-as interpret-as="interjection">Magic Word!</say-as>' ;  
   }
    
     this.response
         .speak(feedback);
    
      this.emit(':responseReady');
  },  
  'ClueIntent': function () {
  
  var clue= '';
      clue = '<audio src="https://s3.amazonaws.com/alexastoryes/magic_word_clue_light.mp3" /> ';
      
      
    if (magic_word == '')
    {
        clue = 'not word to choose, Please say Stop and then say again ,<emphasis level="strong"> Start Magic Word!</emphasis>  '
        
    } else{
    
   switch (clue_counter) {
    case 0:
        clue += 'Here is your clue, It start with '+ magic_word.substring(0, 1)  + '<break time="1s"/>  and finishes with ' + magic_word.substring(magic_word.length-1, magic_word.length) + ' <break time="2s"/>';  
        break;
    case 1:
       clue += 'Here is your clue, <amazon:effect name="whispered"> It is '+ magic_word_type + '</amazon:effect> '; 
        break;
    case 2:
       clue += 'Here is your clue, It has ' + magic_word.length +' letters, Good Look!';  
        break;
    case 3:
        clue += 'Here is your clue, <emphasis level="strong"> It is '+ magic_word_type + '</emphasis> ';
        break;
   default:
    clue_counter = 1;
     clue += 'Here is your clue, <amazon:effect name="whispered"> It is '+ magic_word_type + '</amazon:effect> ';  
  }
   
   
    }      
    
    clue_counter++;
      
   this.response
     .speak(clue)
     .listen('Which letter do you wanna try to guess the word?');
      
     this.emit(':responseReady');
    },
   'TellMeAnswerIntent': function () {
       
    // variables:  hip hip hooray
    this.emit(':tell', 'Ok, The Magic Word is ' + magic_word + '' );
       
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
        
        
        
        
        
        // variables:  hip hip hooray
        this.emit(':tell', 'Ok, let\'s play again soon. Remember!,  you have '+ this.attributes.wordsscores.numberCorrectTotal +' Magic Word points! ' );
    },
  'SessionEndedRequest': function() {
    console.log('session ended!');
    this.emit(':saveState', true);
  }
};

exports.handler = function (event, context) {
    
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.dynamoDBTableName = 'MagicWordsPoints';
    alexa.registerHandlers(handlers);
    alexa.execute();
};
