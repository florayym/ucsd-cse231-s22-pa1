import { TreeCursor } from 'lezer';
import { parser } from 'lezer-python';
import { Stmt, Expr } from './ast';
export function parseProgram(source: string): Array<Stmt> {
    const t = parser.parse(source).cursor();
    return traverseStmts(source, t);
}
export function traverseStmts(s: string, t: TreeCursor) {
    // The top node in the program is a Script node
    t.firstChild();
    const stmts = [];
    do {
        stmts.push(traverseStmt(s, t));
    } while (t.nextSibling());
    // t.nextSibling() returns false when
    // at the end of the list of children
    return stmts;
}
// Invariant – t must focus on the same node at the end
export function traverseStmt(s: string, t: TreeCursor): Stmt {
    switch (t.type.name) {
        case "AssignStatement":
            t.firstChild(); // focused on name (the first child)
            let name = s.substring(t.from, t.to);
            t.nextSibling(); // focused on = sign.
            t.nextSibling(); // focused on the value expression
            let value = traverseExpr(s, t);
            t.parent();
            return { tag: "assign", name, value };
        case "ExpressionStatement":
            t.firstChild(); // The child is some kind of expression
            let expr = traverseExpr(s, t);
            t.parent();
            return { tag: "expr", expr: expr };
    }
}
export function traverseExpr(s: string, t: TreeCursor): Expr {
    switch (t.type.name) {
        case "Number":
            return {
                tag: "number",
                value: Number(s.substring(t.from, t.to))
            };
        case "VariableName":
            return { tag: "id", name: s.substring(t.from, t.to) };
    }
}
