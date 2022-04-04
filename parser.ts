import { parser } from "lezer-python";
import { TreeCursor } from "lezer-tree";
import { Expr, Op, Stmt } from "./ast";

export function traverseArgs(c: TreeCursor, s: string): Array<Expr> {
  var args: Array<Expr> = [];
  c.firstChild(); // go into arglist
  try {
    while (c.nextSibling()) { // find single argument in arglist
      args.push(traverseExpr(c, s));
      c.nextSibling();
    }
  } catch (error) { }
  c.parent(); // pop arglist
  return args;
}

export function traverseExpr(c: TreeCursor, s: string): Expr {
  switch (c.type.name) {
    case "Number":
      return {
        tag: "num",
        value: Number(s.substring(c.from, c.to))
      }
    case "VariableName":
      return {
        tag: "id",
        name: s.substring(c.from, c.to)
      }

    case "UnaryExpression":
      c.firstChild();
      const arithOp = s.substring(c.from, c.to)
      var flag: number;
      if (arithOp === "-")
        flag = -1;
      else if (arithOp === "+")
        flag = 1;
      else
        throw new Error("ParseError: unsupported unary operator");
      c.nextSibling();
      const num = flag * Number(s.substring(c.from, c.to));
      if (isNaN(num))
        throw new Error("ParseError: expected a numeric literal");
      c.parent();
      return { tag: "num", value: num };

    case "CallExpression":
      c.firstChild();
      const callName = s.substring(c.from, c.to);
      c.nextSibling(); // go to arglist
      const args = traverseArgs(c, s);
      c.parent(); // pop CallExpression
      if (args.length === 1) {
        if (callName !== "print" && callName !== "abs")
          throw new Error("ParseError: undefined builtin1");
        return {
          tag: "builtin1",
          name: callName,
          arg: args[0]
        };
      } else if (args.length === 2) {
        if (callName !== "max" && callName !== "min" && callName !== "pow")
          throw new Error("ParseError: undefined builtin2");
        return {
          tag: "builtin2",
          name: callName,
          arg1: args[0],
          arg2: args[1]
        };
      }
      throw new Error("ParseError: unsupported call arguments");

    case "BinaryExpression":
      c.firstChild();
      const opr1 = traverseExpr(c, s);
      c.nextSibling();
      const op = function (op: string) {
        switch (op) {
          case "+":
            return Op.Add;
          case "-":
            return Op.Sub;
          case "*":
            return Op.Mul;
          default:
            throw new Error("ParseError: undefined binary operator");
        }
      }(s.substring(c.from, c.to));
      c.nextSibling();
      const opr2 = traverseExpr(c, s);
      c.parent();
      return { tag: "binexpr", opr1, op, opr2 };

    default:
      throw new Error("Could not parse expr at " + c.from + " " + c.to + ": " + s.substring(c.from, c.to));
  }
}

export function traverseStmt(c: TreeCursor, s: string): Stmt {
  switch (c.node.type.name) {
    case "AssignStatement":
      c.firstChild(); // go to name
      const name = s.substring(c.from, c.to);
      c.nextSibling(); // go to equals
      c.nextSibling(); // go to value
      const value = traverseExpr(c, s);
      c.parent();
      return {
        tag: "define",
        name: name,
        value: value
      }
    case "ExpressionStatement":
      c.firstChild();
      const expr = traverseExpr(c, s);
      c.parent(); // pop going into stmt
      return { tag: "expr", expr: expr }
    default:
      throw new Error("Could not parse stmt at " + c.node.from + " " + c.node.to + ": " + s.substring(c.from, c.to));
  }
}

export function traverse(c: TreeCursor, s: string): Array<Stmt> {
  switch (c.node.type.name) {
    case "Script":
      const stmts = [];
      c.firstChild();
      do {
        stmts.push(traverseStmt(c, s));
      } while (c.nextSibling())
      console.log("traversed " + stmts.length + " statements ", stmts, "stopped at ", c.node);
      return stmts;
    default:
      throw new Error("Could not parse program at " + c.node.from + " " + c.node.to);
  }
}
export function parse(source: string): Array<Stmt> {
  const t = parser.parse(source);
  return traverse(t.cursor(), source);
}
