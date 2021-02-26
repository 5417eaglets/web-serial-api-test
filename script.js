/*
 * @license
 * Getting Started with Web Serial Codelab (https://todo)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */

//more info from this article: https://codelabs.developers.google.com/codelabs/web-serial#0
'use strict';

let port;
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;

const log = document.getElementById('log');
const ledCBs = document.querySelectorAll('input.led');
const divLeftBut = document.getElementById('leftBut');
const divRightBut = document.getElementById('rightBut');
const butConnect = document.getElementById('butConnect');

const GRID_HAPPY = [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,1,1,1,0];
const GRID_SAD =   [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,1,0,0,0,1];
const GRID_OFF =   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const GRID_HEART = [0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,0];

//this is the actual result of the compiled hex file
var hexCode = `:100000000C945D000C9485000C9485000C94850084
:100010000C9485000C9485000C9485000C9485004C
:100020000C9485000C9485000C9485000C9485003C
:100030000C9485000C9485000C9485000C9485002C
:100040000C9459020C9485000C9427020C94010224
:100050000C9485000C9485000C9485000C9485000C
:100060000C9485000C9485000000000024002700FB
:100070002A0000000000250028002B0004040404CE
:100080000404040402020202020203030303030342
:10009000010204081020408001020408102001021F
:1000A00004081020000000080002010000030407FB
:1000B00000000000000000007C0311241FBECFEFF1
:1000C000D8E0DEBFCDBF11E0A0E0B1E0E2E6F7E0AE
:1000D00002C005900D92A832B107D9F721E0A8E23D
:1000E000B1E001C01D92AE3CB207E1F710E0CDE5F2
:1000F000D0E004C02197FE010E94A903CC35D107AE
:10010000C9F70E94A3020C94AF030C940000E1EB2A
:10011000F0E02491EDE9F0E09491E9E8F0E0E49179
:10012000EE23C9F0222339F0233001F1A8F4213065
:1001300019F1223029F1F0E0EE0FFF1FEE58FF4FCA
:10014000A591B4912FB7F894EC91811126C09095A8
:100150009E239C932FBF08952730A9F02830C9F023
:10016000243049F7209180002F7D03C0209180002A
:100170002F7720938000DFCF24B52F7724BDDBCFEE
:1001800024B52F7DFBCF2091B0002F772093B000B6
:10019000D2CF2091B0002F7DF9CF9E2BDACFAF9236
:1001A000BF92CF92DF92EF92FF920F931F93CF9364
:1001B000DF936C017B018B01040F151FEB015E01C6
:1001C000AE18BF08C017D10759F06991D601ED915B
:1001D000FC910190F081E02DC6010995892B79F7FA
:1001E000C501DF91CF911F910F91FF90EF90DF90AC
:1001F000CF90BF90AF900895FC01538D448D252F73
:1002000030E0842F90E0821B930B541710F0CF96B0
:10021000089501970895FC01918D828D981761F0E2
:10022000A28DAE0FBF2FB11D5D968C91928D9F5FF9
:100230009F73928F90E008958FEF9FEF0895FC01D8
:10024000918D828D981731F0828DE80FF11D858D8B
:1002500090E008958FEF9FEF0895FC01918D228D1E
:10026000892F90E0805C9F4F821B91098F739927A3
:10027000089581E391E00E942D0121E0892B09F48A
:1002800020E0822F089580E090E0892B29F00E94E1
:10029000390181110C9400000895FC01A48DA80F70
:1002A000B92FB11DA35ABF4F2C91848D90E00196B8
:1002B0008F739927848FA689B7892C93A089B189D8
:1002C0008C91837080648C93938D848D981306C079
:1002D0000288F389E02D80818F7D80830895EF92DD
:1002E000FF920F931F93CF93DF93EC0181E0888FF0
:1002F0009B8D8C8D98131AC0E889F989808185FFC0
:1003000015C09FB7F894EE89FF896083E889F98961
:1003100080818370806480839FBF81E090E0DF9163
:10032000CF911F910F91FF90EF900895F62E0B8DB6
:1003300010E00F5F1F4F0F731127E02E8C8D8E1171
:100340000CC00FB607FCFACFE889F989808185FFD8
:10035000F5CFCE010E944D01F1CFEB8DEC0FFD2FBB
:10036000F11DE35AFF4FF0829FB7F8940B8FEA8993
:10037000FB8980818062CFCFCF93DF93EC01888DA2
:100380008823B9F0AA89BB89E889F9898C9185FD10
:1003900003C0808186FD0DC00FB607FCF7CF8C919E
:1003A00085FFF2CF808185FFEDCFCE010E944D0108
:1003B000E9CFDF91CF9108953FB7F89480912D0157
:1003C00090912E01A0912F01B091300126B5A89BEC
:1003D00005C02F3F19F00196A11DB11D3FBFBA2FD7
:1003E000A92F982F8827BC01CD01620F711D811D97
:1003F000911D42E0660F771F881F991F4A95D1F71C
:1004000008951F920F920FB60F9211242F933F93CE
:100410004F935F936F937F938F939F93AF93BF930C
:10042000EF93FF9381E391E00E944D01FF91EF91E3
:10043000BF91AF919F918F917F916F915F914F91FC
:100440003F912F910F900FBE0F901F9018951F9204
:100450000F920FB60F9211242F938F939F93EF93C8
:10046000FF93E0914101F09142018081E0914701C9
:10047000F091480182FD1BC0908180914A018F5FFD
:100480008F7320914B01821741F0E0914A01F0E017
:10049000EF5CFE4F958F80934A01FF91EF919F9102
:1004A0008F912F910F900FBE0F901F901895808104
:1004B000F4CF1F920F920FB60F9211242F933F93F8
:1004C0008F939F93AF93BF938091290190912A01BD
:1004D000A0912B01B0912C013091280123E0230F32
:1004E0002D3758F50196A11DB11D20932801809349
:1004F000290190932A01A0932B01B0932C018091A4
:100500002D0190912E01A0912F01B0913001019603
:10051000A11DB11D80932D0190932E01A0932F0159
:10052000B0933001BF91AF919F918F913F912F91E7
:100530000F900FBE0F901F90189526E8230F02967C
:10054000A11DB11DD2CF789484B5826084BD84B5DD
:10055000816084BD85B5826085BD85B5816085BDBE
:1005600080916E00816080936E0010928100809176
:1005700081008260809381008091810081608093FE
:100580008100809180008160809380008091B10023
:1005900084608093B1008091B00081608093B0004E
:1005A00080917A00846080937A0080917A008260E2
:1005B00080937A0080917A00816080937A008091A4
:1005C0007A00806880937A001092C100E091410126
:1005D000F091420182E08083E0913D01F0913E0183
:1005E0001082E0913F01F09140018FEC80831092E6
:1005F0004901E0914501F091460186E08083E09158
:100600004301F0914401808180618083E091430146
:10061000F0914401808188608083E0914301F091F2
:100620004401808180688083E0914301F09144011E
:1006300080818F7D8083EDE9F0E02491E9E8F0E0AE
:100640008491882399F090E0880F991FFC01E85964
:10065000FF4FA591B491FC01EE58FF4F8591949105
:100660008FB7F894EC91E22BEC938FBF41E150E00F
:1006700062E171E081E391E00E94CF0042E050E04E
:1006800064E271E081E391E00E94CF0081E00E948A
:1006900087000E94DC014B015C0180EDC82E87E0E1
:1006A000D82EE12CF12C0E94DC01681979098A0905
:1006B0009B09683E734081059105A8F321E0C21AA9
:1006C000D108E108F10888EE880E83E0981EA11C8D
:1006D000B11CC114D104E104F10429F7C0E0D0E059
:1006E00080E00E9487002097D9F30E943901882377
:1006F000B9F30E940000F4CFE1E3F1E0138212822B
:1007000088EE93E0A0E0B0E084839583A683B7836E
:1007100084E091E09183808385EC90E095878487E5
:1007200084EC90E09787868780EC90E0918B808BBB
:1007300081EC90E0938B828B82EC90E0958B848BA4
:1007400086EC90E0978B868B118E128E138E148E12
:100750000895EE0FFF1F0590F491E02D0994F89491
:02076000FFCFC9
:10076200000000006F01CF00FC00BC012D010B0155
:100772001F0148656C6C6F2C206E657720776F7255
:080782006C6421000D0A000067
:00000001FF`;
var index = 0; 
var originalIndex = 0;
console.log(hexCode);
var hexSearch = hexCode.match(/:/g) || [];
var hexLength = hexSearch.length;

function decodeHex (hexChar) {
	var num1 = 0;
  switch(hexChar) {
  	case "A":
    	num1 = 10;
    	break;
    case "B":
    	num1 = 11;
    	break;
    case "C":
    	num1 = 12;
    	break;
    case "D":
    	num1 = 13;
    	break;
    case "E":
    	num1 = 14;
    	break;
    case "F":
    	num1 = 15;
    	break;
    case "a":
    	num1 = 10;
    	break;
    case "b":
    	num1 = 11;
    	break;
    case "c":
    	num1 = 12;
    	break;
    case "d":
    	num1 = 13;
    	break;
    case "e":
    	num1 = 14;
    	break;
    case "f":
    	num1 = 15;
    	break;
    default:
    	//this directly turns the char into an int if not a letter
    	num1 = parseInt(hexChar);
    	break;
  }
  return num1;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function doubleHex (index2) {
	//this is receiving a hexadecimal character, so needs to be decoded
	var first = hexCode[index2];
  var firstInt = decodeHex(first);
  firstInt *= 16; //base 16
  var second = hexCode[index2+1];
  var secondInt = decodeHex(second);
  secondInt += firstInt;
  return secondInt;
}
/*
*Really weird- can transmit data fine, but Arduino is not accepting it for 
some strange reason, maybe it has to do with the data being sent to fast 
since Arduino can handle it fine when sent through the inspector window Ctrl+i
*/

async function writeFromHexData() {
console.log("hexLength: " + hexLength);
var sendString = "";
var counter = 0;
//repeat while it has not reached the end of the hex file
for (var i4 = 0; i4<hexLength-1;) {
  var temp = hexCode[index];
  if (temp == ':') {
  	index++;
    originalIndex = index;
    var dataLength = doubleHex(index);
    //this just advances the index the appropriate amount of times
    for (var i = 0; i < 8; i++) {
    	index++;
    }
    for (var i=0; i < dataLength; i++) {
    	//converts the hexadecimal "word" to type int, stored to val
    	var val = doubleHex(index);
      //console.log(val);
      //this then writes the decoded hex number (as type int) to the Arduino
      // and also converts it into the corresponding ASCII char before doing so
      console.log(writeToStream(String.fromCharCode(val)));
      //cannot go beyond this sleep of 20 or the Arduino won't be able to receive the data fast enough
      await sleep(20); 
      /*sendString += String.fromCharCode(val);
      if (counter < 64) { //makes sure that it executes in 64 char buffers
        counter++;
      }
      else {
        counter = 0;
        console.log(writeToStream(sendString));
        //need to slow down the transmission since Arduino can't handle it going this fast
        await sleep(20);
        sendString = "";
      }*/
      index+=2;
    }
    for (var i = 0; i < 2; i++) {
    	index++;
    }
    

    i4++; //executes the appropriate number of lines
  }
  else {
  	index++;
  }
  /*console.log(writeToStream(sendString));
  await sleep(20);*/
} //end of for loop
//this sends the termination character to end the whole transmission
console.log(writeToStream(String.fromCharCode(256)));
}

document.addEventListener('DOMContentLoaded', () => {
  //these two lines check to see if Web Serial API is supported
  const notSupported = document.getElementById('notSupported');
  notSupported.classList.toggle('hidden', 'serial' in navigator);
  butConnect.addEventListener('click', clickConnect);
  // CODELAB: Add feature detection here.

});


/**
 * @name connect
 * Opens a Web Serial connection to a micro:bit and sets up the input and
 * output stream.
 */
async function connect() {
  // CODELAB: Add code to request & open port here.
// - Request a port and open a connection.
port = await navigator.serial.requestPort();
// - Wait for the port to open.
await port.open({ baudRate: 9600 });
  // CODELAB: Add code setup the output stream here.
const encoder = new TextEncoderStream();
outputDone = encoder.readable.pipeTo(port.writable);
outputStream = encoder.writable;
  // CODELAB: Send CTRL-C and turn off echo on REPL
//writeToStream('\x03', 'echo(false);');
  // CODELAB: Add code to read the stream here.
let decoder = new TextDecoderStream();
inputDone = port.readable.pipeTo(decoder.writable);
inputStream = decoder.readable;

reader = inputStream.getReader();
readLoop();
}


/**
 * @name disconnect
 * Closes the Web Serial connection.
 */
async function disconnect() {
  drawGrid(GRID_OFF);
  sendGrid();

  // CODELAB: Close the input stream (reader).
if (reader) {
  await reader.cancel();
  await inputDone.catch(() => {});
  reader = null;
  inputDone = null;
}
  // CODELAB: Close the output stream.
if (outputStream) {
  await outputStream.getWriter().close();
  await outputDone;
  outputStream = null;
  outputDone = null;
}
  // CODELAB: Close the port.
await port.close();
port = null;
}


/**
 * @name clickConnect
 * Click handler for the connect/disconnect button.
 */
async function clickConnect() {
  // CODELAB: Add disconnect code here.
if (port) {
  await disconnect();
  toggleUIConnected(false);
  return;
}
  // CODELAB: Add connect code here.
await connect();
  // CODELAB: Reset the grid on connect here.

  // CODELAB: Initialize micro:bit buttons.

  toggleUIConnected(true);
}


/**
 * @name readLoop
 * Reads data from the input stream and displays it on screen.
 */
async function readLoop() {
  // CODELAB: Add read loop here.
while (true) {
  const { value, done } = await reader.read();
  if (value) {
    log.textContent += value + '\n';
  }
  if (done) {
    console.log('[readLoop] DONE', done);
    reader.releaseLock();
    break;
  }
}
}

function writeMsg() {
  //this is how you can use the writeToStream function to actually write a value to the arduino by communicating through the console
  //console.log(writeToStream("yes")); //this was just a test
  //this calls the function that actually takes the .hex file from the string variable and reflashes the Arduino with it
  writeFromHexData();
}

/**
 * @name sendGrid
 * Iterates over the checkboxes and generates the command to set the LEDs.
 */
function sendGrid() {
  // CODELAB: Generate the grid

}


/**
 * @name writeToStream
 * Gets a writer from the output stream and send the lines to the micro:bit.
 * @param  {...string} lines lines to send to the micro:bit
 */
function writeToStream(...lines) {
  // CODELAB: Write to output stream
const writer = outputStream.getWriter();
lines.forEach((line) => {
  console.log('[SEND]', line);
  //writer.write(line + '\n');
  writer.write(line);
});
writer.releaseLock();
}


/**
 * @name watchButton
 * Tells the micro:bit to print a string on the console on button press.
 * @param {String} btnId Button ID (either BTN1 or BTN2)
 */
function watchButton(btnId) {
  // CODELAB: Hook up the micro:bit buttons to print a string.

}


/**
 * @name LineBreakTransformer
 * TransformStream to parse the stream into lines.
 */
class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.container = '';
  }

  transform(chunk, controller) {
    // CODELAB: Handle incoming chunk

  }

  flush(controller) {
    // CODELAB: Flush the stream.

  }
}


/**
 * @name JSONTransformer
 * TransformStream to parse the stream into a JSON object.
 */
class JSONTransformer {
  transform(chunk, controller) {
    // CODELAB: Attempt to parse JSON content

  }
}


/**
 * @name buttonPushed
 * Event handler called when one of the micro:bit buttons is pushed.
 * @param {Object} butEvt
 */
function buttonPushed(butEvt) {
  // CODELAB: micro:bit button press handler

}


/**
 * The code below is mostly UI code and is provided to simplify the codelab.
 */

function initCheckboxes() {
  ledCBs.forEach((cb) => {
    cb.addEventListener('change', () => {
      sendGrid();
    });
  });
}

function drawGrid(grid) {
  if (grid) {
    grid.forEach((v, i) => {
      ledCBs[i].checked = !!v;
    });
  }
}

function toggleUIConnected(connected) {
  let lbl = 'Connect';
  if (connected) {
    lbl = 'Disconnect';
  }
  butConnect.textContent = lbl;
  ledCBs.forEach((cb) => {
    if (connected) {
      cb.removeAttribute('disabled');
      return;
    }
    cb.setAttribute('disabled', true);
  });
}
