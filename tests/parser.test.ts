import * as mocha from 'mocha';
import { expect } from 'chai';
import { parser } from 'lezer-python';
import { traverseExpr, traverseStmt, traverse, parse } from '../parser';

// We write tests for each function in parser.ts here. Each function gets its
// own describe statement. Each it statement represents a single test. You
// should write enough unit tests for each function until you are confident
// the parser works as expected.
describe('traverseExpr(c, s) function', () => {
  it('parses a number in the beginning', () => {
    const source = "987";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({ tag: "num", value: 987 });
  })

  // TODO: add additional tests here to ensure traverseExpr works as expected
  it('parses a binary expression', () => {
    const source = "4 * 6";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({ tag: "binexpr", opr1: { tag: "num", value: 4 }, op: "mul", opr2: { tag: "num", value: 6 } });
  })

  it('parses abs(expr)', () => {
    const source = "abs(-2)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({ tag: "builtin1", name: "abs", arg: { tag: "num", value: -2 } });
  })

  it('parses builtin2(expr, expr)', () => {
    const source = "max(2, 6)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({ tag: "builtin2", name: "max", arg1: { tag: "num", value: 2 }, arg2: { tag: "num", value: 6 } });
  })
});

describe('traverseStmt(c, s) function', () => {
  // TODO: add tests here to ensure traverseStmt works as expected
});

describe('traverse(c, s) function', () => {
  // TODO: add tests here to ensure traverse works as expected
});

describe('parse(source) function', () => {
  it('parse a number', () => {
    const parsed = parse("987");
    expect(parsed).to.deep.equal([{ tag: "expr", expr: { tag: "num", value: 987 } }]);
  });

  // TODO: add additional tests here to ensure parse works as expected
});
