import {
  BLUE,
  BLUE_SOLOON_TYPE,
  CANDIDATE_ID,
  CREATE_SOLOON,
  FAILED_CREATE_SOLOON,
  POST,
  PURPLE,
  PURPLE_SOLOON_TYPE,
  RED,
  RED_SOLOON_TYPE,
  SOLOON_BLUE_MESSAGE,
  SOLOON_PURPLE_MESSAGE,
  SOLOON_RED_MESSAGE,
  SOLOON_WHITE_MESSAGE,
  STATUS_FULFILLED,
  SUCCESS_CREATE_SOLOON,
  WHITE,
  WHITE_SOLOON_TYPE,
} from "../constants";
import { LogoItem } from "../Model/LogoItem";
import { Position } from "../Model/Position";
import { useMap } from "./useMap";
import _ from "lodash";

export const useSoloons = () => {
  const { fetchMyMap } = useMap();
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

  const getMissingPositions = async (positions: Position[]) => {
    const mapObject = await fetchMyMap();
    const map = mapObject.content;
    const missingPositions: Position[] = [];
    positions.forEach((pos: Position) => {
      const mapPos = map[pos.row][pos.column];
      if (mapPos === null || (mapPos && mapPos.type !== 1)) {
        missingPositions.push(pos);
      }
    });

    return missingPositions;
  };

  const createSoloonsInLogo = async (
    logoDataList: LogoItem[],
    getMyMap: () => void,
    setIsCreateButtonLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSuccessInfo: any,
    color: string
  ) => {
    let positions: Position[] = [];
    switch (color) {
      case BLUE:
        positions = _.compact(
          logoDataList.map((logoItem) =>
            logoItem.type === BLUE_SOLOON_TYPE ? logoItem.position : null
          )
        );
        break;
      case PURPLE:
        positions = _.compact(
          logoDataList.map((logoItem) =>
            logoItem.type === PURPLE_SOLOON_TYPE ? logoItem.position : null
          )
        );
        break;
      case WHITE:
        positions = _.compact(
          logoDataList.map((logoItem) =>
            logoItem.type === WHITE_SOLOON_TYPE ? logoItem.position : null
          )
        );
        break;
      case RED:
        positions = _.compact(
          logoDataList.map((logoItem) =>
            logoItem.type === RED_SOLOON_TYPE ? logoItem.position : null
          )
        );
        break;
    }

    try {
      await createSoloonsInLogoRecursively(
        positions,
        getMyMap,
        setIsCreateButtonLoading,
        setSuccessInfo,
        color
      );
    } catch (error) {
      console.error(error);
    }
  };

  const createSoloonsInLogoRecursively = async (
    positions: Position[],
    getMyMap: () => void,
    setIsCreateButtonLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSuccessInfo: any,
    color: string
  ) => {
    const result = await createSoloons(positions, color, async () => {
      getMyMap();
      const missingPositions = await getMissingPositions(positions);
      if (missingPositions.length > 0) {
        switch (color) {
          case BLUE:
            console.log(SOLOON_BLUE_MESSAGE);
            break;
          case PURPLE:
            console.log(SOLOON_PURPLE_MESSAGE);
            break;
          case WHITE:
            console.log(SOLOON_WHITE_MESSAGE);
            break;
          case RED:
            console.log(SOLOON_RED_MESSAGE);
            break;
        }

        createSoloonsInLogoRecursively(
          missingPositions,
          getMyMap,
          setIsCreateButtonLoading,
          setSuccessInfo,
          color
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
    createSoloons,
    createSoloonsInLogo,
  };
};
