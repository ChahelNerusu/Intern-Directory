import React from 'react';

function InternshipItem({ title, company, location, category, url }) {
  return (
    <div className="internship-item">
      <h2>{title}</h2>
      <p>{company}</p>
      <p>{location}</p>
      <p>Category: {category}</p>
      <a href={url} target="_blank" rel="noopener noreferrer">Apply Now</a>
    </div>
  );
}

export default InternshipItem;
