import { useState } from 'react';
import './App.css';
import { TasksGantt } from './container/tasksGantt';
import { TasksEisenhower } from './container/tasksEisenhower';
import { TasksKanban } from './container/tasksKanban';
import { TasksTimeline } from './container/tasksTimeline';
import { TasksBurndown } from './container/tasksBurndown';
import { TasksCumulativeFlow } from './container/tasksCumulativeFlow';
import { TasksCycleTime } from './container/tasksCycleTime';
import { TasksGUT } from './container/tasksGUT';
import { TasksBurnup } from './container/tasksBurnup';
import { TasksDependencies } from './container/tasksDependencies';

type Tab = 'GUT' | 'DEPENDENCES' | 'GANTT' | 'EISENHOWER' | 'KANBAN' | 'TIMELINE' | 'BURNDOWN' | 'BURNUP' | 'CFD' | 'CYCLE_TIME';

function App() {

  const [activeTab, setActiveTab] = useState<Tab>('KANBAN');

  const renderContent = () => {
    switch (activeTab) {
      case 'GUT':
        return <TasksGUT />;
      case 'DEPENDENCES':
        return <TasksDependencies />;
      case 'GANTT':
        return <TasksGantt />;
      case 'EISENHOWER':
        return <TasksEisenhower />;
      case 'KANBAN':
        return <TasksKanban />;
      case 'TIMELINE':
        return <TasksTimeline />;
      case 'BURNDOWN':
        return <TasksBurndown />;
      case 'BURNUP':
        return <TasksBurnup />;
      case 'CFD':
        return <TasksCumulativeFlow />
      case 'CYCLE_TIME':
        return <TasksCycleTime />
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
        background: activeTab === tab ? '#4caf50' : '#e0e0e0',
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
        <TabButton tab="GUT" label="GUT" />
        <TabButton tab="DEPENDENCES" label="Dependences" />
        <TabButton tab="GANTT" label="Gantt" />
        <TabButton tab="EISENHOWER" label="Eisenhower" />
        <TabButton tab="KANBAN" label="Kanban" />
        <TabButton tab="TIMELINE" label="Timeline" />
        <TabButton tab="BURNDOWN" label="Burndown" />
        <TabButton tab="BURNUP" label="Burnup" />
        <TabButton tab="CFD" label="CFD" />
        <TabButton tab="CYCLE_TIME" label="Cycle Time" />
      </div>

      {/* Conteúdo */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;