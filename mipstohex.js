/**
 * Fall 2014
 * CSCI 320 - Computer Architecture
 * Tiago Bozzetti, Ellie Easse and Chau Tieu
 *
 * Contains the function for converting the instruction to hex
 */

/**
 * Modified by Chenxu Jiang
 * remove document ops to support nodejs
 */

/* takes in instructionObject and typedInstruction and returns the bits of the typed instruction */
function getTypedInstructionBits(instructionObject, typedInstruction){

    // parse typed instruction and actual instruction format from $ and 0x
    var regexRegisters = /^(\$([0-9a-z])+|[a-z]([0-9a-z])*)$/g;
    var regexNumbers = /^0x([0-9a-f])+$/g;

    // remove comas, parenthesis and square brackets of the format string
    var format = instructionObject.format;
    format = format.replace(/\[[^\]]+\]/g, '');
    format = format.replace(/,/g, ' ');
    format = format.replace(/\(/g, ' ');
    format = format.replace(/\)/g, ' ');

    // get all the pieces of the format string and typed instruction (consider whitespaces as separators)
    var formatPieces = format.replace(/\s+/g,' ').trim().split(' ');
    var instructionPieces = typedInstruction.replace(/\s+/g,' ').trim().split(' ');

    if(instructionPieces.length != formatPieces.length) return null;

    // check if the typed instruction is in the correct format
    for(i = 1; i < instructionPieces.length; i++){

	// check if it is a register
	if(instructionPieces[i].match(regexRegisters) != null){
	    if(formatPieces[i].match(/(rd|rs|rt|base)/) == null) return null;
	    if(typeof registerToBinary[instructionPieces[i]] === 'undefined') return null;
	    continue;
	}

	// check if it is a number
	if(instructionPieces[i].match(regexNumbers) != null){
	    if(formatPieces[i].match(/(immediate|offset|cop_fun|sa|target|hint|index)/) == null) return null;
	    continue;
	}
	return null;
    }

    var typedInstructionBits = [];

    // for each field of the instruction
    for(i = 0; i < instructionObject.bits.length; i++){

	// copy field attributes (except for the content that must be computed)
	typedInstructionBits[i] = [];
	typedInstructionBits[i][0] = instructionObject.bits[i][0];
	typedInstructionBits[i][1] = instructionObject.bits[i][1];
	typedInstructionBits[i][2] = instructionObject.bits[i][2];

	// if the instruction field is a constant, copy
	if(instructionObject.bits[i][3] != ""){
	    typedInstructionBits[i][3] = instructionObject.bits[i][3];
	}
	else{
	    var binaryValue = "";
	    var position = -1; // get position of field in the intruction format

	    for(j = 0; j < formatPieces.length; j++){
		if(formatPieces[j] == instructionObject.bits[i][2]) position = j;
	    }

	    // if this field is unknown (cannot be retrieved from typed instruction), fill it with X
	    if(position == -1){
		for(j = 0; j < instructionObject.bits[i][0] - instructionObject.bits[i][1] + 1; j++){
		    binaryValue = binaryValue + "X";
		}
	    }
	    else{
		var typedField = instructionPieces[position]; // get the field from the typed instruction

		for(j = 0; j < instructionObject.bits[i][0] - instructionObject.bits[i][1] + 1; j++){
		    binaryValue = binaryValue + "0";
		}

		// if it is a number, get the binary value of the hexadecimal number
		if(typedField.match(regexNumbers) != null){
		    var binaryNumber = "";

		    // convert the hexadecimal number to a binary number
		    for(j = typedField.length - 1; j >= 0 && typedField[j] != 'x'; j--){
			binaryNumber = hexTable[typedField[j]] + binaryNumber;
		    }

		    // add zeros in the left to fill all the field positions
		    for(j = binaryNumber.length; j < instructionObject.bits[i][0] - instructionObject.bits[i][1] + 1; j++){
			binaryNumber = "0" + binaryNumber;
		    }

		    // get only the correct number of bits of the hexadecimal number
		    binaryValue = binaryNumber.substring(binaryNumber.length - (instructionObject.bits[i][0] - instructionObject.bits[i][1] + 1), binaryNumber.length);
		}

		// if it is a register, translate it to get the binary value
		if(typedField.match(regexRegisters) != null){
		    binaryValue = registerToBinary[typedField];
		    typedInstructionBits[i][2] = typedField;
		}
	    }
	    typedInstructionBits[i][3] = binaryValue;
	}
    }
    return typedInstructionBits;
}


/* main mipstohex function that prints the results to the main webpage*/
function mipstohex(typedInstruction) {
    // document.getElementById("result_title").innerHTML = "Result";

    // get the typed instruction string from the instruction field
    // var typedInstruction = document.getElementById("instruction").value;
    typedInstruction = typedInstruction.toLowerCase();

    // remove comas, parenthesis and extra spaces of the typed instruction
    typedInstruction = typedInstruction.replace(/,/g, ' ');
    typedInstruction = typedInstruction.replace(/\(/g, ' ');
    typedInstruction = typedInstruction.replace(/\)/g, ' ');
    typedInstruction = typedInstruction.trim();
    typedInstruction = typedInstruction.replace(/\s{2,}/g, ' ');
    typedInstructionSymbol = typedInstruction.split(' ')[0].toUpperCase();

    // get the instruction object of the typed instruction
    var instructionObject = searchInstruction(typedInstructionSymbol);

    // check if the instruction was found and print an error message and return
    if(typeof instructionObject.format === 'undefined'){
	printErrorMessage("Error: Instruction was not found. <BR> Please check to make sure you are entering a valid instruction.");
	return;
    }

    // if instruction was found, print instruction info
    var instruction_info = getInstructionInfo(instructionObject);
    // document.getElementById("instruction_info").innerHTML = instruction_info;

    // get the typed instruction bits and return null if bits not found and print error message
    typedInstructionBits = getTypedInstructionBits(instructionObject, typedInstruction);
    if(typedInstructionBits == null){
    	// document.getElementById("result_title").innerHTML = "Error";
    	// document.getElementById("error_message").innerHTML = "Error: Instruction is not in the correct format. <BR> Please check the instruction information to make sure you are entering the instruction in a valid format.";
    	// clearText("instruction_format");
    	// clearText("hex_result");
      console.error("Error: Instruction is not in the correct format. <BR> Please check the instruction information to make sure you are entering the instruction in a valid format.");
	return;
    }

    // print the typed instruction binary and hexadecimal value and its bits table
    // clearText("hex_result");
    // clearText("error_message");
    var result = "";
    result += "<h1>" + typedInstruction + "</h1>";
    var bin = ""; //get the binary value of the typed instruction
    for(j = 0; j < typedInstructionBits.length; j++){
	bin += typedInstructionBits[j][3];
    }

    // result += "<h3>Binary: " + bin + "</h3>";
    // result += "<h3>Hex: 0x" + binaryToHex(bin) + "</h3>";
    // result += "<hr>";
    // result += getHTMLInstructionFormatTable(typedInstructionBits);
    // document.getElementById("instruction_format").innerHTML = result;
  return binaryToHex(bin);
}




