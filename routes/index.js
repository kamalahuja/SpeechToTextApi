// Requires request and request-promise for HTTP requests
// e.g. npm install request request-promise
const rp = require('request-promise');
// Requires fs to write synthesized speech to a file
const fs = require('fs');
// Requires readline-sync to read command line inputs
const readline = require('readline-sync');
// Requires xmlbuilder to build the SSML body
const xmlbuilder = require('xmlbuilder');


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/AudioFileForFirstPage', function(req, res, next) {
  console.log("Here we rceived request");
  console.log("Recieved Requets here");
  const subscriptionKey = '7dc64522d036436babc8c7ddd8b1f7bf';
  const accessToken =   getAccessToken(subscriptionKey);
  accessToken.then(function(response) {
    console.log("received access token here =>");
      console.log(response);
    // let returnResponse =  textToSpeech(response, "My Hello World Text");
     let xml_body = xmlbuilder.create('speak')
     .att('version', '1.0')
     .att('xml:lang', 'en-us')
     .ele('voice')
     .att('xml:lang', 'en-us')
     .att('name', 'Microsoft Server Speech Text to Speech Voice (en-US, Guy24KRUS)')
     .txt("Sample Text Here")
     .end();
 // Convert the XML into a string to send in the TTS request.
 let body = xml_body.toString();

 let options = {
     method: 'POST',
     baseUrl: 'https://eastus.tts.speech.microsoft.com/',
     url: 'cognitiveservices/v1',
     headers: {
         'Authorization': 'Bearer ' + response,
         'cache-control': 'no-cache',
         'User-Agent': 'ClientReporitngTextToSpeechApiV2',
         'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
         'Content-Type': 'application/ssml+xml'
     },
     body: body
 }
 
 let request = rp(options)
     .on('response', (response) => {
       console.log("Got response here => ********");
       console.log(response.statusCode);
         if (response.statusCode === 200) {
          
             request.pipe(res);
             //res.end();
             console.log('\nYour file is ready.\n')
         }
     });
     
  });
  console.log("accesss OTken");
  console.log(accessToken);
  
  try {
    //res.send("Hello World");
    
} catch (err) {
    console.log(`Something went wrong: ${err}`);
}
});


// Gets an access token.
async function  getAccessToken(subscriptionKey) {
  let options = {
      method: 'POST',
      uri: 'https://eastus.api.cognitive.microsoft.com/sts/v1.0/issuetoken',
      headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey
      }
  }
  return rp(options);
}

// Make sure to update User-Agent with the name of your resource.
// You can also change the voice and output formats. See:
// https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#text-to-speech
function textToSpeech(accessToken, text, responseParam) {
  // Create the SSML request.
  let xml_body = xmlbuilder.create('speak')
      .att('version', '1.0')
      .att('xml:lang', 'en-us')
      .ele('voice')
      .att('xml:lang', 'en-us')
      .att('name', 'Microsoft Server Speech Text to Speech Voice (en-US, Guy24KRUS)')
      .txt(text)
      .end();
  // Convert the XML into a string to send in the TTS request.
  let body = xml_body.toString();

  let options = {
      method: 'POST',
      baseUrl: 'https://eastus.tts.speech.microsoft.com/',
      url: 'cognitiveservices/v1',
      headers: {
          'Authorization': 'Bearer ' + accessToken,
          'cache-control': 'no-cache',
          'User-Agent': 'ClientReporitngTextToSpeechApiV2',
          'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
          'Content-Type': 'application/ssml+xml'
      },
      body: body
  }
  
  let request = rp(options)
      .on('response', (response) => {
        console.log("Got response here => ********");
        console.log(response.statusCode);
          if (response.statusCode === 200) {
            
              request.pipe(fs.createWriteStream('TTSOutput.wav'));
              console.log('\nYour file is ready.\n')
          }
      });
  return request;
}

module.exports = router;
