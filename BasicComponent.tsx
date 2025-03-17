import React from 'react';

interface BasicComponentProps {
  title: string;
  description?: string;
}
// first component
// see
const BasicComponent: React.FC<BasicComponentProps> = ({ title, description }) => {
  return (
    <div className="basic-component">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
};

export default BasicComponent; 