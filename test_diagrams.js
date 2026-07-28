const formats = [
  'Use Case Diagram',
  'Class Diagram',
  'Activity Diagram',
  'Sequence Diagram',
  'ER Diagram',
  'State Machine Diagram',
  'Data Flow Diagram',
  'System Architecture'
];

async function testAll() {
  for (const format of formats) {
    try {
      const res = await fetch('http://localhost:3000/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'Library Management System', format: 'uml', diagramType: format })
      });
      const data = await res.json();
      console.log(`\n\n========== ${format} ==========`);
      console.log(data.result || data.error);
    } catch (e) {
      console.error(`\n\n========== ${format} FAILED ==========`, e);
    }
  }
}

testAll();
