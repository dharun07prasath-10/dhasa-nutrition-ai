import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import NutritionCards from '../components/NutritionCards';
import HealthReportBadge from '../components/HealthReportBadge';
import {
  Camera,
  Upload,
  Search,
  Sliders,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
  Scale
} from 'lucide-react';

export default function FoodScanner({ setActiveTab, onSelectRecipe }) {
  const [activeMode, setActiveMode] = useState('camera'); // camera, upload, manual
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [manualQuery, setManualQuery] = useState('');
  const [portionMultiplier, setPortionMultiplier] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [logSuccess, setLogSuccess] = useState(null);
  const [mealType, setMealType] = useState('Lunch');

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Trigger file upload dialog
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      performScan(file, null, portionMultiplier);
    }
  };

  // Start webcam
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Camera access denied or unavailable. Please upload a photo instead.');
      setCameraActive(false);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  // Capture photo from video stream
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      setImageFile(file);
      setImagePreview(canvas.toDataURL('image/jpeg'));
      stopCamera();
      performScan(file, null, portionMultiplier);
    }, 'image/jpeg');
  };

  // Perform AI scan using Hugging Face Vision API backend
  const performScan = async (file, textQuery, mult) => {
    setLoading(true);
    setError(null);
    setLogSuccess(null);

    try {
      let result;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        if (textQuery) formData.append('custom_hint', textQuery);
        formData.append('portion_multiplier', mult || 1.0);
        result = await api.scanImage(formData);
      } else {
        const formData = new FormData();
        formData.append('food_name', textQuery || 'Toor Dal');
        formData.append('portion_multiplier', mult || 1.0);
        result = await api.scanText(formData);
      }
      setScanResult(result);
    } catch (err) {
      setError(err.message || 'Scanning failed. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle portion change
  const handlePortionChange = (mult) => {
    setPortionMultiplier(mult);
    if (scanResult) {
      performScan(imageFile, scanResult.identified_food, mult);
    }
  };

  // Log scanned meal to daily tracker
  const handleLogToTracker = async () => {
    if (!scanResult) return;
    try {
      await api.logMealItem({
        log_date: new Date().toISOString().split('T')[0],
        meal_type: mealType,
        food_name: scanResult.identified_food,
        serving_amount: portionMultiplier,
        serving_unit: scanResult.serving_size,
        calories: scanResult.calories,
        protein: scanResult.protein,
        carbs: scanResult.carbs,
        fats: scanResult.fats,
        fiber: scanResult.fiber,
        sugar: scanResult.sugar,
        sodium_mg: scanResult.sodium_mg,
        saturated_fat: scanResult.saturated_fat
      });
      setLogSuccess(`Added to today's ${mealType}!`);
      setTimeout(() => setLogSuccess(null), 4000);
    } catch (err) {
      setError('Failed to log to tracker: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800">
          <Camera className="w-3.5 h-3.5" />
          <span>Multimodal Food Recognition AI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          DHASA Food Scanner & Nutrition Vision
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Point your camera at a meal or packaged food label, or upload a photo. Our vision AI identifies the dish, estimates energy & fats breakdown, and suggests high-protein budget swaps.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => {
            setActiveMode('camera');
            startCamera();
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeMode === 'camera'
              ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Camera Live Capture</span>
        </button>

        <button
          onClick={() => {
            stopCamera();
            setActiveMode('upload');
            if (fileInputRef.current) fileInputRef.current.click();
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeMode === 'upload'
              ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image / Label</span>
        </button>

        <button
          onClick={() => {
            stopCamera();
            setActiveMode('manual');
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeMode === 'manual'
              ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Manual Food Search</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Input / Scanner Viewport Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {/* Camera Video Stream */}
        {activeMode === 'camera' && cameraActive && (
          <div className="space-y-4 text-center">
            <div className="relative rounded-2xl overflow-hidden bg-black max-w-lg mx-auto aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-2xl pointer-events-none m-6"></div>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={capturePhoto}
                className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm shadow-lg shadow-brand-500/30 flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                <span>Snap & Analyze</span>
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Upload Box if no camera */}
        {activeMode === 'upload' && !imagePreview && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center cursor-pointer hover:border-brand-500 transition-colors space-y-3"
          >
            <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="font-extrabold text-slate-800 dark:text-slate-200 text-base">
                Click to upload a food photograph or nutrition label
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP up to 10MB</p>
            </div>
          </div>
        )}

        {/* Manual Search Mode */}
        {activeMode === 'manual' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (manualQuery.trim()) {
                performScan(null, manualQuery.trim(), portionMultiplier);
              }
            }}
            className="space-y-4 max-w-xl mx-auto"
          >
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Enter Indian Food or Meal Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                placeholder="e.g., Soya chunks poriyal, Moong dal chilla, Egg dosa..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md"
              >
                Search
              </button>
            </div>
          </form>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto"></div>
            <div>
              <p className="font-extrabold text-slate-900 dark:text-white text-base">Analyzing Food With AI Vision...</p>
              <p className="text-xs text-slate-400">Classifying ingredients & looking up Indian Food Composition Tables (IFCT)</p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* SCAN RESULTS DISPLAY */}
      {scanResult && !loading && (
        <div className="space-y-8 animate-fadeIn">
          {/* Identified Food Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-4 items-center">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Scanned Food"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      AI Food Match ({Math.round(scanResult.confidence * 100)}% Confidence)
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {scanResult.identified_food}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Serving: <strong className="text-slate-700 dark:text-slate-300">{scanResult.serving_size}</strong> • Data: {scanResult.data_source}
                  </p>
                </div>
              </div>

              {/* Log to Tracker Button */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Evening Snacks">Evening Snacks</option>
                  <option value="Dinner">Dinner</option>
                </select>

                <button
                  onClick={handleLogToTracker}
                  className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Log to Tracker</span>
                </button>
              </div>
            </div>

            {logSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{logSuccess}</span>
              </div>
            )}

            {/* Portion Adjuster Controls (Requirement 5) */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> Portion Size Adjustment
                </span>
                <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400">
                  {portionMultiplier}x Multiplier ({scanResult.serving_weight_g}g)
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {scanResult.portion_options?.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePortionChange(opt.multiplier)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      portionMultiplier === opt.multiplier
                        ? 'bg-brand-500 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Fine Portion Slider */}
              <input
                type="range"
                min="0.25"
                max="3.0"
                step="0.25"
                value={portionMultiplier}
                onChange={(e) => handlePortionChange(parseFloat(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />
            </div>

            {/* Scientific Health Report */}
            <HealthReportBadge report={scanResult.health_assessment} />

            {/* Complete Detailed Nutrient Breakdown Cards */}
            <NutritionCards data={scanResult} servingWeight={scanResult.serving_weight_g} />

            {/* Uncertainty Notice (Requirement 7) */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 leading-relaxed">
              <strong>Nutritional Uncertainty Disclosure:</strong> {scanResult.uncertainty_note}
            </div>
          </div>

          {/* HIGH-PROTEIN BUDGET ALTERNATIVES (Requirement 7) */}
          {scanResult.high_protein_alternatives && scanResult.high_protein_alternatives.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Similar High-Protein Budget Alternatives
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Swap with these verified economical staples to maximize protein absorption per rupee:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scanResult.high_protein_alternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{alt.name}</h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-extrabold mt-1">
                        {alt.protein}g Protein • ₹{alt.cost_per_serving} / serving
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed border-t border-emerald-100 dark:border-emerald-800/40 pt-2">
                      {alt.saving_tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECOMMENDED RECIPES USING DETECTED INGREDIENTS (Requirement 7) */}
          {scanResult.recommended_recipes && scanResult.recommended_recipes.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Recipes Using Detected Ingredients
                  </h3>
                </div>
                <span className="text-xs text-slate-500">Quick healthy meals</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {scanResult.recommended_recipes.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => {
                      if (onSelectRecipe) onSelectRecipe(rec.id);
                      setActiveTab('recipe_detail');
                    }}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 cursor-pointer transition-all hover:-translate-y-1 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                        {rec.cuisine}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2 line-clamp-1">
                        {rec.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {rec.prep_time} mins • {rec.difficulty}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-xs font-bold">
                      <span className="text-emerald-600 dark:text-emerald-400">{rec.protein}g Protein</span>
                      <span className="text-amber-600 dark:text-amber-400">₹{rec.cost_inr}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

