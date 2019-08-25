import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../../dist";
export declare const expr: tsql.ExprImpl<tm.Mapper<unknown, boolean>, tsql.IUsedRef<{
    readonly myTable: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly createdAt: Date;
    };
    readonly childTable: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly accessedAt: Date;
        readonly userId2: bigint;
        readonly computerId2: string;
    };
    readonly myTable2: {
        readonly userId2: bigint;
        readonly computerId2: string;
        readonly createdAt2: Date;
    };
}>>;