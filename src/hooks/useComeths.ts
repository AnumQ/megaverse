import {
  CANDIDATE_ID,
  CREATE_COMETH,
  FAILED_CREATE_COMETHS,
  POST,
  STATUS_FULFILLED,
  SUCCESS_CREATE_COMETHS,
} from "../constants";
import { Position } from "../Model/Position";

export const useComeths = () => {
  const createComeths = async (
    posList: Position[],
    direction: string,
    onCompletion: () => void
  ) => {
    const promises = posList.map((pos) => {
      return fetch(CREATE_COMETH, {
        method: POST,
        body: JSON.stringify({
          candidateId: CANDIDATE_ID,
          row: `${pos.row}`,
          column: `${pos.column}`,
          direction: direction,
        }),
      });
    });

    try {
      const results = await Promise.allSettled(promises);
      results.forEach((res, index) => {
        if (res.status !== STATUS_FULFILLED) {
          console.log(`${FAILED_CREATE_COMETHS} ${index}`);
        }
      });
      onCompletion();

      return { success: SUCCESS_CREATE_COMETHS };
    } catch (error) {
      console.error(error);
    }
  };

  return {
    createComeths,
  };
};
