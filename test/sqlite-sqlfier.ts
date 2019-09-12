import {
    Sqlfier,
    OperatorType,
    AstUtil,
    functionCall,
    escapeIdentifierWithDoubleQuotes,
    notImplementedSqlfier,
    SelectClause,
    Ast,
    ColumnUtil,
    SEPARATOR,
    FromClauseUtil,
    JoinType,
    isIdentifierNode,
    ExprSelectItemUtil,
    WhereClause,
    ColumnMapUtil,
    IColumn,
    ColumnMap,
    ColumnRefUtil,
    ColumnRef,
    RawExprUtil,
    OrderByClause,
    ExprUtil,
    HavingClause,
    GroupByClause,
    LimitClause,
    escapeValue,
} from "../dist";

const insertBetween = AstUtil.insertBetween;

function selectClauseColumnToSql (column : IColumn) : string[] {
    return [
        [
            escapeIdentifierWithDoubleQuotes(column.tableAlias),
            ".",
            escapeIdentifierWithDoubleQuotes(column.columnAlias)
        ].join(""),
        "AS",
        escapeIdentifierWithDoubleQuotes(
            `${column.tableAlias}${SEPARATOR}${column.columnAlias}`
        )
    ];
}
function selectClauseColumnArrayToSql (columns : IColumn[]) : string[] {
    columns.sort((a, b) => {
        const tableAliasCmp = a.tableAlias.localeCompare(b.tableAlias);
        if (tableAliasCmp != 0) {
            return tableAliasCmp;
        }
        return a.columnAlias.localeCompare(b.columnAlias);
    });
    const result : string[] = [];
    for (const column of columns) {
        if (result.length > 0) {
            result.push(",");
        }
        result.push(
            ...selectClauseColumnToSql(column)
        );
    }
    return result;
}
function selectClauseColumnMapToSql (map : ColumnMap) : string[] {
    const columns = ColumnUtil.fromColumnMap(map);
    return selectClauseColumnArrayToSql(columns);
}
function selectClauseColumnRefToSql (ref : ColumnRef) : string[] {
    const columns = ColumnUtil.fromColumnRef(ref);
    return selectClauseColumnArrayToSql(columns);
}
function selectClauseToSql (selectClause : SelectClause, toSql : (ast : Ast) => string) : string[] {
    const result : string[] = [];
    for (const selectItem of selectClause) {
        if (result.length > 0) {
            result.push(",");
        }
        if (ColumnUtil.isColumn(selectItem)) {
            result.push(
                ...selectClauseColumnToSql(selectItem)
            );
        } else if (ExprSelectItemUtil.isExprSelectItem(selectItem)) {
            result.push(
                toSql(selectItem.unaliasedAst),
                "AS",
                escapeIdentifierWithDoubleQuotes(
                    `${selectItem.tableAlias}${SEPARATOR}${selectItem.alias}`
                )
            );
            selectItem.unaliasedAst

        } else if (ColumnMapUtil.isColumnMap(selectItem)) {
            result.push(...selectClauseColumnMapToSql(selectItem));
        } else if (ColumnRefUtil.isColumnRef(selectItem)) {
            result.push(...selectClauseColumnRefToSql(selectItem));
        } else {
            throw new Error(`Not implemented`)
        }
    }
    return ["SELECT", ...result];
}

function fromClauseToSql (currentJoins : FromClauseUtil.AfterFromClause["currentJoins"], toSql : (ast : Ast) => string) : string[] {
    const result : string[] = [];
    for (const join of currentJoins) {
        if (join.joinType == JoinType.FROM) {
            result.push("FROM");
        } else {
            result.push(join.joinType, "JOIN");
        }
        if (isIdentifierNode(join.tableAst)) {
            result.push(toSql(join.tableAst));
        } else {
            result.push(toSql(join.tableAst));
            result.push("AS");
            result.push(escapeIdentifierWithDoubleQuotes(join.tableAlias));
        }
        if (join.onClause != undefined) {
            result.push("ON");
            result.push(toSql(AstUtil.tryUnwrapParentheses(join.onClause.ast)));
        }
    }
    return result;
}

function whereClauseToSql (whereClause : WhereClause, toSql : (ast : Ast) => string) : string[] {
    return [
        "WHERE",
        toSql(AstUtil.tryUnwrapParentheses(whereClause.ast))
    ];
}

function orderByClauseToSql (orderByClause : OrderByClause, toSql : (ast : Ast) => string) : string[] {
    const result : string[] = [];
    for (const [sortExpr, sortDirection] of orderByClause) {
        if (result.length > 0) {
            result.push(",");
        }
        if (ColumnUtil.isColumn(sortExpr)) {
            result.push(
                [
                    escapeIdentifierWithDoubleQuotes(sortExpr.tableAlias),
                    ".",
                    escapeIdentifierWithDoubleQuotes(sortExpr.columnAlias)
                ].join("")
            );
        } else if (ExprUtil.isExpr(sortExpr)) {
            result.push(toSql(sortExpr.ast));
        } else {
            result.push(toSql(sortExpr.unaliasedAst));
        }
        result.push(sortDirection);
    }
    return [
        "ORDER BY",
        ...result
    ];
}

function groupByClauseToSql (groupByClause : GroupByClause, _toSql : (ast : Ast) => string) : string[] {
    const result : string[] = [];
    for (const column of groupByClause) {
        if (result.length > 0) {
            result.push(",");
        }
        result.push(
            [
                escapeIdentifierWithDoubleQuotes(column.tableAlias),
                ".",
                escapeIdentifierWithDoubleQuotes(column.columnAlias)
            ].join("")
        );
    }
    return [
        "GROUP BY",
        ...result
    ];
}

function havingClauseToSql (havingClause : HavingClause, toSql : (ast : Ast) => string) : string[] {
    return [
        "HAVING",
        toSql(AstUtil.tryUnwrapParentheses(havingClause.ast))
    ];
}

function limitClauseToSql (limitClause : LimitClause, _toSql : (ast : Ast) => string) : string[] {
    return [
        "LIMIT",
        escapeValue(limitClause.maxRowCount),
        "OFFSET",
        escapeValue(limitClause.offset),
    ];
}

export const sqliteSqlfier : Sqlfier = {
    identifierSqlfier : (identifierNode) => identifierNode.identifiers
        .map(escapeIdentifierWithDoubleQuotes)
        .join("."),
    operatorSqlfier : {
        ...notImplementedSqlfier.operatorSqlfier,
        /*
            Comparison Functions and Operators
            https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html
        */
        [OperatorType.BETWEEN_AND] : ({operands}) => [
            operands[0],
            "BETWEEN",
            operands[1],
            "AND",
            operands[2]
        ],
        [OperatorType.COALESCE] : ({operatorType, operands}) => functionCall(operatorType, operands),
        [OperatorType.EQUAL] : ({operands}) => insertBetween(operands, "="),
        [OperatorType.NULL_SAFE_EQUAL] : ({operands}) => insertBetween(operands, "IS"),
        [OperatorType.GREATER_THAN] : ({operands}) => insertBetween(operands, ">"),
        [OperatorType.IS_NOT_NULL] : ({operands}) => [operands[0], "IS NOT NULL"],
        [OperatorType.IS_NULL] : ({operands}) => [operands[0], "IS NULL"],
        [OperatorType.NOT_EQUAL] : ({operands}) => insertBetween(operands, "<>"),

        /*
            Logical Operators
            https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html
        */
        [OperatorType.AND] : ({operands}) => insertBetween(operands, "AND"),
        [OperatorType.NOT] : ({operands}) => [
            "NOT",
            operands[0]
        ],
        [OperatorType.XOR] : ({operands}) => insertBetween(operands, "<>"),

        [OperatorType.CAST_AS_DOUBLE] : ({operands}, toSql) => functionCall("CAST", [`${toSql(operands)} AS DOUBLE`]),

        /*
            Arithmetic Operators
            https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html
        */
        [OperatorType.SUBTRACTION] : ({operands}) => insertBetween(operands, "-"),
        [OperatorType.MODULO] : ({operands}) => insertBetween(operands, "%"),
        [OperatorType.ADDITION] : ({operands}) => insertBetween(operands, "+"),

        /*
            Mathematical Functions
            https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html
        */
        [OperatorType.ABSOLUTE_VALUE] : ({operands}) => functionCall("ABS", operands),
        [OperatorType.ARC_COSINE] : ({operands}) => {
            return functionCall("ACOS", operands);
        },

        [OperatorType.PI] : () => {
            return functionCall("PI", []);
        },

        /*
            Date and Time Functions
            https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html
        */

        [OperatorType.UTC_STRING_TO_TIMESTAMP_CONSTRUCTOR] : ({operands}) => functionCall(
            "strftime",
            [
                RawExprUtil.buildAst("%Y-%m-%d %H:%M:%f"),
                operands[0]
            ]
        ),
    },
    queryBaseSqlfier : (query, toSql) => {
        const result : string[] = [];
        if (query.selectClause != undefined) {
            result.push(selectClauseToSql(query.selectClause, toSql).join(" "));
        }
        if (query.fromClause != undefined && query.fromClause.currentJoins != undefined) {
            result.push(fromClauseToSql(query.fromClause.currentJoins, toSql).join(" "));
        }
        if (query.whereClause != undefined) {
            result.push(whereClauseToSql(query.whereClause, toSql).join(" "));
        }
        if (query.groupByClause == undefined) {
            if (query.havingClause != undefined) {
                /**
                 * Workaround for `<empty grouping set>` not supported by SQLite
                 */
                result.push("GROUP BY NULL");
                result.push(havingClauseToSql(query.havingClause, toSql).join(" "));
            }
        } else {
            result.push(groupByClauseToSql(query.groupByClause, toSql).join(" "));
            if (query.havingClause != undefined) {
                result.push(havingClauseToSql(query.havingClause, toSql).join(" "));
            }
        }
        if (query.orderByClause != undefined) {
            result.push(orderByClauseToSql(query.orderByClause, toSql).join(" "));
        }
        if (query.limitClause != undefined) {
            result.push(limitClauseToSql(query.limitClause, toSql).join(" "));
        }

        return result.join(" ");
    },
};
