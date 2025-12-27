
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { 
  Step, 
  PetData, 
  ClothingConfig, 
  CustomizationState, 
  FABRICS, 
  STYLES 
} from './types';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Loader2, 
  Upload, 
  Scissors, 
  Palette, 
  CreditCard,
  Ruler,
  Camera,
  Maximize2,
  Droplet,
  Users,
  Shirt,
  Sparkles,
  Pipette
} from 'lucide-react';
import { generatePetPreview, ViewType } from './services/geminiService';

const INITIAL_PET_DATA: PetData = {
  breed: 'French Bulldog',
  weight: '12',
  chestSize: '50',
  neckSize: '35',
  length: '40'
};

const INITIAL_CLOTHING_CONFIG: ClothingConfig = {
  style: 'hoodie',
  fabric: 'Premium Cotton',
  color: 'Match Reference'
};

const PRESET_COLORS = [
  { name: 'Midnight Blue', hex: '#1e3a8a' },
  { name: 'Dusty Rose', hex: '#fda4af' },
  { name: 'Forest Green', hex: '#064e3b' },
  { name: 'Slate Gray', hex: '#334155' },
  { name: 'Soft Cream', hex: '#fef3c7' },
  { name: 'Mustard Yellow', hex: '#eab308' },
  { name: 'Terracotta', hex: '#9a3412' },
];

const App: React.FC = () => {
  const [state, setState] = useState<CustomizationState>({
    step: Step.PET_INFO,
    petData: INITIAL_PET_DATA,
    clothingConfig: INITIAL_CLOTHING_CONFIG,
    showcase: {},
    isGenerating: false
  });

  const nextStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
  const prevStep = () => setState(prev => ({ ...prev, step: prev.step - 1 }));

  const updatePetData = (field: keyof PetData, value: string) => {
    setState(prev => ({
      ...prev,
      petData: { ...prev.petData, [field]: value }
    }));
  };

  const updateClothing = (field: keyof ClothingConfig, value: string) => {
    setState(prev => ({
      ...prev,
      clothingConfig: { ...prev.clothingConfig, [field]: value }
    }));
  };

  const handlePatternUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, patternBase64: reader.result as string, humanClothingBase64: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHumanMatchingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, humanClothingBase64: reader.result as string, patternBase64: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setState(prev => ({ ...prev, isGenerating: true, error: undefined }));
    try {
      const views: ViewType[] = ['main', 'side', 'back', 'detail'];
      const results = await Promise.all(
        views.map(view => generatePetPreview(
          state.petData, 
          state.clothingConfig, 
          state.patternBase64, 
          state.humanClothingBase64,
          view
        ))
      );
      
      setState(prev => ({ 
        ...prev, 
        showcase: {
          main: results[0],
          side: results[1],
          back: results[2],
          detail: results[3]
        },
        step: Step.MAIN_PREVIEW 
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message }));
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const renderStepper = () => (
    <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-8 overflow-x-auto py-2 px-4 no-scrollbar">
      {[1, 2, 3, 4, 5, 6].map((s) => (
        <React.Fragment key={s}>
          <div className={`flex flex-shrink-0 items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${
            state.step === s ? 'bg-brandPurple text-white shadow-lg shadow-brandPurple/20 scale-110' : 
            state.step > s ? 'bg-mistBlue text-brandPurple' : 'bg-white text-silverGray border border-silverGray/30'
          }`}>
            {state.step > s ? <CheckCircle className="w-5 h-5" /> : s}
          </div>
          {s < 6 && <div className={`h-0.5 w-6 md:w-10 flex-shrink-0 transition-colors duration-300 ${state.step > s ? 'bg-brandPurple' : 'bg-silverGray/20'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Tailored <span className="text-brandPurple">With Love</span></h1>
          <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">AI-powered 3D custom fitting and visualization for your beloved companion.</p>
        </div>

        {renderStepper()}

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 p-6 md:p-10 border border-silverGray/20 relative overflow-hidden">
          {/* Decorative pink accent */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-pawPink opacity-10 rounded-full blur-3xl"></div>
          
          {state.step === Step.PET_INFO && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center space-x-3 text-brandPurple">
                <Ruler className="w-6 h-6" />
                <h2 className="text-xl font-bold tracking-tight">1. Pet Measurements</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Breed</label>
                  <input 
                    type="text" 
                    value={state.petData.breed}
                    onChange={(e) => updatePetData('breed', e.target.value)}
                    className="mt-1 block w-full bg-apricot/30 border-silverGray/30 rounded-xl shadow-sm focus:ring-brandPurple focus:border-brandPurple transition-all sm:text-sm p-4 border"
                    placeholder="e.g. French Bulldog"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={state.petData.weight}
                    onChange={(e) => updatePetData('weight', e.target.value)}
                    className="mt-1 block w-full bg-apricot/30 border-silverGray/30 rounded-xl shadow-sm focus:ring-brandPurple focus:border-brandPurple transition-all sm:text-sm p-4 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Neck Girth (cm)</label>
                  <input 
                    type="number" 
                    value={state.petData.neckSize}
                    onChange={(e) => updatePetData('neckSize', e.target.value)}
                    className="mt-1 block w-full bg-apricot/30 border-silverGray/30 rounded-xl shadow-sm focus:ring-brandPurple focus:border-brandPurple transition-all sm:text-sm p-4 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Chest Girth (cm)</label>
                  <input 
                    type="number" 
                    value={state.petData.chestSize}
                    onChange={(e) => updatePetData('chestSize', e.target.value)}
                    className="mt-1 block w-full bg-apricot/30 border-silverGray/30 rounded-xl shadow-sm focus:ring-brandPurple focus:border-brandPurple transition-all sm:text-sm p-4 border"
                  />
                </div>
              </div>
              <div className="pt-6">
                <button 
                  onClick={nextStep}
                  className="w-full flex justify-center items-center py-4 px-6 rounded-xl shadow-lg shadow-brandPurple/20 text-sm font-bold text-white bg-brandPurple hover:bg-opacity-90 transition-all group"
                >
                  Continue to Style
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {state.step === Step.STYLE_FABRIC && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center space-x-3 text-brandPurple">
                <Scissors className="w-6 h-6" />
                <h2 className="text-xl font-bold tracking-tight">2. Style & Fabric</h2>
              </div>
              
              <div>
                <h3 className="text-xs font-bold text-silverGray mb-4 uppercase tracking-[0.2em]">Choose Silhouette</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => updateClothing('style', style.name)}
                      className={`p-5 rounded-2xl border-2 transition-all text-left ${
                        state.clothingConfig.style === style.name 
                        ? 'border-brandPurple bg-mistBlue/40 shadow-md' 
                        : 'border-apricot bg-white hover:border-mistBlue'
                      }`}
                    >
                      <div className={`text-sm font-bold ${state.clothingConfig.style === style.name ? 'text-brandPurple' : 'text-gray-900'}`}>{style.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-silverGray mb-4 uppercase tracking-[0.2em]">Choose Material</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FABRICS.map(fabric => (
                    <button
                      key={fabric.id}
                      onClick={() => updateClothing('fabric', fabric.name)}
                      className={`flex items-center p-5 rounded-2xl border-2 transition-all text-left ${
                        state.clothingConfig.fabric === fabric.name 
                        ? 'border-brandPurple bg-mistBlue/40' 
                        : 'border-apricot bg-white hover:border-mistBlue'
                      }`}
                    >
                      <span className="text-3xl mr-5 p-3 bg-white rounded-xl shadow-sm">{fabric.icon}</span>
                      <div>
                        <div className={`text-sm font-bold ${state.clothingConfig.fabric === fabric.name ? 'text-brandPurple' : 'text-gray-900'}`}>{fabric.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{fabric.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button 
                  onClick={prevStep}
                  className="flex-1 flex justify-center items-center py-4 px-6 border border-silverGray/30 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-apricot transition-colors"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </button>
                <button 
                  onClick={nextStep}
                  className="flex-[2] flex justify-center items-center py-4 px-6 rounded-xl shadow-lg shadow-brandPurple/20 text-sm font-bold text-white bg-brandPurple hover:bg-opacity-90 transition-all"
                >
                  Apply Design <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {state.step === Step.PATTERN_UPLOAD && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-center space-x-3 text-brandPurple">
                <Palette className="w-6 h-6" />
                <h2 className="text-xl font-bold text-center tracking-tight">3. Color & Design</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Droplet className="w-5 h-5 text-brandPurple" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Custom Color Palette</h3>
                </div>
                <div className="flex flex-wrap gap-5 items-center justify-center md:justify-start">
                  <button
                    onClick={() => updateClothing('color', 'Match Reference')}
                    className="group relative flex flex-col items-center space-y-2 focus:outline-none"
                  >
                    <div 
                      className={`w-14 h-14 rounded-full border-2 transition-all transform hover:scale-110 flex items-center justify-center bg-gradient-to-tr from-brandPurple via-mistBlue to-pawPink ${
                        state.clothingConfig.color === 'Match Reference' 
                        ? 'border-brandPurple ring-4 ring-brandPurple/10 shadow-lg' 
                        : 'border-white shadow-sm'
                      }`}
                    >
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-[10px] font-bold text-center leading-tight ${state.clothingConfig.color === 'Match Reference' ? 'text-brandPurple' : 'text-gray-400'}`}>
                      Original<br/>Colors
                    </span>
                    {state.clothingConfig.color === 'Match Reference' && (
                      <CheckCircle className="absolute -top-1 -right-1 w-6 h-6 text-brandPurple bg-white rounded-full p-0.5" />
                    )}
                  </button>

                  {PRESET_COLORS.map(color => (
                    <button
                      key={color.name}
                      onClick={() => updateClothing('color', color.name)}
                      className="group relative flex flex-col items-center space-y-2 focus:outline-none"
                    >
                      <div 
                        className={`w-14 h-14 rounded-full border-2 transition-all transform hover:scale-110 ${
                          state.clothingConfig.color === color.name 
                          ? 'border-brandPurple ring-4 ring-brandPurple/10 shadow-lg' 
                          : 'border-white shadow-sm'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className={`text-[10px] font-bold text-center leading-tight ${state.clothingConfig.color === color.name ? 'text-brandPurple' : 'text-gray-400'}`}>
                        {color.name}
                      </span>
                      {state.clothingConfig.color === color.name && (
                        <CheckCircle className="absolute -top-1 -right-1 w-6 h-6 text-brandPurple bg-white rounded-full p-0.5" />
                      )}
                    </button>
                  ))}

                  <div className="group relative flex flex-col items-center space-y-2">
                    <div className={`w-14 h-14 rounded-full border-2 transition-all overflow-hidden bg-white flex items-center justify-center ${
                      !PRESET_COLORS.some(c => c.name === state.clothingConfig.color) && state.clothingConfig.color !== 'Match Reference'
                      ? 'border-brandPurple ring-4 ring-brandPurple/10'
                      : 'border-white shadow-sm hover:border-mistBlue'
                    }`}>
                      <Pipette className="absolute pointer-events-none w-5 h-5 text-gray-400 group-hover:text-brandPurple" />
                      <input 
                        type="color" 
                        className="w-24 h-24 cursor-pointer opacity-0"
                        onChange={(e) => updateClothing('color', e.target.value)}
                      />
                      {!PRESET_COLORS.some(c => c.name === state.clothingConfig.color) && state.clothingConfig.color !== 'Match Reference' && (
                        <div className="absolute inset-0 pointer-events-none border-4 border-brandPurple rounded-full" style={{ backgroundColor: state.clothingConfig.color }}></div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">Custom</span>
                    {!PRESET_COLORS.some(c => c.name === state.clothingConfig.color) && state.clothingConfig.color !== 'Match Reference' && (
                      <CheckCircle className="absolute -top-1 -right-1 w-6 h-6 text-brandPurple bg-white rounded-full p-0.5 z-10" />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Upload className="w-5 h-5 text-brandPurple" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Custom Pattern</h3>
                  </div>
                  <div className="border-2 border-dashed border-silverGray/30 rounded-[1.5rem] p-6 hover:border-brandPurple/50 transition-colors bg-apricot/30 text-center h-full flex flex-col justify-center min-h-[250px]">
                    {!state.patternBase64 ? (
                      <label className="cursor-pointer group">
                        <div className="flex flex-col items-center">
                          <div className="bg-white p-4 rounded-2xl mb-4 shadow-sm group-hover:shadow-md transition-all">
                            <Palette className="w-8 h-8 text-brandPurple" />
                          </div>
                          <span className="text-sm font-bold text-gray-900">Upload Pattern</span>
                          <span className="text-[11px] text-gray-400 mt-2 max-w-[150px] mx-auto">Overlay your creative designs on the garment base</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handlePatternUpload} />
                          <div className="mt-5 bg-white border border-silverGray/30 text-brandPurple px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-brandPurple hover:text-white transition-all">Choose File</div>
                        </div>
                      </label>
                    ) : (
                      <div className="relative group p-2">
                        <img src={state.patternBase64} alt="Pattern Preview" className="max-h-32 mx-auto rounded-2xl shadow-xl border-4 border-white" />
                        <button onClick={() => setState(prev => ({ ...prev, patternBase64: undefined }))} className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"><Scissors className="w-4 h-4" /></button>
                        <p className="mt-4 text-[11px] font-bold text-green-600 flex items-center justify-center bg-green-50 py-1 px-3 rounded-full"><CheckCircle className="w-3 h-3 mr-1" /> Pattern Ready</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Users className="w-5 h-5 text-brandPurple" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Human-Pet Matching</h3>
                  </div>
                  <div className="border-2 border-dashed border-brandPurple/20 rounded-[1.5rem] p-6 hover:border-brandPurple/50 transition-colors bg-brandPurple/[0.03] text-center h-full flex flex-col justify-center min-h-[250px]">
                    {!state.humanClothingBase64 ? (
                      <label className="cursor-pointer group">
                        <div className="flex flex-col items-center">
                          <div className="bg-brandPurple p-4 rounded-2xl mb-4 shadow-xl shadow-brandPurple/20 group-hover:scale-110 transition-all">
                            <Shirt className="w-8 h-8 text-white" />
                          </div>
                          <span className="text-sm font-bold text-gray-900">Parent-Child Mode</span>
                          <span className="text-[11px] text-gray-400 mt-2 max-w-[150px] mx-auto">Auto-sync your pet's outfit with your own wardrobe</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleHumanMatchingUpload} />
                          <div className="mt-5 bg-brandPurple text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-brandPurple/20 hover:opacity-90 transition-all">Upload My Outfit</div>
                        </div>
                      </label>
                    ) : (
                      <div className="relative group p-2">
                        <img src={state.humanClothingBase64} alt="Human Matching Reference" className="max-h-32 mx-auto rounded-2xl shadow-xl border-4 border-brandPurple/20" />
                        <button onClick={() => setState(prev => ({ ...prev, humanClothingBase64: undefined }))} className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"><Scissors className="w-4 h-4" /></button>
                        <p className="mt-4 text-[11px] font-bold text-brandPurple flex items-center justify-center bg-brandPurple/5 py-1 px-3 rounded-full uppercase tracking-tighter"><Users className="w-3 h-3 mr-1" /> Matching Active</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button 
                  onClick={prevStep}
                  disabled={state.isGenerating}
                  className="flex-1 flex justify-center items-center py-4 px-6 border border-silverGray/30 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-apricot transition-colors"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={state.isGenerating}
                  className="flex-[2] flex justify-center items-center py-4 px-6 rounded-xl shadow-lg shadow-brandPurple/20 text-sm font-bold text-white bg-brandPurple hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  {state.isGenerating ? (
                    <><Loader2 className="animate-spin mr-2 w-5 h-5" /> Rendering Bespoke 3D Models...</>
                  ) : (
                    <><Sparkles className="w-5 h-5 mr-2" /> Generate 3D Preview <ArrowRight className="ml-2 w-4 h-4" /></>
                  )}
                </button>
              </div>
              {state.error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center justify-center space-x-2 animate-pulse">
                  <span className="text-sm font-medium">{state.error}</span>
                </div>
              )}
            </div>
          )}

          {state.step === Step.MAIN_PREVIEW && (
            <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
              <div className="flex flex-col items-center">
                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Your 3D Masterpiece</h2>
                 <p className="text-sm text-gray-500 mb-8">Generated by Gemini Vision Pro Engine</p>
              </div>
              <div className="aspect-square max-w-lg mx-auto bg-apricot/30 rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white relative group">
                {state.showcase.main ? (
                  <img src={state.showcase.main} alt="Final 3D Render" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brandPurple" /></div>
                )}
                <div className="absolute inset-0 bg-brandPurple/5 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="flex space-x-4 pt-10">
                <button 
                  onClick={prevStep}
                  className="flex-1 flex justify-center items-center py-4 px-6 border border-silverGray/30 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-apricot"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Adjust Design
                </button>
                <button 
                  onClick={nextStep}
                  className="flex-[2] flex justify-center items-center py-4 px-6 rounded-xl shadow-lg shadow-brandPurple/20 text-sm font-bold text-white bg-brandPurple hover:bg-opacity-90 transition-all"
                >
                  View All Angles <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {state.step === Step.SHOWCASE && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="flex items-center space-x-3 text-brandPurple mb-4">
                <Camera className="w-6 h-6" />
                <h2 className="text-xl font-bold tracking-tight">5. Multi-Angle Showcase</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                   <div className="relative group overflow-hidden rounded-[2rem] border-4 border-white shadow-xl">
                      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black text-brandPurple flex items-center uppercase tracking-widest">
                        <Maximize2 className="w-3 h-3 mr-2" /> Side Profile
                      </div>
                      <img src={state.showcase.side} className="w-full aspect-[4/3] object-cover" alt="Side View" />
                   </div>
                   <div className="relative group overflow-hidden rounded-[2rem] border-4 border-white shadow-xl">
                      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black text-brandPurple flex items-center uppercase tracking-widest">
                        <Maximize2 className="w-3 h-3 mr-2" /> Rear Fit
                      </div>
                      <img src={state.showcase.back} className="w-full aspect-[4/3] object-cover" alt="Back View" />
                   </div>
                </div>
                <div className="space-y-6">
                  <div className="relative group overflow-hidden rounded-[2rem] border-4 border-white shadow-xl h-full">
                      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black text-brandPurple flex items-center uppercase tracking-widest">
                        <Palette className="w-3 h-3 mr-2" /> Texture Detail
                      </div>
                      <img src={state.showcase.detail} className="w-full h-full object-cover min-h-[400px]" alt="Detail View" />
                   </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-10">
                <button 
                  onClick={prevStep}
                  className="flex-1 flex justify-center items-center py-4 px-6 border border-silverGray/30 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-apricot transition-colors"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back to Render
                </button>
                <button 
                  onClick={nextStep}
                  className="flex-[2] flex justify-center items-center py-4 px-6 rounded-xl shadow-lg shadow-brandPurple/20 text-sm font-bold text-white bg-brandPurple hover:bg-opacity-90 transition-all"
                >
                  Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {state.step === Step.PAYMENT && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-700">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Final Order Review</h2>
                <div className="aspect-[4/5] bg-apricot/30 rounded-[2rem] overflow-hidden shadow-inner border-4 border-white relative">
                  <img src={state.showcase.main} alt="Final Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/80 backdrop-blur-md rounded-2xl border border-silverGray/10">
                    <h4 className="text-[10px] font-black text-silverGray mb-3 uppercase tracking-widest">Configuration</h4>
                    <ul className="text-xs text-gray-700 space-y-2 font-medium">
                      <li className="flex justify-between"><span>Breed</span> <span className="font-bold">{state.petData.breed}</span></li>
                      <li className="flex justify-between"><span>Style</span> <span className="font-bold">{state.clothingConfig.style}</span></li>
                      <li className="flex justify-between"><span>Material</span> <span className="font-bold">{state.clothingConfig.fabric}</span></li>
                      <li className="flex justify-between"><span>Color Base</span> <span className="font-bold text-brandPurple uppercase">{state.clothingConfig.color}</span></li>
                      {state.humanClothingBase64 && <li className="flex items-center text-brandPurple font-bold"><Users className="w-3 h-3 mr-1" /> Parent-Child Match</li>}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center space-x-3 text-brandPurple">
                  <CreditCard className="w-6 h-6" />
                  <h2 className="text-xl font-bold tracking-tight">Secure Checkout</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="p-5 bg-apricot/20 rounded-2xl border border-silverGray/10 flex justify-between items-center transition-all hover:bg-white hover:shadow-md">
                    <span className="text-gray-600 text-sm font-medium">Custom 3D Fit Out</span>
                    <span className="font-bold text-gray-900 tracking-tighter">$89.00</span>
                  </div>
                  <div className="p-5 bg-apricot/20 rounded-2xl border border-silverGray/10 flex justify-between items-center transition-all hover:bg-white hover:shadow-md">
                    <span className="text-gray-600 text-sm font-medium">Pattern Printing Fee</span>
                    <span className="font-bold text-gray-900 tracking-tighter">$12.00</span>
                  </div>
                  {state.humanClothingBase64 && (
                    <div className="p-5 bg-mistBlue/20 rounded-2xl border border-mistBlue flex justify-between items-center">
                      <span className="text-brandPurple text-sm font-bold">AI Style Matching Service</span>
                      <span className="font-bold text-brandPurple tracking-tighter">$15.00</span>
                    </div>
                  )}
                  <div className="pt-6 border-t border-silverGray/20 flex justify-between items-center px-2">
                    <span className="text-lg font-bold text-gray-500 uppercase tracking-widest">Total</span>
                    <span className="text-3xl font-black text-brandPurple tracking-tighter">${state.humanClothingBase64 ? '116.00' : '101.00'}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="group">
                      <label className="block text-[10px] font-black text-silverGray uppercase mb-1.5 ml-1 tracking-widest">Card Number</label>
                      <input type="text" placeholder="**** **** **** 4242" className="w-full p-4 rounded-xl border border-silverGray/20 bg-apricot/10 focus:bg-white focus:ring-brandPurple focus:border-brandPurple transition-all font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-silverGray uppercase mb-1.5 ml-1 tracking-widest">Expiry</label>
                        <input type="text" placeholder="MM/YY" className="w-full p-4 rounded-xl border border-silverGray/20 bg-apricot/10 focus:bg-white focus:ring-brandPurple transition-all font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-silverGray uppercase mb-1.5 ml-1 tracking-widest">CVC</label>
                        <input type="password" placeholder="***" className="w-full p-4 rounded-xl border border-silverGray/20 bg-apricot/10 focus:bg-white focus:ring-brandPurple transition-all font-mono" />
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-brandPurple text-white py-5 rounded-[1.25rem] font-bold shadow-xl shadow-brandPurple/20 hover:scale-[1.02] transition-all flex justify-center items-center mt-6 text-lg">
                    Place Order & Start Crafting
                  </button>
                  <button onClick={() => setState(prev => ({ ...prev, step: Step.PET_INFO }))} className="w-full text-gray-400 text-xs font-bold hover:text-brandPurple py-4 uppercase tracking-[0.2em] transition-colors">
                    Start Over
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;
