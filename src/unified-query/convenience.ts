import * as QueryUtil from "./util";
import {IAliasedTable} from "../aliased-table";
import {FromClauseUtil} from "../from-clause";
import {SelectClause, SelectDelegate, SelectValueDelegate} from "../select-clause";
import {AnyBuiltInExpr} from "../raw-expr";

export function from<
    AliasedTableT extends IAliasedTable
> (
    aliasedTable : (
        & AliasedTableT
        & QueryUtil.AssertValidCurrentJoin<QueryUtil.NewInstance, AliasedTableT>
    )
) : (
    QueryUtil.From<QueryUtil.NewInstance, AliasedTableT>
) {
    return QueryUtil.newInstance()
        .from(aliasedTable);
}

export function requireOuterQueryJoins<
    AliasedTablesT extends readonly IAliasedTable[]
> (
    ...aliasedTables : (
        & AliasedTablesT
        & FromClauseUtil.AssertValidOuterQueryJoins<QueryUtil.NewInstance["fromClause"], AliasedTablesT>
    )
) : (
    QueryUtil.RequireOuterQueryJoins<QueryUtil.NewInstance, AliasedTablesT>
) {
    return QueryUtil.newInstance()
        .requireOuterQueryJoins<AliasedTablesT>(...aliasedTables as any);
}

export function requireNullableOuterQueryJoins<
    AliasedTablesT extends readonly IAliasedTable[]
> (
    ...aliasedTables : (
        & AliasedTablesT
        & FromClauseUtil.AssertValidOuterQueryJoins<QueryUtil.NewInstance["fromClause"], AliasedTablesT>
    )
) : (
    QueryUtil.RequireNullableOuterQueryJoins<QueryUtil.NewInstance, AliasedTablesT>
) {
    return QueryUtil.newInstance()
        .requireNullableOuterQueryJoins<AliasedTablesT>(...aliasedTables as any);
}

export function select<
    SelectsT extends SelectClause
> (
    selectDelegate : SelectDelegate<
        QueryUtil.NewInstance["fromClause"],
        QueryUtil.NewInstance["selectClause"],
        SelectsT
    >
) : (
    QueryUtil.Select<QueryUtil.NewInstance, SelectsT>
) {
    return QueryUtil.newInstance()
        .select<SelectsT>(selectDelegate);
}

export function selectValue<
    RawExprT extends AnyBuiltInExpr
> (
    selectValueDelegate : SelectValueDelegate<
        QueryUtil.NewInstance["fromClause"],
        QueryUtil.NewInstance["selectClause"],
        RawExprT
    >
) : (
    QueryUtil.SelectValue<QueryUtil.NewInstance, RawExprT>
) {
    return QueryUtil.newInstance()
        .selectValue<RawExprT>(selectValueDelegate);
}
