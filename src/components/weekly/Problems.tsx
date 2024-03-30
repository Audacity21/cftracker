import React, { useEffect, useState } from 'react';
import { RootStateType} from '../../data/store';
import { useSelector } from 'react-redux';
import './Problems.css';
import problems from '../../data/jsons/weeklyproblems';

interface ProblemsProps {
  week: number;
  isValidUser: boolean;
  handle: string;
  solvedProblems: any[]; // Define type according to your actual data structure
};

const Problems: React.FC<ProblemsProps> = ({ week, isValidUser, handle, solvedProblems }) => {
  const state: RootStateType = useSelector((state: RootStateType) => state);
  let index = 1;

  const problemsByRating: any[] = problems.filter((problem: any) => problem.week === week) || [];

  const handleClick = (contestId: number, index: string) => {
    window.open(
      `https://codeforces.com/problemset/problem/${contestId}/${index}`,
      '_blank'
    );
  };

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
            const userAttempt =
              solvedProblems &&
              solvedProblems.find(
                (solvedProblem: any) =>
                  solvedProblem.problem.contestId === problem.contestId &&
                  solvedProblem.problem.index === problem.index
              );
            const status =
              userAttempt && userAttempt.verdict === 'OK'
                ? 'AC'
                : userAttempt
                ? 'WA'
                : '';
            const rowStyle = {
              backgroundColor:
                status === 'AC'
                  ? '#49E75E'
                  : status === 'WA'
                  ? 'red'
                  : 'transparent',
            };
            return (
              <tr
                className='problem__tablerow'
                key={`${problem.id}-${idx}`}
                style={rowStyle}
                onClick={() => handleClick(problem.contestId, problem.index)}>
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
