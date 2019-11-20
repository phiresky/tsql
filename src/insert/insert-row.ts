import {ITable, TableUtil} from "../table";
import {RawExprNoUsedRef_Output, RawExprNoUsedRef_Input} from "../raw-expr";
import {Key} from "../key";
import {Identity} from "../type-util";

export type InsertRowRequireCandidateKey_NonUnion<
    TableT extends ITable,
    CandidateKeyT extends Key
> =
    Identity<
        & {
            readonly [columnAlias in Exclude<TableUtil.RequiredColumnAlias<TableT>, CandidateKeyT[number]>] : (
                RawExprNoUsedRef_Input<
                    ReturnType<TableT["columns"][columnAlias]["mapper"]>
                >
            )
        }
        & {
            readonly [columnAlias in Exclude<TableUtil.OptionalColumnAlias<TableT>, CandidateKeyT[number]>]? : (
                RawExprNoUsedRef_Input<
                    ReturnType<TableT["columns"][columnAlias]["mapper"]>
                >
            )
        }
        /**
         * This Candidate key is required.
         */
        & {
            readonly [candidateKeyColumnAlias in CandidateKeyT[number]] : (
                RawExprNoUsedRef_Input<
                    ReturnType<TableT["columns"][candidateKeyColumnAlias]["mapper"]>
                >
            )
        }
    >
;
export type InsertRowRequireCandidateKey_InputImpl<
    TableT extends ITable,
    CandidateKeyT extends Key
> =
    CandidateKeyT extends Key ?
    InsertRowRequireCandidateKey_NonUnion<TableT, CandidateKeyT> :
    never
;
export type InsertRowRequireCandidateKey_Input<TableT extends ITable> =
    InsertRowRequireCandidateKey_InputImpl<
        TableT,
        TableT["candidateKeys"][number]
    >
;

/**
 * This allows custom data types
 */
export type InsertRow_Input<TableT extends ITable> =
    Identity<
        & {
            readonly [columnAlias in TableUtil.RequiredColumnAlias<TableT>] : (
                RawExprNoUsedRef_Input<
                    ReturnType<TableT["columns"][columnAlias]["mapper"]>
                >
            )
        }
        & {
            readonly [columnAlias in TableUtil.OptionalColumnAlias<TableT>]? : (
                RawExprNoUsedRef_Input<
                    ReturnType<TableT["columns"][columnAlias]["mapper"]>
                >
            )
        }
    >
;
export type InsertRowLiteral<TableT extends ITable> =
    Identity<
        {
            readonly [columnAlias in TableUtil.RequiredColumnAlias<TableT>] : (
                ReturnType<TableT["columns"][columnAlias]["mapper"]>
            )
        } &
        {
            readonly [columnAlias in TableUtil.OptionalColumnAlias<TableT>]? : (
                ReturnType<TableT["columns"][columnAlias]["mapper"]>
            )
        }
    >
;

/**
 * This **does not** allow custom data types
 */
export type InsertRow_Output<TableT extends ITable> =
    Identity<
        & {
            readonly [columnAlias in TableUtil.RequiredColumnAlias<TableT>] : (
                RawExprNoUsedRef_Output<
                    ReturnType<TableT["columns"][columnAlias]["mapper"]>
                >
            )
        }
        & {
            readonly [columnAlias in TableUtil.OptionalColumnAlias<TableT>]? : (
                RawExprNoUsedRef_Output<
                    ReturnType<TableT["columns"][columnAlias]["mapper"]>
                >
            )
        }
    >
;
