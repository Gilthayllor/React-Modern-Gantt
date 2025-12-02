import * as React from 'react';
import { useState } from 'react';
import DemoCustomized from './DemoCustomized';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('basic');

  return <DemoCustomized darkMode={darkMode} />;
};

export default App;
