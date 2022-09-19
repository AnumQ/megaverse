import {
  CANDIDATE_ID,
  CREATE_SOLOON,
  FAILED_CREATE_SOLOON,
  POST,
  STATUS_FULFILLED,
  SUCCESS_CREATE_SOLOON,
} from "../constants";
import { Position } from "../Model/Position";

export const useSoloons = () => {
  const createSoloons = async (
    posList: Position[],
    color: string,
    onCompletion: () => void
  ) => {
    const promises = posList.map((pos) => {
      return fetch(CREATE_SOLOON, {
        method: POST,
        body: JSON.stringify({
          candidateId: CANDIDATE_ID,
          row: `${pos.row}`,
          column: `${pos.column}`,
          color: color,
        }),
      });
    });

    try {
      const results = await Promise.allSettled(promises);
      results.forEach((res, index) => {
        if (res.status !== STATUS_FULFILLED) {
          console.log(`${FAILED_CREATE_SOLOON} ${index}`);
        }
      });
      onCompletion();

      return { success: SUCCESS_CREATE_SOLOON };
    } catch (error) {
      console.error(error);
    }
  };

  return {
    createSoloons,
  };
};
