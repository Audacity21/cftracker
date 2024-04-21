import React, { useEffect, useState } from 'react';
import { RootStateType } from '../../data/store';
import { useSelector } from 'react-redux';
import './Problems.css';
import axios from 'axios';
import { ThemesType } from '../../util/Theme';
import Editorial from './Editorial';

interface Problem {
  contestId: number;
  index: string;
  name: string;
  rating: number;
  week: number;
  editorial?: string;
}

interface ProblemsProps {
  week: number;
  isValidUser: boolean;
  solvedProblems: { contestId: number; index: string }[];
  attemptedProblems: { contestId: number; index: string }[];
}

const Problems: React.FC<ProblemsProps> = ({
  week,
  solvedProblems,
  attemptedProblems,
}) => {
  const state: RootStateType = useSelector((state: RootStateType) => state);
  const [problemsByRating, setProblemsByRating] = useState<Problem[]>([]);

  useEffect(() => {
    // Fetch problems from GitHub URL
    axios
      .get('https://raw.githubusercontent.com/Audacity21/cftracker/main/weeklyquestions.json')
      .then((response) => {
        console.log('Fetched problems:', response.data);
        const allProblems: Problem[] = response.data;
        // Filter problems by week
        const filteredProblems = allProblems.filter((problem) => problem.week === week);
        setProblemsByRating(filteredProblems);
      })
      .catch((error) => {
        console.error('Error fetching problems:', error);
      });
  }, [week]); // Fetch problems when week changes

  const handleClick = (contestId: number, index: string) => {
    window.open(`https://codeforces.com/problemset/problem/${contestId}/${index}`, '_blank');
  };

  return (
    <div className='problem__container'>
      <table>
        <thead className='problem__tablehead'>
          <tr>
            <th>Index</th>
            <th>Problem</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Editorial</th>
          </tr>
        </thead>
        <tbody className='problem__tablebody'>
          {problemsByRating.map((problem: Problem, idx: number) => {
            const solvedAttempt = solvedProblems.find(
              (solvedProblem) =>
                solvedProblem.contestId === problem.contestId &&
                solvedProblem.index === problem.index
            );
            const attemptedProblem = attemptedProblems.find(
              (attemptedProblem) =>
                attemptedProblem.contestId === problem.contestId &&
                attemptedProblem.index === problem.index
            );

            let status = '';
            let rowStyle = { backgroundColor: 'transparent' };

            if (solvedAttempt) {
              status = 'AC';
              if (state.appState.themeMod === ThemesType.DARK) rowStyle.backgroundColor = '#2d6148';
              else rowStyle.backgroundColor = '#d4edc9';
            } else if (attemptedProblem) {
              status = 'WA'; // Assuming WA for attempted problems
              if (state.appState.themeMod === ThemesType.DARK) rowStyle.backgroundColor = '#52212b';
              else rowStyle.backgroundColor = '#ffe3e3';
            }

            return (
              <tr
                className='problem__tablerow'
                key={`${problem.contestId}-${problem.index}`}
                style={rowStyle}
                onClick={() => handleClick(problem.contestId, problem.index)}
              >
                <td>{idx + 1}</td>
                <td>{problem.name}</td>
                <td>{problem.rating}</td>
                <td>{status}</td>
                <td>{problem.editorial ? <Editorial link={problem.editorial} /> : 'NA'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Problems;