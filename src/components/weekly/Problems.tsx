import React, { useEffect, useState } from 'react';
import { RootStateType } from '../../data/store';
import { useSelector } from 'react-redux';
import './Problems.css';
import problems from '../../data/jsons/weeklyproblems';

interface ProblemsProps {
  week: number;
  isValidUser: boolean;
  handle: string;
  solvedProblems: any[]; // Define type according to your actual data structure
  attemptedProblems: any[]; // Define type according to your actual data structure
}

const Problems: React.FC<ProblemsProps> = ({
  week,
  isValidUser,
  handle,
  solvedProblems,
  attemptedProblems,
}) => {
  const state: RootStateType = useSelector((state: RootStateType) => state);
  let index = 1;

  const problemsByRating: any[] = problems.filter(
    (problem: any) => problem.week === week
  ) || [];

  const handleClick = (contestId: number, index: string) => {
    window.open(
      `https://codeforces.com/problemset/problem/${contestId}/${index}`,
      '_blank'
    );
  };

  useEffect(() => {
    console.log(solvedProblems[0]);
  }, [solvedProblems]);

  return (
    <div className='problem__container'>
      <table>
        <thead className='problem__tablehead'>
          <tr>
            <th>Index</th>
            <th>Problem</th>
            <th>Points</th>
            <th>Rating</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className='problem__tablebody'>
          {problemsByRating.map((problem: any, idx: number) => {
            const solvedAttempt = solvedProblems.find(
              (solvedProblem: any) =>
                solvedProblem.contestId === problem.contestId &&
                solvedProblem.index === problem.index
            );
            const attemptedProblem = attemptedProblems.find(
              (attemptedProblem: any) =>
                attemptedProblem.contestId === problem.contestId &&
                attemptedProblem.index === problem.index
            );

            let status = '';
            let rowStyle = { backgroundColor: 'transparent' };

            if (solvedAttempt) {
              status = 'AC';
              rowStyle.backgroundColor = '#d4edc9'; // Green for solved
            } else if (attemptedProblem) {
              status = 'WA'; // Assuming WA for attempted problems
              rowStyle.backgroundColor = '#ffe3e3'; // Red for attempted
            }

            return (
              <tr
                className='problem__tablerow'
                key={`${problem.id}-${idx}`}
                style={rowStyle}
                onClick={() => handleClick(problem.contestId, problem.index)}
              >
                <td>{index++}</td>
                <td>{problem.name}</td>
                <td>{problem.points ? problem.points : '-'}</td>
                <td>{problem.rating}</td>
                <td>{status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Problems;
