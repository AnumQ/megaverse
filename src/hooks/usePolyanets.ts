import {
  CANDIDATE_ID,
  CREATE_POLYANET,
  DELETE_POLYANET,
  FAILED_CREATE_POLYANET,
  FAILED_DELETE_POLYANET,
  POLYANET_TYPE,
  POST,
  STATUS_FULFILLED,
  SUCCESS_CREATE_POLYANET,
  SUCCESS_DELETE_POLYANET,
} from "../constants";
import { Position } from "../Model/Position";
import { useMap } from "./useMap";
import _ from "lodash";
import { LogoItem } from "../Model/LogoItem";

export const usePolyanets = () => {
  const rowsNumberPhase1 = 11;
  const columnsNumberPhase1 = 11;
  const rows = Array.from(Array(rowsNumberPhase1).keys());
  const cols = Array.from(Array(columnsNumberPhase1).keys());
  const startRow = 2;

  const { getAllMapPositionsPhase1, fetchMyMap } = useMap();

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

  const createPolyanetsInLogo = async (
    logoDataList: LogoItem[],
    getMyMap: () => void,
    setIsCreateButtonLoading: any,
    setSuccessInfo: any
  ) => {
    const polyPositions = _.compact(
      logoDataList.map((logoItem) =>
        logoItem.type === POLYANET_TYPE ? logoItem.position : null
      )
    );
    try {
      await createPolyanetsRecursively(
        polyPositions,
        getMyMap,
        setIsCreateButtonLoading,
        setSuccessInfo
      );
    } catch (error) {
      setIsCreateButtonLoading(false);
      console.error(error);
    }
  };

  const createPolyanetsRecursively = async (
    polyPositions: Position[],
    getMyMap: () => void,
    setIsCreateButtonLoading: any,
    setSuccessInfo: any
  ) => {
    const result = await createPolyanets(polyPositions, async () => {
      getMyMap();
      const mapObject = await fetchMyMap();
      const map = mapObject.content;
      const missingPositions: Position[] = [];
      polyPositions.forEach((pos: Position) => {
        const mapPos = map[pos.row][pos.column];

        if (mapPos === null || (mapPos && mapPos.type !== 0)) {
          missingPositions.push(pos);
        }
      });

      if (missingPositions.length > 0) {
        console.log("Creating polyanets that failed in the previous calls");
        createPolyanetsRecursively(
          missingPositions,
          getMyMap,
          setIsCreateButtonLoading,
          setSuccessInfo
        );
      } else {
        setIsCreateButtonLoading(false);

        if (result) {
          console.log(result.success);
          setSuccessInfo(result?.success);
        }
      }
    });
  };

  return {
    createPolyanetsPhase1,
    createPolyanets,
    deletePolyanets,
    deletePolyanetsPhase1,
    deletePolyanetsPhase2,
  };
};
