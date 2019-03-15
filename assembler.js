#!/usr/bin/nodejs
/**
 *  assembler.js
 *  Author: Chenxu Jiang
 *  mips assembler for bare metal fpga mem load.
 */
fs = require("fs");

eval(fs.readFileSync("./instructioninfo.js", {encoding:"utf8"}));
eval(fs.readFileSync("./helper.js", {encoding:"utf8"}));
eval(fs.readFileSync("./mipstohex.js", {encoding:"utf8"}));

function parseCmd() {
  if (process.argv.length <= 2) {
    console.error("USAGE: ./assembler.js <mips assembly file path>");
    process.exit(0);
  }
  let inputFile = process.argv[2];
  return fs.readFileSync(inputFile, {encoding: "utf8"}).toUpperCase();
}

function foundDecimal(word) {
  return !isNaN(parseInt(word)) && (!(/^0X.*/.test(word)));
}

function hexConvertionWord(word) {
  if (foundDecimal(word)) {
    let num = parseInt(word);
    if (num < 0) {
      num += 65536;
    }
    word = "0x" + num.toString(16) + word.replace(parseInt(word), '');
  }
  return word;
}

function hexConvertInstr(instr) {
  let arr = instr.split(" ");
  for (let i = 0; i < arr.length; i++)
    arr[i] = hexConvertionWord(arr[i]);
  return arr.join(" ");
}

function isAbsoluteJump(instr) {
  let absoluteJumpInstrs = ["J", "JAL"]
  return instr.indexOf("J ") != -1 || instr.indexOf("JAL ") != -1;
}

function getLabel(instr) {
  let columnIdx = instr.indexOf(":");
  if (columnIdx == -1)
    return false;
  else
    return instr.substr(0, columnIdx);
}

function genLabelsAndInstr(instrs) {
  let arr = instrs.split("\n");
  let res = [];
  let labelTable = {};
  let counter = 0;
  for (let i = 0; i < arr.length; i++) {
    let label = getLabel(arr[i]);
    if (label) {
      labelTable[label] = counter;
    } else {
      counter++;
      commentIdx = arr[i].indexOf("#");
      if (commentIdx != -1)
        arr[i] = arr[i].substring(0, commentIdx);
      if (arr[i].length)
        res.push(arr[i]);
    }
  }
  return {
    labels: labelTable,
    instrs: res
  }
}

function replaceLabel(instrsAndlabels) {
  let instrs = instrsAndlabels.instrs;
  let labels = instrsAndlabels.labels;
  for (let i = 0; i < instrs.length; i++) {
    for (var label in labels) {
      if (isAbsoluteJump(instrs[i]))
        instrs[i] = instrs[i].replace(label, labels[label]);
      else
        instrs[i] = instrs[i].replace(label, labels[label] - i - 1);
    }
  }
  return instrs
}

function replaceDecWithHex(instrs) {
  for (let i = 0; i < instrs.length; i++) {
    instrs[i] = hexConvertInstr(instrs[i]);
  }
  return instrs;
}

let original = parseCmd();
console.error("===== Original =====")
console.error(original);
let labelInstr = genLabelsAndInstr(original);
console.error("====== Labels ======")
console.error(labelInstr.labels);
console.error("====== Instrs ======")
console.error(labelInstr.instrs.join("\n"));
let instrLabelReplaced = replaceLabel(labelInstr);
console.error("====== Instrs ======")
console.error(instrLabelReplaced.join("\n"));
let finalInstr = replaceDecWithHex(instrLabelReplaced);
console.error("====== Instrs ======")
console.error(finalInstr.join("\n"));
console.error("======= hex ========")
for (let i = 0; i < finalInstr.length; i++)
  if (finalInstr[i].length)
    console.log(mipstohex(finalInstr[i]));
