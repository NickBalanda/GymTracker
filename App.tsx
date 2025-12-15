import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Dumbbell, 
  Plus, 
  Trash2, 
  LineChart, 
  ArrowLeft, 
  Save, 
  Play, 
  Sparkles, 
  Youtube,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { RetroButton, RetroInput, RetroCard, RetroHeader } from './components/RetroComponents';
import { WeightChart } from './components/WeightChart';
import { generateWorkoutPlan } from './services/geminiService';
import { AppView, WorkoutPlan, Exercise, WeightEntry, MeasurementUnit } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [weightLog, setWeightLog] = useState<WeightEntry[]>([]);
  
  // Create/Edit State
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  
  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState({ focus: '', level: 'Intermediate' });

  // Weight Input State
  const [weightInput, setWeightInput] = useState('');

  // Load Data
  useEffect(() => {
    const savedPlans = localStorage.getItem('neon_plans');
    const savedLog = localStorage.getItem('neon_weight_log');
    if (savedPlans) setPlans(JSON.parse(savedPlans));
    if (savedLog) setWeightLog(JSON.parse(savedLog));
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem('neon_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('neon_weight_log', JSON.stringify(weightLog));
  }, [weightLog]);

  // Handlers
  const handleCreatePlan = () => {
    const newPlan: WorkoutPlan = {
      id: uuidv4(),
      name: 'New Workout Plan',
      description: 'Describe your routine...',
      exercises: [],
      createdAt: Date.now()
    };
    setEditingPlan(newPlan);
    setCurrentView(AppView.EDIT_PLAN);
  };

  const handleEditPlan = (plan: WorkoutPlan) => {
    setEditingPlan(JSON.parse(JSON.stringify(plan))); // Deep copy
    setCurrentView(AppView.EDIT_PLAN);
  };

  const handleDeletePlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this radical plan?')) {
      setPlans(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;
    setPlans(prev => {
      const exists = prev.find(p => p.id === editingPlan.id);
      if (exists) {
        return prev.map(p => p.id === editingPlan.id ? editingPlan : p);
      }
      return [...prev, editingPlan];
    });
    setCurrentView(AppView.DASHBOARD);
    setEditingPlan(null);
  };

  const addExercise = () => {
    if (!editingPlan) return;
    const newExercise: Exercise = {
      id: uuidv4(),
      name: 'New Exercise',
      sets: 3,
      reps: 10,
      weight: 0,
      unit: MeasurementUnit.KG
    };
    setEditingPlan({
      ...editingPlan,
      exercises: [...editingPlan.exercises, newExercise]
    });
  };

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    if (!editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      exercises: editingPlan.exercises.map(ex => 
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    });
  };

  const removeExercise = (id: string) => {
    if (!editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      exercises: editingPlan.exercises.filter(ex => ex.id !== id)
    });
  };

  const handleAIGeneration = async () => {
    if (!aiPrompt.focus) return;
    setIsGenerating(true);
    const generatedPlan = await generateWorkoutPlan(aiPrompt.focus, aiPrompt.level);
    if (generatedPlan) {
      setPlans(prev => [...prev, generatedPlan]);
      setCurrentView(AppView.DASHBOARD);
    } else {
      alert("Failed to contact the cyber-mainframe. Try again.");
    }
    setIsGenerating(false);
  };

  const handleLogWeight = () => {
    const w = parseFloat(weightInput);
    if (isNaN(w) || w <= 0) return;
    
    setWeightLog(prev => [
      ...prev,
      { id: uuidv4(), date: Date.now(), weight: w, unit: MeasurementUnit.KG }
    ]);
    setWeightInput('');
  };

  // --- VIEWS ---

  const renderDashboard = () => (
    <div className="max-w-4xl mx-auto p-4 space-y-8 pb-20">
      <RetroHeader title="NeonPump 85" subtitle="Forge Your Legacy" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RetroButton 
          variant="primary" 
          icon={Plus} 
          onClick={handleCreatePlan}
          className="h-32 text-2xl"
        >
          Create Plan
        </RetroButton>
        <RetroButton 
          variant="secondary" 
          icon={Sparkles} 
          onClick={() => setCurrentView(AppView.CREATE_PLAN)}
          className="h-32 text-2xl"
        >
          AI Generate
        </RetroButton>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-[#ff00ff]/30 pb-2">
          <h2 className="text-2xl font-['VT323'] text-[#ff00ff]">YOUR DISKETTES (PLANS)</h2>
        </div>
        
        {plans.length === 0 ? (
          <p className="text-gray-500 font-['Share_Tech_Mono'] text-center py-8">No plans found. Insert coin to start.</p>
        ) : (
          <div className="grid gap-4">
            {plans.map(plan => (
              <RetroCard key={plan.id} className="cursor-pointer group hover:bg-[#1a1a2e]" >
                <div onClick={() => { setActivePlanId(plan.id); setCurrentView(AppView.VIEW_PLAN); }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl text-[#00ffff] font-['VT323'] mb-1 group-hover:text-white transition-colors">
                        {plan.name}
                      </h3>
                      <p className="text-gray-400 text-sm font-['Share_Tech_Mono']">
                        {plan.exercises.length} Exercises
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEditPlan(plan); }}
                        className="text-gray-500 hover:text-[#00ffff] transition-colors p-2"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={(e) => handleDeletePlan(plan.id, e)}
                        className="text-gray-500 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </RetroCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="max-w-2xl mx-auto p-4 pt-12">
       <RetroHeader title="Cyber Coach" subtitle="AI Powered Routines" />
       
       <RetroCard className="space-y-6">
         <div>
            <label className="block text-[#ff00ff] font-['VT323'] text-xl mb-2">Target Muscle / Goal</label>
            <RetroInput 
              placeholder="e.g. Chest & Triceps, Leg Day Destruction"
              value={aiPrompt.focus}
              onChange={(e) => setAiPrompt({...aiPrompt, focus: e.target.value})}
            />
         </div>
         
         <div>
            <label className="block text-[#ff00ff] font-['VT323'] text-xl mb-2">Intensity Level</label>
            <div className="flex gap-4">
              {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                <button
                  key={l}
                  onClick={() => setAiPrompt({...aiPrompt, level: l})}
                  className={`flex-1 py-2 border-2 font-['VT323'] uppercase text-lg transition-all ${
                    aiPrompt.level === l 
                    ? 'border-[#00ffff] bg-[#00ffff]/20 text-white' 
                    : 'border-gray-700 text-gray-500 hover:border-gray-500'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
         </div>

         <div className="flex gap-4 pt-4">
           <RetroButton variant="ghost" onClick={() => setCurrentView(AppView.DASHBOARD)}>Cancel</RetroButton>
           <RetroButton 
            variant="primary" 
            className="flex-1" 
            onClick={handleAIGeneration}
            disabled={isGenerating || !aiPrompt.focus}
          >
             {isGenerating ? 'Computing...' : 'Generate Plan'}
           </RetroButton>
         </div>
       </RetroCard>
    </div>
  );

  const renderEditor = () => {
    if (!editingPlan) return null;

    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="text-[#ff00ff] hover:text-white">
            <ArrowLeft />
          </button>
          <h2 className="text-2xl font-['VT323'] text-white">Plan Editor</h2>
        </div>

        <div className="space-y-4">
          <RetroInput 
            value={editingPlan.name}
            onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
            placeholder="Plan Name"
            className="text-2xl font-bold text-center border-t-0 border-x-0 border-b-2 bg-transparent"
          />
          <textarea 
            className="w-full bg-transparent border border-[#ff00ff]/30 text-gray-300 p-3 font-['Share_Tech_Mono'] outline-none focus:border-[#00ffff]"
            value={editingPlan.description}
            onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
            placeholder="Description..."
            rows={2}
          />
        </div>

        <div className="space-y-4">
          {editingPlan.exercises.map((ex, idx) => (
            <RetroCard key={ex.id} className="relative">
              <button 
                onClick={() => removeExercise(ex.id)}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-xs text-[#00ffff] uppercase">Exercise</label>
                      <RetroInput 
                        value={ex.name} 
                        onChange={(e) => updateExercise(ex.id, 'name', e.target.value)} 
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs text-[#00ffff] uppercase">Image/Video URL</label>
                      <RetroInput 
                        value={ex.tutorialUrl || ''} 
                        onChange={(e) => updateExercise(ex.id, 'tutorialUrl', e.target.value)} 
                        placeholder="https://..."
                        className="text-sm"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Sets</label>
                    <RetroInput 
                      type="number" 
                      value={ex.sets} 
                      onChange={(e) => updateExercise(ex.id, 'sets', parseInt(e.target.value))} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Reps</label>
                    <RetroInput 
                      type="number" 
                      value={ex.reps} 
                      onChange={(e) => updateExercise(ex.id, 'reps', parseInt(e.target.value))} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Kg/Lbs</label>
                    <RetroInput 
                      type="number" 
                      value={ex.weight} 
                      onChange={(e) => updateExercise(ex.id, 'weight', parseFloat(e.target.value))} 
                    />
                  </div>
                </div>
              </div>
            </RetroCard>
          ))}
        </div>

        <div className="flex gap-4 sticky bottom-4 bg-[#0f0f1a]/90 p-4 backdrop-blur border-t border-[#ff00ff]/30 z-40">
           <RetroButton variant="secondary" onClick={addExercise} className="flex-1 text-base">
             <Plus size={16} /> Add Exercise
           </RetroButton>
           <RetroButton variant="primary" onClick={handleSavePlan} className="flex-1 text-base">
             <Save size={16} /> Save Plan
           </RetroButton>
        </div>
      </div>
    );
  };

  const renderViewPlan = () => {
    const plan = plans.find(p => p.id === activePlanId);
    if (!plan) return <div onClick={() => setCurrentView(AppView.DASHBOARD)}>Plan not found</div>;

    return (
      <div className="max-w-3xl mx-auto p-4 pb-20">
        <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="mb-4 text-[#ff00ff] hover:text-white flex items-center gap-2">
            <ArrowLeft size={20} /> Back
        </button>

        <RetroHeader title={plan.name} subtitle={plan.description} />

        <div className="space-y-6">
          {plan.exercises.map((ex, i) => (
            <RetroCard key={ex.id} className="flex flex-col md:flex-row gap-6">
              {ex.tutorialUrl && (
                <div className="w-full md:w-32 h-32 flex-shrink-0 bg-black/50 border border-[#00ffff]/30 overflow-hidden flex items-center justify-center relative group">
                  <img src={ex.tutorialUrl} alt={ex.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise tutorial')}`} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Youtube className="text-red-500" size={32} />
                  </a>
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-['VT323'] text-[#00ffff]">{i + 1}. {ex.name}</h3>
                  {ex.tutorialUrl && <a href={ex.tutorialUrl} target="_blank" rel="noreferrer" className="md:hidden text-gray-500"><ExternalLink size={16}/></a>}
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-[#0f0f1a] p-2 border border-gray-800 text-center">
                    <span className="block text-xs text-gray-500 uppercase">Sets</span>
                    <span className="text-lg font-bold text-white font-['Share_Tech_Mono']">{ex.sets}</span>
                  </div>
                  <div className="bg-[#0f0f1a] p-2 border border-gray-800 text-center">
                    <span className="block text-xs text-gray-500 uppercase">Reps</span>
                    <span className="text-lg font-bold text-white font-['Share_Tech_Mono']">{ex.reps}</span>
                  </div>
                  <div className="bg-[#0f0f1a] p-2 border border-gray-800 text-center">
                    <span className="block text-xs text-gray-500 uppercase">Weight</span>
                    <span className="text-lg font-bold text-white font-['Share_Tech_Mono']">{ex.weight} <span className="text-xs">{ex.unit}</span></span>
                  </div>
                </div>

                {ex.notes && (
                  <p className="text-sm text-gray-400 italic font-['Share_Tech_Mono'] border-l-2 border-[#ff00ff] pl-3">
                    {ex.notes}
                  </p>
                )}
              </div>
            </RetroCard>
          ))}
        </div>
      </div>
    );
  };

  const renderWeightTracker = () => (
    <div className="max-w-4xl mx-auto p-4 pb-20 space-y-8">
      <RetroHeader title="Body Stats" subtitle="Tracking Hardware" />
      
      <RetroCard>
        <div className="h-64 md:h-80 mb-6">
          <WeightChart data={weightLog} />
        </div>
        
        <div className="flex gap-4 items-end border-t border-gray-800 pt-6">
          <div className="flex-1">
            <label className="block text-[#00ffff] font-['VT323'] text-lg mb-2">Current Weight (kg)</label>
            <RetroInput 
              type="number" 
              placeholder="0.0" 
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
            />
          </div>
          <RetroButton onClick={handleLogWeight} variant="primary" className="mb-[2px]">
            LOG
          </RetroButton>
        </div>
      </RetroCard>

      <div className="space-y-2">
        <h3 className="text-[#ff00ff] font-['VT323'] text-xl">History Log</h3>
        {[...weightLog].sort((a,b) => b.date - a.date).map(entry => (
          <div key={entry.id} className="flex justify-between items-center bg-[#1a1a2e] p-3 border-l-2 border-[#00ffff]">
             <span className="font-['Share_Tech_Mono'] text-gray-300">
               {new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
             </span>
             <span className="font-['VT323'] text-xl text-[#00ffff]">{entry.weight} kg</span>
          </div>
        ))}
      </div>
    </div>
  );

  // --- MAIN RENDER ---

  return (
    <div className="min-h-screen text-gray-200 selection:bg-[#ff00ff] selection:text-white">
      {/* View Router */}
      <main className="pt-4">
        {currentView === AppView.DASHBOARD && renderDashboard()}
        {currentView === AppView.CREATE_PLAN && renderAI()}
        {currentView === AppView.EDIT_PLAN && renderEditor()}
        {currentView === AppView.VIEW_PLAN && renderViewPlan()}
        {currentView === AppView.WEIGHT_TRACKER && renderWeightTracker()}
      </main>

      {/* Sticky Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0f0f1a] border-t-2 border-[#ff00ff] p-2 flex justify-around items-center z-50 shadow-[0_-5px_20px_rgba(255,0,255,0.2)]">
        <button 
          onClick={() => setCurrentView(AppView.DASHBOARD)}
          className={`flex flex-col items-center p-2 ${currentView === AppView.DASHBOARD ? 'text-[#00ffff] text-glow-cyan' : 'text-gray-500'}`}
        >
          <Dumbbell />
          <span className="text-[10px] font-['VT323'] uppercase mt-1">Workout</span>
        </button>
        
        <button 
          onClick={() => setCurrentView(AppView.WEIGHT_TRACKER)}
          className={`flex flex-col items-center p-2 ${currentView === AppView.WEIGHT_TRACKER ? 'text-[#ff00ff] text-glow-pink' : 'text-gray-500'}`}
        >
          <LineChart />
          <span className="text-[10px] font-['VT323'] uppercase mt-1">Stats</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
