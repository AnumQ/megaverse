import {
  CANDIDATE_ID,
  CREATE_POLYANET,
  DELETE_POLYANET,
  FAILED_CREATE_POLYANET,
  FAILED_DELETE_POLYANET,
  POST,
  STATUS_FULFILLED,
  SUCCESS_CREATE_POLYANET,
  SUCCESS_DELETE_POLYANET,
} from "../constants";
import { Position } from "../Model/Position";
import { useLoading } from "./useLoading";
import { useMap } from "./useMap";

const rowsNumberPhase1 = 11;
const columnsNumberPhase1 = 11;
const rows = Array.from(Array(rowsNumberPhase1).keys());
const cols = Array.from(Array(columnsNumberPhase1).keys());

export const usePolyanets = () => {
  const { isLoading: isCreateLoading, setIsLoading: setIsCreateButtonLoading } =
    useLoading();
  const { isLoading: isDeleteLoading, setIsLoading: setIsDeleteButtonLoading } =
    useLoading();
  const { getAllMapPositionsPhase1 } = useMap();

  const startRow = 2;

  const getPolyanetPositions = () => {
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

  const createPolyanets = async (onCompletion: () => void) => {
    setIsCreateButtonLoading(true);
    const posList = getPolyanetPositions();
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
      setIsCreateButtonLoading(false);
      console.log(SUCCESS_CREATE_POLYANET);
      onCompletion();

      return { success: SUCCESS_CREATE_POLYANET };
    } catch (error) {
      setIsCreateButtonLoading(false);
      console.error(error);
    }
  };

  const deletePolyanets = async (onCompletion: () => void) => {
    setIsDeleteButtonLoading(true);
    const posList = getAllMapPositionsPhase1();
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
          console.log(`${FAILED_DELETE_POLYANET} ${index}`);
        }
      });

      console.log(SUCCESS_DELETE_POLYANET);
      setIsDeleteButtonLoading(false);
      onCompletion();
      return { success: SUCCESS_DELETE_POLYANET };
    } catch (error) {
      setIsDeleteButtonLoading(false);
      console.error(error);
    }
  };

  return { createPolyanets, deletePolyanets, isCreateLoading, isDeleteLoading };
};
