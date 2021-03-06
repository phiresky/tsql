import * as tm from "type-mapping";
import {QueryBaseUtil} from "../../../query-base";
import {SelectConnection} from "../../connection";
import {QueryUtil} from "../../../unified-query";
import {fetchValue} from "./fetch-value";
import {SelectClauseUtil} from "../../../select-clause";
import * as ExprLib from "../../../expr-library";
import {CannotCountError} from "../../../error";
import {parentheses} from "../../../ast";
import {expr} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";
import {removePaginateArgs} from "./paginate";

/**
 * @todo Optimize this further?
 * Or keep trusting DBMS execution engine?
 */
export async function count (
    query : QueryBaseUtil.NonCorrelated,
    connection : SelectConnection
) : Promise<bigint> {
    /**
     * The following clauses may have a reference to the `SELECT` clause,
     *
     * + `groupByClause`
     * + `orderByClause`
     * + `compoundQueryClause`
     * + `compoundQueryOrderByClause`
     *
     */
    if (QueryBaseUtil.isAfterSelectClause(query)) {
        return fetchValue(
            QueryUtil.selectValue(
                QueryUtil.newInstance(),
                () => expr(
                    {
                        /**
                         * Should not return a value less than zero
                         */
                        mapper : tm.mysql.bigIntUnsigned(),
                        usedRef : UsedRefUtil.fromColumnRef({}),
                        isAggregate : false,
                    },
                    parentheses(
                        /**
                         * @todo **THIS** is not database agnostic. Change it to a proper AST
                         * @todo Find other such occurrences,
                         * where we assume the implementing DB will be able to execute SQL strings
                         *
                         * This should be fine for now, since most DB engines should be able to handle this.
                         */
                        [
                            "SELECT COUNT(*) FROM",
                            parentheses(
                                removePaginateArgs(query),
                                false
                            ),
                            "AS tmp"
                        ],
                        false
                    )
                )
            ),
            connection
        );
    }
    if (
        QueryBaseUtil.isBeforeSelectClause(query) &&
        QueryBaseUtil.isBeforeCompoundQueryClause(query)
    ) {
        return fetchValue(
            {
                ...query,
                selectClause : SelectClauseUtil.selectValue(
                    query.fromClause,
                    query.groupByClause,
                    query.selectClause,
                    () => ExprLib.countAll()
                ),
                compoundQueryClause : query.compoundQueryClause,
            },
            connection
        );
    } else {
        //This should never happen...
        if (query.fromClause.currentJoins == undefined || query.fromClause.currentJoins.length == 0) {
            throw new CannotCountError({
                message : `Cannot get count`,
                sql : undefined,
            });
        } else {
            throw new CannotCountError({
                message : `Cannot get count of ${query.fromClause.currentJoins[0].tableAlias}`,
                sql : undefined,
            });
        }
    }
}
