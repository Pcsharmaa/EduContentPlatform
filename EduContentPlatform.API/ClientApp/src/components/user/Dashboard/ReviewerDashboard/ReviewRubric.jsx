import React from 'react';
import './reviewRubric.css';

const ReviewRubric = ({ rubric, scores, onScoreChange }) => {
  if (!rubric || !rubric.criteria) {
    return (
      <div className="review-rubric-empty">
        <p>No rubric available for this content.</p>
      </div>
    );
  }

  const handleScoreChange = (criterionId, score) => {
    onScoreChange(criterionId, score);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'score-excellent';
    if (score >= 6) return 'score-good';
    if (score >= 4) return 'score-fair';
    return 'score-poor';
  };

  const calculateCriterionScore = (criterion) => {
    const score = scores[criterion.id] || 0;
    const weightedScore = (score / 10) * criterion.weight;
    return {
      raw: score,
      weighted: weightedScore.toFixed(1),
      percentage: ((score / 10) * 100).toFixed(0)
    };
  };

  const calculateTotalScore = () => {
    const total = rubric.criteria.reduce((sum, criterion) => {
      const score = scores[criterion.id] || 0;
      return sum + ((score / 10) * criterion.weight);
    }, 0);
    return total.toFixed(1);
  };

  return (
    <div className="review-rubric">
      {/* Rubric Header */}
      <div className="rubric-header">
        <h3>{rubric.name || 'Review Rubric'}</h3>
        <p className="rubric-description">
          {rubric.description || 'Evaluate the content based on the following criteria'}
        </p>
      </div>

      {/* Rubric Body */}
      <div className="rubric-body">
        {rubric.criteria.map((criterion, index) => {
          const criterionScore = calculateCriterionScore(criterion);
          
          return (
            <div key={criterion.id || index} className="criterion-card">
              {/* Criterion Header */}
              <div className="criterion-header">
                <div className="criterion-title">
                  <h4>
                    {criterion.name}
                    <span className="criterion-weight">
                      ({criterion.weight}% of total score)
                    </span>
                  </h4>
                  <p className="criterion-description">{criterion.description}</p>
                </div>
                
                <div className="criterion-score">
                  <div className={`score-display ${getScoreColor(criterionScore.raw)}`}>
                    <span className="score-value">{criterionScore.raw || '—'}</span>
                    <span className="score-out-of">/10</span>
                  </div>
                  <div className="weighted-score">
                    {criterionScore.weighted} points
                  </div>
                </div>
              </div>

              {/* Scoring Scale */}
              <div className="scoring-scale">
                <div className="scale-labels">
                  <span className="scale-label">Poor (1-3)</span>
                  <span className="scale-label">Fair (4-6)</span>
                  <span className="scale-label">Good (7-8)</span>
                  <span className="scale-label">Excellent (9-10)</span>
                </div>

                <div className="scale-options">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <div key={score} className="scale-option">
                      <input
                        type="radio"
                        id={`criterion-${criterion.id}-${score}`}
                        name={`criterion-${criterion.id}`}
                        value={score}
                        checked={scores[criterion.id] === score}
                        onChange={() => handleScoreChange(criterion.id, score)}
                      />
                      <label 
                        htmlFor={`criterion-${criterion.id}-${score}`}
                        className={`score-label ${scores[criterion.id] === score ? 'selected' : ''} ${getScoreColor(score)}`}
                      >
                        {score}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="scale-indicators">
                  <span>1 - Very Poor</span>
                  <span>5 - Average</span>
                  <span>10 - Outstanding</span>
                </div>
              </div>

              {/* Scoring Guidelines */}
              {criterion.guidelines && criterion.guidelines.length > 0 && (
                <div className="scoring-guidelines">
                  <h5>Scoring Guidelines:</h5>
                  <ul>
                    {criterion.guidelines.map((guideline, idx) => (
                      <li key={idx}>{guideline}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Comments Field */}
              <div className="criterion-comments">
                <label htmlFor={`comments-${criterion.id}`}>
                  Comments for {criterion.name} (optional):
                </label>
                <textarea
                  id={`comments-${criterion.id}`}
                  placeholder={`Provide specific feedback about ${criterion.name.toLowerCase()}...`}
                  rows={2}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Rubric Summary */}
      <div className="rubric-summary">
        <div className="summary-header">
          <h4>Overall Assessment</h4>
          <div className="total-score">
            Total Score: <span className="score-total">{calculateTotalScore()}</span>/100
          </div>
        </div>

        <div className="score-breakdown">
          <table className="breakdown-table">
            <thead>
              <tr>
                <th>Criterion</th>
                <th>Weight</th>
                <th>Score</th>
                <th>Weighted Score</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {rubric.criteria.map((criterion, index) => {
                const score = calculateCriterionScore(criterion);
                return (
                  <tr key={criterion.id || index}>
                    <td>{criterion.name}</td>
                    <td>{criterion.weight}%</td>
                    <td>
                      <span className={`score-badge ${getScoreColor(score.raw)}`}>
                        {score.raw || 'N/A'}
                      </span>
                    </td>
                    <td>{score.weighted}</td>
                    <td>
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill"
                          style={{ width: `${score.percentage}%` }}
                        ></div>
                        <span className="percentage-text">{score.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"><strong>Total</strong></td>
                <td><strong>{calculateTotalScore()}</strong></td>
                <td>
                  <div className="percentage-bar total">
                    <div 
                      className="percentage-fill"
                      style={{ width: `${calculateTotalScore()}%` }}
                    ></div>
                    <span className="percentage-text">{calculateTotalScore()}%</span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Performance Levels */}
        <div className="performance-levels">
          <h5>Performance Levels:</h5>
          <div className="levels-grid">
            <div className="level poor">
              <div className="level-header">
                <span className="level-range">0 - 40</span>
                <span className="level-label">Needs Major Revision</span>
              </div>
              <p>Content requires significant improvements</p>
            </div>
            <div className="level fair">
              <div className="level-header">
                <span className="level-range">41 - 60</span>
                <span className="level-label">Needs Revision</span>
              </div>
              <p>Content requires moderate improvements</p>
            </div>
            <div className="level good">
              <div className="level-header">
                <span className="level-range">61 - 80</span>
                <span className="level-label">Minor Revision</span>
              </div>
              <p>Content requires minor improvements</p>
            </div>
            <div className="level excellent">
              <div className="level-header">
                <span className="level-range">81 - 100</span>
                <span className="level-label">Acceptable</span>
              </div>
              <p>Content meets or exceeds expectations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewRubric;