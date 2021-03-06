import {ColumnIdentifierMap, WritableColumnIdentifierMap} from "../../column-identifier-map";
import {ColumnIdentifier} from "../../../column-identifier";
import {Identity} from "../../../type-util";

/**
 * Does not check `tableAlias`
 */
export type ExtractColumnIdentifier_ColumnAlias<
    MapT extends ColumnIdentifierMap,
    ColumnIdentifierT extends ColumnIdentifier
> =
    {
        [columnAlias in Extract<keyof MapT, string>] : (
            columnAlias extends ColumnIdentifierT["columnAlias"] ?
            columnAlias :
            never
        )
    }[Extract<keyof MapT, string>]
;

/**
 * Does not check `tableAlias`
 */
export type ExtractColumnIdentifier<
    MapT extends ColumnIdentifierMap,
    ColumnIdentifierT extends ColumnIdentifier
> =
    Identity<{
        readonly [columnAlias in ExtractColumnIdentifier_ColumnAlias<MapT, ColumnIdentifierT>] : (
            MapT[columnAlias]
        )
    }>
;

/**
 * Does not check `tableAlias`
 */
export function extractColumnIdentifiers<
    MapT extends ColumnIdentifierMap,
    ColumnIdentifierT extends ColumnIdentifier
> (
    map : MapT,
    columnIdentifiers : readonly ColumnIdentifierT[]
) : (
    ExtractColumnIdentifier<MapT, ColumnIdentifierT>
) {
    const result : WritableColumnIdentifierMap = {};
    for (const columnAlias of Object.keys(map)) {
        if (columnIdentifiers.some(columnIdentifier => columnIdentifier.columnAlias == columnAlias)) {
            result[columnAlias] = map[columnAlias];
        }
    }
    return result as ExtractColumnIdentifier<MapT, ColumnIdentifierT>;
}
