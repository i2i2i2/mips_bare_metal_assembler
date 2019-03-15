/**
 * Fall 2014
 * CSCI 320 - Computer Architecture
 * Tiago Bozzetti, Ellie Easse and Chau Tieu
 *
 * Contains all the helper functions for mipstohex.js and hextomips.js
 * including checking hex, opcode, clearing text, printing result,
 * binary to hex and hex to binary conversion, formatting the instruction
 * table and searching the instruction.
 */

/**
 * Modified by Chenxu Jiang
 * remove document ops to support nodejs
 */


/* checks if the hex entered has the correct number of bits */
function checkHex(hex) {
    if (hex.length == 8) {
	return true;
    }
    else {
	return false;
    }
}


/* checks the opcode if the opcode is supported and returns true or false*/
function checkOpcode(opcode) {
    var type;
    if (opcodeTable.hasOwnProperty(opcode) == true) {
	// R type instruction
	if(opcode == "000000"){
	    type = "R";
	}
	// J type instruction
	else if (opcode == "000010" || opcode == "000011"){
	    type = "J";
	}
	// I type instruction
	else {
	    type = "I";
	}
    }
    // Undefined instruction
    else {
	type = "undefined";
    }
    return type;
}


/* clears our the text printed before */
//function clearText(id) {
//    document.getElementById(id).innerHTML = "";
//}


/* converts binary string and return a hex string */
function binaryToHex(binaryValue){
    // if binary value is not multiple of 4, add zeros in the left
    missingBits = binaryValue.length % 4;
    for(i = 0; i < missingBits; i++){
	binaryValue = "0" + binaryValue;
    }

    var hexValue = "";
    for(j = 0; j < binaryValue.length; j+=4){
	if(binaryValue.substring(j,j+4).indexOf('X') === -1){
	    hexValue = hexValue + binaryToHexTable[binaryValue.substring(j,j+4)];
	}
	else{
	    hexValue = hexValue + "X";
	}
    }
    return hexValue;
}


/* prints out result to section indicated by ID */
function printResult(id, instructionObject, instruction, bin, hex, bits) {
    if(id == "hex_result") {
	// clearText("instruction_format");
	// clearText("error_message");
    }
    else {
	// clearText("hex_result");
	// clearText("error_message");
    }
    var result = "";
    var instruction_info = getInstructionInfo(instructionObject);

    result += printInstructionHeader(instruction, bin, hex);
    result += getHTMLInstructionFormatTable(bits);

    // document.getElementById(id).innerHTML = result;
    // document.getElementById("instruction_info").innerHTML = instruction_info;
}


/* prints the error message, errorMessage */
function printErrorMessage(errorMessage) {
    // document.getElementById("result_title").innerHTML = "Error";
    // document.getElementById("error_message").innerHTML = errorMessage;
    console.error(errorMessage)
    // clearText("instruction_format");
    // clearText("instruction_info");
    // clearText("hex_result");
}


/* prints instruction basic information */
function printInstructionHeader(instruction, binaryValue, hexValue){
    var result = "<h1>" + instruction.toUpperCase() + "</h1>";
    result += "<h3>Binary: " + binaryValue + "</h3>";
    result += "<h3>Hex: 0x" + hexValue + "</h3>";
    result += "<hr>";
    return result;
}


/* formats the instruction table and returns the html code*/
function getHTMLInstructionFormatTable(bits){
    var bitIndexRow = "";
    var fieldNameRow = "";
    var fieldContentRow = "";
    var fieldSizeRow = "";
    var html = "";

    //for each field of the instruction
    for(j = 0; j < bits.length; j++){

	//get values of the field
	var beginIndex = bits[j][0];
	var endIndex = bits[j][1];
	var fieldName = bits[j][2];
	var fieldContent = bits[j][3];

	//create one more HTML table column
	bitIndexRow = bitIndexRow + "<td style=\"text-align: left;\">" + beginIndex + "</td>";
	bitIndexRow = bitIndexRow + "<td style=\"text-align: right;\">" + endIndex + "</td>";
	fieldNameRow = fieldNameRow + "<td colspan=\"2\" style=\"text-align: center; border-right: 1px solid black; border-left: 1px solid black;\">" + fieldName + "</td>";
	fieldContentRow = fieldContentRow + "<td colspan=\"2\" style=\"text-align: center; border-right: 1px solid black; border-left: 1px solid black;\">" + fieldContent + "</td>";
	fieldSizeRow = fieldSizeRow + "<td colspan=\"2\" style=\"text-align: center;\">" + (beginIndex - endIndex + 1) + "</td>";
    }

    html = "<p><table style=\"border-collapse: collapse;\"><tr class=toprow>" + bitIndexRow + "</tr><tr>" + fieldNameRow + "</tr><tr>" + fieldContentRow + "</tr><tr class=bottomrow>" + fieldSizeRow + "</tr></table></p>";

    return html;
}


/* formats out the instruction information and returns the html */
function getInstructionInfo(instruction){
    var info = "<h1>" + instruction.symbol + "</h1>";
    info += "<h3>" + instruction.name + "</h3>";
    info += "<hr>";

    info = info + "<p style=\"float:right;\"><b>MIPS Architecture Extension: " + instruction.architecture + "</b></p>";
    info = info + "<p><b>Format:</b><br>" + instruction.format + "</p>";

    //create table for the instruction format
    info = info + getHTMLInstructionFormatTable(instruction.bits);
    info = info + "<p><b>Purpose:</b><br>" + instruction.purpose + "</p>";
    info = info + "<p><b>Description:</b><br>" + instruction.description + "</p>";
    info = info + "<p><b>Restrictions:</b><br>" + instruction.restrictions + "</p>";
    info = info + "<p><b>Operation:</b><br>" + instruction.operation + "</p>";
    info = info + "<p><b>Exceptions:</b><br>" + instruction.exceptions + "</p>";
    info = info + "<p><b>Programming Notes:</b><br>" + instruction.programming_notes + "</p>";
    info = info + "<p><b>Implementation Notes:</b><br>" + instruction.implementation_notes + "</p>";

    return info;
}


/* searches the instruction table for the instruction and returns the instruction object */
function searchInstruction(instruction){
    //replace the variable part of the instruction
    instruction = instruction.replace(/\.([^\.]*)$/, ".fmt");

    //search is case insensitive
    var symbol = instruction.replace(".", "").toUpperCase();
    var symbolFound = 0;
    var instructionObject = {};

    for(i = 0; i < instructions.length; i++){
	if(instructions[i].symbol.replace(".", "").toUpperCase() == symbol){
	    instructionObject = instructions[i];
	    symbolFound = 1;
	    break;
	}
    }

    if(symbolFound == 0){
	var errorMessage = "Error: Instruction was not found. <BR> Please check to make sure you are entering a valid instruction.";
	printErrorMessage(errorMessage);
    }

    return instructionObject;
}


/* displays the supported instruction on the help page*/
function displaySupportedInst() {
    var result = "<table style=\" width:300px;\"><thead><th>Supported Instructions</th></thead></table>";
    result += "<div style=\"width:300px; margin: 0 auto; overflow:auto; height:100px;\"><table><tbody>";
    for(i = 0; i < instructions.length; i++) {
	result += "<tr>";
	result += "<td>" + instructions[i].symbol + "</td>";
	result += "</tr>";
    }
    result += "</tbody></table></div>";
    // clearText("instructions");
    // document.getElementById("instructions").innerHTML = result;
}


/* displays the supported registers on the help page*/
function displaySupportedReg() {
    var result = "<table style=\" width:300px;\"><thead><th>Register</th><th>Binary</th></thead></table>";
    result += "<div style=\"width:330px; margin: 0 auto; overflow:auto; height:100px;\"><table><tbody>";
    for(i = 0; i < regNames.length; i++) {
	result += "<tr>";
	result += "<td>" + regNames[i] + "</td>";
	result += "<td>" + regBinary[i] + "</td>";
	result += "</tr>";
    }
    result += "</tbody></table></div>";
    // clearText("registers");
    // document.getElementById("instructions").innerHTML = result;
}

function searchIns(bin){
    var opcode = bin.substring(0,6);
    var instructionObject = {};
    // search funct codes
    if (opcode == "000000"){
	var funct = bin.substring(26,33);
	for(i = 0; i < instructions.length; i++){
	    if(instructions[i].bits[(instructions[i].bits.length)-1][3] == funct
	       && instructions[i].bits[0][3] == opcode){
		instructionObject = instructions[i];
		break;
	    }
	}
    }
    // else if REGIMM
    else if (opcode == "000001"){
	var regimm = bin.substring(11,16);
	for(i = 0; i < instructions.length; i++){
	    if(instructions[i].bits.length >= 3
	       && instructions[i].bits[2][3] == regimm
	       && instructions[i].bits[0][3] == opcode){
		instructionObject = instructions[i];
		break;
	    }
	}
    }
    // search opcodes
    else {
	for(i = 0; i < instructions.length; i++){
	    if(instructions[i].bits[0][3] == opcode){
		instructionObject = instructions[i];
		break;
	    }
	}
    }
    return instructionObject;
}
