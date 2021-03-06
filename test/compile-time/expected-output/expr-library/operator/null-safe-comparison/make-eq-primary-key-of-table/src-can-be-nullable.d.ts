import * as tsql from "../../../../../../../dist";
export declare const expr: tsql.ExprImpl<boolean, tsql.IUsedRef<{
    readonly childTable: {
        readonly userId: bigint | null;
        readonly computerId: string | null;
        readonly accessedAt: Date;
    };
    readonly myTable: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly createdAt: Date;
    };
}>, false>;
