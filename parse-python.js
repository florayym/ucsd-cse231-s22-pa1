const python = require('lezer-python');

// const input = "globals()";
const input = "x = 10\nprint(10)";

const tree = python.parser.parse(input);

const cursor = tree.cursor();

cursor.firstChild();
cursor.nextSibling();
cursor.firstChild();
console.log(cursor.type.name);
console.log(input.substring(cursor.from, cursor.to));
