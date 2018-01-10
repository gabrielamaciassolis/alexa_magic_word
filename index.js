/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
* https://github.com/alexa/skill-sample-nodejs-fact
**/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.1aa703da-8470-42f0-adf7-13269c5cb7c1';  // TODO replace with your app ID (OPTIONAL).

    const list_words = [
        {type:' an animal ', 
			values:[
			{name:'DOG',clues:[
			'It has four legs', 'It can be small like a Toy Poodle, Papillon or a Chihuahua or It can be giant like a Mastiff, Komondor, or Saint Bernard'
			]},
			{name:'CAT',clues: [
			'It is like a small dog', 'It says Miau'
			]}
	]},
        {type:' a color ', 
			values:[
			{name:'BLUE',clues:[
			'It is the color od the sky!', 'is the color of the sea!'
			]},
			{name:'RED',clues: [
			'It is the color of the apple', 'It is the color of the cherry!'
			]}
	]},
        {type:' an number ', 
			values:[
			{name:'ONE',clues:[
			'It is the first number after Zero', 'It is before two'
			]},
			{name:'TWO',clues: [
			'Is the number of ears we have', 'Is the number just after One '
			]}
	]},
	        {type:' a place ', 
			values:[
			{name:'BEACH',clues:[
			'It is blue and is plenty of salty water', 'It is like a giant pool free with fishes'
			]},
			{name:'PARK',clues: [
			'This place is so good to play', 'On this place usually there are a lot of kids playing ball games'
			]}
	]},
		    {type:' a Fruit ', 
			values:[
			{name:'PEAR',clues:[
			'This fruit is green outside and white inside', 'This fruit is so juicy and sweet '
			]},
			{name:'BANANA',clues: [
			'This fruit is yellow from outside and white inside', 'This fruit is a little like a cucumber, but is soft and sweet '
			]}
	]}
    ];
	
    
                    
    var magic_word = '';
    var magic_word_type = '';
    var clues = [];
    var clue_counter = 0;
    var clue_used = 0;
        
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
     
  var intro = '<audio src="https://s3.amazonaws.com/alexastoryes/MagicWord+Intro.mp3" />'
     
     var cw_index   = Math.floor(Math.random() * list_words.length);
         magic_word_type = list_words[cw_index].type
     var mw_index   = Math.floor(Math.random() * list_words[cw_index].values.length);
         magic_word = list_words[cw_index].values[mw_index].name;
         clues = list_words[cw_index].values[mw_index].clues;

    if(Object.keys(this.attributes).length === 0) { 
       this.attributes.wordsscores = {
         'numberCorrectTotal': 0
       }; 
       
       
      this.response
     .speak(intro +' Hello! It is Nice to hear you!, Get ready with a piece of paper, and a pencil, <say-as interpret-as="interjection">okey dokey!</say-as>, <say-as interpret-as="interjection">Lets play!</say-as> , Lets find the Magic Word. It is ' + magic_word_type +', and It has ' + magic_word.length +' letters. Guess the letters one by one, or tell me the magic word, Which one do you wanna try?')
     .listen('Which letter do you wanna try to guess the word?');
     
       
     } else {
        
        var ifScore = '';
        if (this.attributes.wordsscores.numberCorrectTotal > 0)
       { ifScore =  'Your current score is '+ this.attributes.wordsscores.numberCorrectTotal +' Magic Word points,'}
    
    
    // Add Welcome      
      this.response
     .speak(intro +' Welcome Back!, I am so happy to hear you again, '+ ifScore +' <say-as interpret-as="interjection">okey dokey!</say-as> <say-as interpret-as="interjection">Lets play!</say-as> find the Magic Word. It is ' + magic_word_type +', and It has ' + magic_word.length +' letters. Guess the letters one by one. Which one do you wanna try?')
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
    listenOnAnswer = 'The letter you said : ' + lt +' is ' + cw_c +' times, Let\'s try another letter or, tell me which one is the word you guess is the Magic Word!';
   }else{
       
        //     if (this.event.request.intent.slots.letter.resolutions.resolutionsPerAuthority.status.code == 'ER_SUCCESS_NO_MATCH' ){
        //       listenOnAnswer = 'Hmm the word that i understand is not the magic word or a letter into it, I have some clues to get the Magic Word, just say, give me a clue!, or try another letter';
        //   }
       
     listenOnAnswer = 'The letter you said : ' + lt +' is not in the magic word, I have some clues to get the Magic Word, just say, give me a clue!, or try another letter';
   }
   

    
    
     this.response
         .speak( listenOnAnswer)
         .listen('Let\'s try another letter or tell me the word you guess is the Magic Word we are looking for.');
    
      this.emit(':responseReady');
  }, 
  
   'WinIntent': function() {
     
  var wd =    this.event.request.intent.slots.words.value.toUpperCase();
   
  var feedback =  '';
   
     console.log('WIN: ' + wd + '-' + magic_word );
   
   if(wd == magic_word){
       
       
      var  scoreValue = 5;
       
       if(clue_used == 1)
       {
           scoreValue = 3;
           
       }else if (clue_used == 2 ){
           
           scoreValue = 1;
       } 

       var positive_var =  '<audio src="https://s3.amazonaws.com/alexastoryes/win.mp3" /> ';
       
       this.attributes.wordsscores.numberCorrectTotal = this.attributes.wordsscores.numberCorrectTotal + scoreValue ;
       
        var positiveList = ['<say-as interpret-as="interjection">hip hip hooray!</say-as>',
                            '<say-as interpret-as="interjection">wahoo!</say-as>',
                            '<say-as interpret-as="interjection">well done!</say-as>',
                            '<say-as interpret-as="interjection">WOW!</say-as>',
                            '<say-as interpret-as="interjection">yay!</say-as>',
                            '<say-as interpret-as="interjection">yippee!</say-as>',
                            '<say-as interpret-as="interjection">bravo!</say-as>',
                            '<say-as interpret-as="interjection">hurray!</say-as>'];
                            
         positive_var +=positiveList[ Math.floor(Math.random() * positiveList.length)];

    feedback =   positive_var +' you did it!, The Magic Word was, ' + wd + ', Your score is '+ this.attributes.wordsscores.numberCorrectTotal +' of Magic Word points!, Do you want to play again?, just say, Alexa, start Magic Word';
       
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
        clue += 'Here is your clue,The Magic Word starts with '+ magic_word.substring(0, 1)  + '<break time="1s"/>  and finishes with ' + magic_word.substring(magic_word.length-1, magic_word.length) + ' <break time="2s"/>';  
        break;
    case 1:
        clue += 'Here is your clue, <emphasis level="strong"> It is '+ magic_word_type + '</emphasis> ';
        break;
    case 2:
       clue += 'Here is your clue, It has ' + magic_word.length +' letters, You can get it!';  
        break;
    case 3:
       clue += clues[1];  
       clue_used = 1;
        break;
    case 4:
        clue += clues[2];
        clue_used = 2;
        break;
   default:
    clue_counter = 0;
     clue += '<say-as interpret-as="interjection">aha!</say-as> You want to know the answer right?, Just say, Tell me the Magic Word or just say help, to hear how to play Magic Word';  
  }
   
   
    }      
    
    clue_counter++;
      
   this.response
     .speak(clue)
     .listen('Which letter do you wanna try to guess the Magic Word?');
      
     this.emit(':responseReady');
    },
   'TellMeAnswerIntent': function () {
       
       var positive_var= '';
               var positiveList = ['<say-as interpret-as="interjection">OKy!</say-as>',
                            '<say-as interpret-as="interjection">wahoo!</say-as>',
                            '<say-as interpret-as="interjection">yay!</say-as>',
                            '<say-as interpret-as="interjection">yippee!</say-as>',
                            '<say-as interpret-as="interjection">hurray!</say-as>'];
                            
         positive_var +=positiveList[ Math.floor(Math.random() * positiveList.length)];
       
    // variables:  hip hip hooray
    this.emit(':tell',positive_var + ', The Magic Word is <audio src="https://s3.amazonaws.com/alexastoryes/magic_word_clue_light.mp3" /> ' + magic_word + '' );
       
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput =' This is the Alexa skill, Magic Word!. You should try to find the magic word,'+
' i can provide you clues, you can say the letters of the alphabeth, '+
' and i will tell you, if it exist, and how many times it is on the magic word,'+
' as soon as you know which one is the magic word, just <say-as interpret-as="interjection">Yell it to me!</say-as>,'+
' ,and you will get 5 magic points, If you use four clues,'+
' your will get three points and, if you use more than four clues you will get 1 point if you tell me the magic word finally,'+
' But In case you want to know which one was it, Just say, Tell me the Magic Word!,  <say-as interpret-as="interjection">Lets play!</say-as>,  Just say, Alexa, Start Magic Word!';

        this.emit(':ask', speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Ok, let\'s play again soon. Just say, Alexa, Start Magic Word!');
    },
    'AMAZON.StopIntent': function () {
        
        var intro = '<audio src="https://s3.amazonaws.com/alexastoryes/MagicWord+Intro.mp3" />'
        
        var positiveList = ['<say-as interpret-as="interjection">hip hip hooray!</say-as>',
                            '<say-as interpret-as="interjection">Ok!</say-as>'];
                            
        var positive_var =positiveList[ Math.floor(Math.random() * positiveList.length)];
       
       
       var count_msg = '';
       if(this.attributes.wordsscores.numberCorrectTotal != 0)
       {
           count_msg =  'Remember!, you have '+ this.attributes.wordsscores.numberCorrectTotal +' Magic Word points!, share it with your friends.';
       }
       else{
           count_msg = ' Just say, Alexa, Start Magic Word!'
       }
        
        this.emit(':tell', positive_var +', let\'s play again soon. '+ count_msg + intro );
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
