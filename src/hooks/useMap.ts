type Position = {
  row: string;
  column: string;
};

const rowsNumberPhase1 = 11;
const columnsNumberPhase1 = 11;
const rows = Array.from(Array(rowsNumberPhase1).keys());
const cols = Array.from(Array(columnsNumberPhase1).keys());

export const useMap = () => {
  const getAllMapPositionsPhase1 = () => {
    const posList: Position[] = [];
    rows.forEach((row) => {
      cols.forEach((col) => {
        const pos: Position = { row: `${row}`, column: `${col}` };
        posList.push(pos);
      });
    });
    return posList;
  };

  return { getAllMapPositionsPhase1 };
};
