import * as tm from "type-mapping";
import {IColumn, ColumnUtil} from "../../column";
import {BuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {Expr} from "../../expr/expr-impl";
import {isNull} from "../null-safe-equation";
import {AssertNonUnion} from "../../type-util";
import {UsedRefUtil} from "../../used-ref";
import {EquatableType, EquatableTypeUtil} from "../../equatable-type";
import * as ifImpl from "./if";

export function ifIsNull<
    ColumnT extends IColumn,
    ThenT extends BuiltInExpr<EquatableType>,
    ElseT extends BuiltInExpr<EquatableTypeUtil.BaseEquatableType<BuiltInExprUtil.TypeOf<ThenT>>|null>
>(
    column : ColumnT & AssertNonUnion<ColumnT>,
    then : ThenT,
    elseDelegate : (narrowedColumns : {
        [columnAlias in ColumnT["columnAlias"]] : ColumnUtil.ToNonNullable<ColumnT>
    }) => ElseT
) : (
    Expr<{
        mapper : tm.SafeMapper<BuiltInExprUtil.TypeOf<ThenT|ElseT>>,
        usedRef : (
            UsedRefUtil.IntersectTryReuseExistingType<
                | BuiltInExprUtil.UsedRef<ThenT>
                | UsedRefUtil.WithValue<
                    BuiltInExprUtil.IntersectUsedRef<
                        | ColumnT
                        | ElseT
                    >,
                    ColumnT["tableAlias"],
                    ColumnT["columnAlias"],
                    tm.OutputOf<ColumnT["mapper"]>
                >
            >
        ),
    }>
) {
    return ifImpl.if(
        isNull(column),
        then,
        elseDelegate(
            {
                [column.columnAlias] : ColumnUtil.toNonNullable<ColumnT>(column)
            } as (
                {
                    [columnAlias in ColumnT["columnAlias"]] : ColumnUtil.ToNonNullable<ColumnT>
                }
            )
        )
    ) as (
        Expr<{
            mapper : tm.SafeMapper<BuiltInExprUtil.TypeOf<ThenT|ElseT>>,
            usedRef : (
                UsedRefUtil.IntersectTryReuseExistingType<
                    | BuiltInExprUtil.UsedRef<ThenT>
                    | UsedRefUtil.WithValue<
                        BuiltInExprUtil.IntersectUsedRef<
                            | ColumnT
                            | ElseT
                        >,
                        ColumnT["tableAlias"],
                        ColumnT["columnAlias"],
                        tm.OutputOf<ColumnT["mapper"]>
                    >
                >
            ),
        }>
    );
}