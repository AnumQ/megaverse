import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { usePolyanets } from "../src/hooks/usePolyanets";
import { useMap } from "../src/hooks/useMap";
import Alert from "@mui/material/Alert";
import { GoalMap } from "../src/UI/GoalMap";
import { MyMap } from "../src/UI/MyMap";
import _ from "lodash";
import { Phase1 } from "../src/components/Phase1";
import { Phase2 } from "../src/components/Phase2";

const Home: NextPage = () => {
  // variables, states
  const [goalMap, setGoal] = useState<[]>([]);
  const [myMap, setMap] = useState<[]>([]);

  const [successInfo, setSuccessInfo] = useState("");

  const { fetchMap: fetchGoalMap, fetchMyMap } = useMap();

  // async functions
  async function getGoalMap() {
    const goalMap = await fetchGoalMap();
    setGoal(goalMap);
  }

  const getMyMap = async () => {
    const map = await fetchMyMap();
    if (map) {
      setMap(map.content);
    }
  };

  // on initial load
  useEffect(() => {
    getGoalMap();
    getMyMap();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Megaverse challenge | Anum </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Megaverse Challenge!</h1>
        <h3 className={styles.subtitle}>Completed by Anum</h3>

        <div className={styles.grid}>
          <Phase1 getMyMap={getMyMap} setSuccessInfo={setSuccessInfo} />
          <Phase2
            myMap={myMap}
            goalMap={goalMap}
            getMyMap={getMyMap}
            setSuccessInfo={setSuccessInfo}
          />
        </div>

        {successInfo ? (
          <>
            <Alert variant="outlined" severity="success">
              {successInfo}
            </Alert>
          </>
        ) : (
          <></>
        )}
        <div className={styles.inline}>
          <GoalMap goal={goalMap} />
          <MyMap myMap={myMap} />
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
