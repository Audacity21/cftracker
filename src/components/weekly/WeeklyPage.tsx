import { useSelector } from "react-redux";
import { RootStateType } from "../../data/store";
import React, { useEffect, useState } from "react"; 
import RatingButton from "./RatingButton";
import problems from "../../data/jsons/problemset";
import Problems from "./Problems";
import { Verdict } from "../../util/DataTypes/Submission";

const WeeklyPage = () => {
  const state: RootStateType = useSelector((state: RootStateType) => state);

  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isValidUser, setIsValidUser] = useState<boolean>(false);
  const [lastRating, setLastRating] = useState<number>(0);
  const [maxRating, setMaxRating] = useState<number>(0);
  const [solved, setSolved] = useState<number | null>(null);
  const [unsolved, setUnsolved] = useState<number | null>(null);
  const [solvedProblems, setSolvedProblems] = useState<any[]>([]);
  const [attemptedProblems, setAttemptedProblems] = useState<any[]>([]);

  const weeks: number[] = [
    1,2,3,4,5,6,7,8,9,10
  ];

  const handleRatingSelect = (week: number) => {
    setSelectedWeek(week);
  };

  const getProblemStatus = (problemId: string) => {
    for (let submission of state.userSubmissions.submissions) {
      if (submission.contestId.toString() + submission.index === problemId) {
        return submission.verdict === Verdict.OK ? Verdict.SOLVED : Verdict.ATTEMPTED;
      }
    }
    return Verdict.UNSOLVED;
  };

  useEffect(() => {
    setIsValidUser(state.userList.handles !== ""); // Check if user data exists
    setMaxRating(state.appState.maxRating);

    // Calculate solved and attempted problems based on submissions
    const solvedProblemsTemp = [];
    const attemptedProblemsTemp = [];
    for (let problem of problems) {
      const problemId = problem.contestId.toString() + problem.index;
      const status = getProblemStatus(problemId);
      if (status === Verdict.SOLVED) {
        solvedProblemsTemp.push(problem);
      } else if (status === Verdict.ATTEMPTED) {
        attemptedProblemsTemp.push(problem);
      }
    }
    setSolvedProblems(solvedProblemsTemp);
    setAttemptedProblems(attemptedProblemsTemp);
  }, [state.userSubmissions.submissions, state.userList.handles, selectedWeek]); 

  return (
    <React.Fragment>
      <div style={styles.container}>
        <div style={styles.ratingContainer}>
          {weeks.map((week) => {
            return (
              <RatingButton
                key={week}
                week={week}
                isSelected={week === selectedWeek}
                onSelect={handleRatingSelect}
              />
            );
          })}
        </div>
        <Problems
          week={selectedWeek}
          isValidUser={isValidUser}
          solvedProblems={solvedProblems}
          attemptedProblems={attemptedProblems}
        />
      </div>
    </React.Fragment>
  );
}

interface StylesType {
  container: React.CSSProperties;
  ratingContainer: React.CSSProperties;
  userContainer: React.CSSProperties;
  infoContainer: React.CSSProperties;
  searchContainer: React.CSSProperties;
  input: React.CSSProperties;
  button: React.CSSProperties;
}

const styles: StylesType = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  ratingContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '60%',
    marginTop: '20px',
  },
  userContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '60%',
  },
  infoContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '40%',
    minWidth: '200px',
    marginTop: '10px',
    border: '1px solid black',
    borderRadius: '5px',
    alignItems: 'center',
    marginBottom: '10px',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '60%',
    marginBottom: '10px',
  },
  input: {
    height: '20px',
    width: '200px',
    fontSize: '1rem',
    padding: '0.5rem',
    marginRight: '1rem',
    borderRadius: '5px',
  },
  button: {
    height: '40px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    borderRadius: '5px',
    backgroundColor: '#85a1f3',
    fontWeight: 'bold',
  },
};

export default WeeklyPage;