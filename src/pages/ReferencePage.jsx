import React, { useState, useEffect } from 'react';

const ReferencePage = () => {
  const [references, setReferences] = useState('');

  useEffect(() => {
    fetch('/All reference link.txt')
      .then(response => response.text())
      .then(text => setReferences(text));
  }, []);

  return (
    <div>
      <h1>Reference Links</h1>
      <pre>{references}</pre>
    </div>
  );
};

export default ReferencePage;
