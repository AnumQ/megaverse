import {
  CANDIDATE_ID,
  CREATE_COMETH,
  CREATE_POLYANET,
  DELETE_POLYANET,
  FAILED_CREATE_COMETHS,
  FAILED_CREATE_POLYANET,
  FAILED_DELETE_POLYANET,
  POST,
  STATUS_FULFILLED,
  SUCCESS_CREATE_COMETHS,
  SUCCESS_CREATE_POLYANET,
  SUCCESS_DELETE_POLYANET,
} from "../constants";
import { Position } from "../Model/Position";
import { useMap } from "./useMap";

const rowsNumberPhase1 = 11;
const columnsNumberPhase1 = 11;
const rows = Array.from(Array(rowsNumberPhase1).keys());
const cols = Array.from(Array(columnsNumberPhase1).keys());

export const usePolyanets = () => {
  const { getAllMapPositionsPhase1, getAllMapPositionsPhase2 } = useMap();

  const startRow = 2;

  const getPolyanetPositionsPhase1 = () => {
    const posList: Position[] = [];
    const stopRow = rows.length - 1 - startRow;
    rows.forEach((row) => {
      if (row >= startRow && row <= stopRow) {
        cols.forEach((col) => {
          if (col >= startRow && col <= stopRow) {
            if (col === row) {
              posList.push({ row: `${row}`, column: `${col}` });
              const colInvert = cols.length - 1 - col;
              posList.push({ row: `${row}`, column: `${colInvert}` });
            }
          }
        });
      }
    });

    return posList;
  };

  const createPolyanets = async (
    posList: Position[],
    onCompletion: () => void
  ) => {
    const promises = posList.map((pos) => {
      return fetch(CREATE_POLYANET, {
        method: POST,
        body: JSON.stringify({
          candidateId: CANDIDATE_ID,
          row: `${pos.row}`,
          column: `${pos.column}`,
        }),
      });
    });

    try {
      const results = await Promise.allSettled(promises);
      results.forEach((res, index) => {
        if (res.status !== STATUS_FULFILLED) {
          console.log(`${FAILED_CREATE_POLYANET} ${index}`);
        }
      });
      onCompletion();

      return { success: SUCCESS_CREATE_POLYANET };
    } catch (error) {
      console.error(error);
    }
  };

  const createPolyanetsPhase1 = async (onCompletion: () => void) => {
    const posList = getPolyanetPositionsPhase1();
    return createPolyanets(posList, onCompletion);
  };

  const deletePolyanetsPhase1 = async (onCompletion: () => void) => {
    const posList = getAllMapPositionsPhase1();
    return deletePolyanets(posList, onCompletion);
  };

  const deletePolyanetsPhase2 = async (myMap: [], onCompletion: () => void) => {
    const positionsToDelete: Position[] = [];
    myMap.forEach((row: string[], rowIndex: number) => {
      row.forEach((col: string, colIndex: number) => {
        if (col) {
          const pos = { row: rowIndex.toString(), column: colIndex.toString() };
          positionsToDelete.push(pos);
        }
      });
    });
    return deletePolyanets(positionsToDelete, onCompletion);
  };
  const deletePolyanets = async (
    posList: Position[],
    onCompletion: () => void
  ) => {
    const promises = posList.map((pos: Position) => {
      return fetch(DELETE_POLYANET, {
        method: POST,
        body: JSON.stringify({
          candidateId: CANDIDATE_ID,
          row: `${pos.row}`,
          column: `${pos.column}`,
        }),
      });
    });

    try {
      const results = await Promise.allSettled(promises);

      results.forEach((res, index) => {
        if (res.value.status !== 200) {
          console.error(`${FAILED_DELETE_POLYANET} ${index}`);
        }
      });

      onCompletion();
      return { success: SUCCESS_DELETE_POLYANET };
    } catch (error) {
      console.error(error);
    }
  };

  return {
    createPolyanetsPhase1,
    createPolyanets,
    deletePolyanets,
    deletePolyanetsPhase1,
    deletePolyanetsPhase2,
  };
};
