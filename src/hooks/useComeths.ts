import {
  CANDIDATE_ID,
  COMETH_DOWN_MESSAGE,
  COMETH_LEFT_MESSAGE,
  COMETH_RIGHT_MESSAGE,
  COMETH_UP_MESSAGE,
  CREATE_COMETH,
  DOWN_COMETH_TYPE,
  FAILED_CREATE_COMETHS,
  LEFT_COMETH_TYPE,
  POST,
  RIGHT_COMETH_TYPE,
  STATUS_FULFILLED,
  SUCCESS_CREATE_COMETHS,
  UP_COMETH_TYPE,
} from "../constants";
import { LogoItem } from "../Model/LogoItem";
import { Position } from "../Model/Position";
import _ from "lodash";
import { useMap } from "./useMap";

export const useComeths = () => {
  const { fetchMyMap } = useMap();
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

  const createDownComethsInLogo = async (
    logoDataList: LogoItem[],
    getMyMap: () => void,
    setIsCreateButtonLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSuccessInfo: any
  ) => {
    const downComethPositions = _.compact(
      logoDataList.map((logoItem) =>
        logoItem.type === DOWN_COMETH_TYPE ? logoItem.position : null
      )
    );

    try {
      await createDownComethsInLogoRecursively(
        downComethPositions,
        getMyMap,
        setIsCreateButtonLoading,
        setSuccessInfo
      );
    } catch (error) {
      console.error(error);
    }
  };
  const createRightComethsInLogo = async (
    logoDataList: LogoItem[],
    getMyMap: () => void,
    setIsCreateButtonLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSuccessInfo: any
  ) => {
    const rightComethPositions = _.compact(
      logoDataList.map((logoItem) =>
        logoItem.type === RIGHT_COMETH_TYPE ? logoItem.position : null
      )
    );

    try {
      await createRightComethsInLogoRecursively(
        rightComethPositions,
        getMyMap,
        setIsCreateButtonLoading,
        setSuccessInfo
      );
    } catch (error) {
      console.error(error);
    }
  };

  const createLeftComethsInLogo = async (
    logoDataList: LogoItem[],
    getMyMap: () => void,
    setIsCreateButtonLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSuccessInfo: any
  ) => {
    const leftComethPositions = _.compact(
      logoDataList.map((logoItem) =>
        logoItem.type === LEFT_COMETH_TYPE ? logoItem.position : null
      )
    );

    try {
      await createLeftComethsInLogoRecursively(
        leftComethPositions,
        getMyMap,
        setIsCreateButtonLoading,
        setSuccessInfo
      );
    } catch (error) {
      console.error(error);
    }
  };

  const createUpComethsInLogo = async (
    logoDataList: LogoItem[],
    getMyMap: () => void,
    setIsCreateButtonLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSuccessInfo: any
  ) => {
    const upComethPositions = _.compact(
      logoDataList.map((logoItem) =>
        logoItem.type === UP_COMETH_TYPE ? logoItem.position : null
      )
    );

    try {
      await createUpComethsInLogoRecursively(
        upComethPositions,
        getMyMap,
        setIsCreateButtonLoading,
        setSuccessInfo
      );
    } catch (error) {
      console.error(error);
    }
  };

  const createRightComethsInLogoRecursively = async (
    positions: Position[],
    getMyMap: () => void,
    setIsCreateButtonLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSuccessInfo: any
  ) => {
    const result = await createComeths(positions, "right", async () => {
      getMyMap();
      const missingPositions = await getComethMissingPositions(positions);

      console.log("Line 161");
      if (missingPositions.length > 0) {
        console.log(COMETH_RIGHT_MESSAGE);

        console.log("Line 165");

        createRightComethsInLogoRecursively(
          missingPositions,
          getMyMap,
          setIsCreateButtonLoading,
          setSuccessInfo
        );
      } else {
        console.log("Line 175");

        setIsCreateButtonLoading(false);
        if (result) {
          console.log(result.success);
          setSuccessInfo(result?.success);
        }
      }
    });
  };

  const createDownComethsInLogoRecursively = async (
    positions: Position[],
    getMyMap: () => void,
    setIsCreateButtonLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSuccessInfo: any
  ) => {
    const result = await createComeths(positions, "down", async () => {
      getMyMap();
      const missingPositions = await getComethMissingPositions(positions);
      if (missingPositions.length > 0) {
        console.log(COMETH_DOWN_MESSAGE);
        createDownComethsInLogoRecursively(
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

  const getComethMissingPositions = async (positions: Position[]) => {
    const mapObject = await fetchMyMap();
    const map = mapObject.content;
    const missingPositions: Position[] = [];
    positions.forEach((pos: Position) => {
      const mapPos = map[pos.row][pos.column];
      if (mapPos === null || (mapPos && mapPos.type !== 2)) {
        missingPositions.push(pos);
      }
    });

    return missingPositions;
  };

  const createLeftComethsInLogoRecursively = async (
    positions: Position[],
    getMyMap: () => void,
    setIsCreateButtonLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSuccessInfo: any
  ) => {
    const result = await createComeths(positions, "left", async () => {
      getMyMap();

      const missingPositions = await getComethMissingPositions(positions);

      if (missingPositions.length > 0) {
        console.log(COMETH_LEFT_MESSAGE);
        createLeftComethsInLogoRecursively(
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

  const createUpComethsInLogoRecursively = async (
    positions: Position[],
    getMyMap: () => void,
    setIsCreateButtonLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSuccessInfo: any
  ) => {
    const result = await createComeths(positions, "up", async () => {
      getMyMap();
      const missingPositions = await getComethMissingPositions(positions);
      if (missingPositions.length > 0) {
        console.log(COMETH_UP_MESSAGE);
        createUpComethsInLogoRecursively(
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
    createRightComethsInLogo,
    createLeftComethsInLogo,
    createUpComethsInLogo,
    createDownComethsInLogo,
  };
};
