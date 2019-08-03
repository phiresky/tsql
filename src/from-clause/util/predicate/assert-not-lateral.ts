import {IAliasedTable} from "../../../aliased-table";
import {CompileError} from "../../../compile-error";

/**
 * + The `LATERAL` keyword was added in MySQL 8.0
 * + The `LATERAL` keyword is not in MySQL 5.7
 */
export type AssertNotLateral<
    AliasedTableT extends IAliasedTable,
    TrueT
> = (
    Extract<AliasedTableT["lateral"], true> extends never ?
    TrueT :
    CompileError<[
        AliasedTableT["tableAlias"],
        "cannot be LATERAL; does your DBMS support it?"
    ]>
);
export function assertNotLateral (
    aliasedTable : IAliasedTable
) {
    if (aliasedTable.lateral) {
        throw new Error(`${aliasedTable.tableAlias} cannot be LATERAL; does your DBMS support it?`);
    }
}
