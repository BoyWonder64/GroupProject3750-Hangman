import React, { useState, useEffect } from 'react'

const Scores = () => {
  const [scores, setScores] = useState([])
  const wordLength = sessionStorage.getItem('wordLength')

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/scores?length=${wordLength}`,
          {
            method: 'GET',
            credentials: 'include'
          }
        )
        const data = await response.json()
        setScores(data)
      } catch (err) {
        console.error('Error fetching scores:', err)
      }
    }

    fetchScores()
  }, [wordLength])

  return (
    <div>
      <h1>High Scores</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Guesses</th>
            <th>Word Length</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <td>{score.name}</td>
              <td>{score.guesses}</td>
              <td>{score.wordLength}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Scores
