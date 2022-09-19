import { GET, GET_GOAL_MAP, GET_MY_MAP } from "../constants";

type Position = {
  row: string;
  column: string;
};

export const useMap = () => {
  const getAllMapPositionsPhase1 = () => {
    const rowsNumberPhase1 = 11;
    const columnsNumberPhase1 = 11;
    const rows = Array.from(Array(rowsNumberPhase1).keys());
    const cols = Array.from(Array(columnsNumberPhase1).keys());

    const posList: Position[] = [];
    rows.forEach((row) => {
      cols.forEach((col) => {
        const pos: Position = { row: `${row}`, column: `${col}` };
        posList.push(pos);
      });
    });
    return posList;
  };

  const getAllMapPositionsPhase2 = () => {
    const rowsNumberPhase1 = 30;
    const columnsNumberPhase1 = 30;
    const rows = Array.from(Array(rowsNumberPhase1).keys());
    const cols = Array.from(Array(columnsNumberPhase1).keys());

    const posList: Position[] = [];
    rows.forEach((row) => {
      cols.forEach((col) => {
        const pos: Position = { row: `${row}`, column: `${col}` };
        posList.push(pos);
      });
    });
    return posList;
  };

  async function fetchMyMap() {
    try {
      const res = await fetch(GET_MY_MAP, {
        method: GET,
      });
      const json = await res.json();
      return json.map;
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchGoalMap() {
    try {
      const res = await fetch(GET_GOAL_MAP, {
        method: GET,
      });
      const json = await res.json();
      return json.goal;
    } catch (error) {
      console.error(error);
    }
  }

  return {
    getAllMapPositionsPhase1,
    fetchGoalMap,
    fetchMyMap,
    getAllMapPositionsPhase2,
  };
};
