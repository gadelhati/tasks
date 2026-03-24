import { useState } from 'react';
import './App.css';
import { Tasks } from './container/tasks';
import { TasksEisenhower } from './container/tasksEisenhower';
import { TasksKanban } from './container/tasksKanban';
import { TasksTimeline } from './container/tasksTimeline';
import { TasksBurndown } from './container/tasksBurndown';

type Tab = 'GANTT' | 'EISENHOWER' | 'KANBAN' | 'TIMELINE' | 'BURNDOWN';

function App() {

  const [activeTab, setActiveTab] = useState<Tab>('KANBAN');

  const renderContent = () => {
    switch (activeTab) {
      case 'GANTT':
        return <Tasks />;
      case 'EISENHOWER':
        return <TasksEisenhower />;
      case 'KANBAN':
        return <TasksKanban />;
      case 'TIMELINE':
        return <TasksTimeline />;
      case 'BURNDOWN':
        return <TasksBurndown />;
      default:
        return null;
    }
  };

  const TabButton = ({ tab, label }: { tab: Tab; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        padding: '10px 15px',
        border: 'none',
        cursor: 'pointer',
        background: activeTab === tab ? '#1976d2' : '#e0e0e0',
        color: activeTab === tab ? '#fff' : '#000',
        borderRadius: '4px 4px 0 0'
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 5,
        padding: 10,
        borderBottom: '1px solid #ccc'
      }}>
        <TabButton tab="GANTT" label="Gantt" />
        <TabButton tab="EISENHOWER" label="Eisenhower" />
        <TabButton tab="KANBAN" label="Kanban" />
        <TabButton tab="TIMELINE" label="Timeline" />
        <TabButton tab="BURNDOWN" label="Burndown" />
      </div>

      {/* Conteúdo */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;