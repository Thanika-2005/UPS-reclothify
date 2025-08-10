'use client';

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Weight, 
  DollarSign, 
  TrendingUp, 
  Leaf,
  User,
  Phone,
  Star,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import {
  optimizeLogistics,
  generateSamplePickups,
  DEPOT,
  Location,
  RouteOptimizationResult,
  VEHICLES,
  DRIVERS
} from '../lib/logistics';

const LogisticsDashboard: React.FC = () => {
  const [optimizationResult, setOptimizationResult] = useState<RouteOptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [pickupLocations, setPickupLocations] = useState<Location[]>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Generate sample pickups on component mount
    const samplePickups = generateSamplePickups();
    setPickupLocations(samplePickups);
  }, []);

  const handleOptimizeRoute = async () => {
    setIsOptimizing(true);
    
    // Simulate API call delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const result = optimizeLogistics(pickupLocations, DEPOT);
      setOptimizationResult(result);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const startSimulation = () => {
    setSimulationRunning(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= (optimizationResult?.route.length || 0)) {
          setSimulationRunning(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const resetSimulation = () => {
    setSimulationRunning(false);
    setCurrentStep(0);
  };

  const getVehicleIcon = (type: string) => {
    const icons = {
      bike: '🏍️',
      auto: '🛺',
      tempo: '🚐',
      van: '🚌',
      truck: '🚛'
    };
    return icons[type as keyof typeof icons] || '🚐';
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600 bg-green-100';
    if (efficiency >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚛 Advanced Logistics Optimization
          </h1>
          <p className="text-gray-600">
            AI-powered route optimization with real-time vehicle selection and tracking
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={handleOptimizeRoute}
              disabled={isOptimizing || pickupLocations.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Optimizing...
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5" />
                  Optimize Route
                </>
              )}
            </button>

            {optimizationResult && (
              <>
                <button
                  onClick={simulationRunning ? resetSimulation : startSimulation}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  {simulationRunning ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Stop Simulation
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Start Live Simulation
                    </>
                  )}
                </button>

                <button
                  onClick={resetSimulation}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                  Reset
                </button>
              </>
            )}

            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{pickupLocations.length} Pickup Locations</span>
            </div>
          </div>
        </div>

        {optimizationResult && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Distance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {optimizationResult.totalDistance} km
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Cost</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{optimizationResult.totalCost}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Efficiency Score</p>
                    <p className={`text-2xl font-bold ${getEfficiencyColor(optimizationResult.efficiency).split(' ')[0]}`}>
                      {optimizationResult.efficiency}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Est. Time</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.floor(optimizationResult.totalTime / 60)}h {optimizationResult.totalTime % 60}m
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Vehicle and Driver Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Selected Vehicle */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Selected Vehicle
                </h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {getVehicleIcon(optimizationResult.selectedVehicle.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {optimizationResult.selectedVehicle.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Weight className="h-4 w-4" />
                        <span>Max: {optimizationResult.selectedVehicle.capacity.weight}kg</span>
                      </div>
                      <div>
                        <span>Vol: {optimizationResult.selectedVehicle.capacity.volume}m³</span>
                      </div>
                      <div>
                        <span>₹{optimizationResult.selectedVehicle.costPerKm}/km</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <span>{optimizationResult.selectedVehicle.fuelEfficiency} km/L</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Driver */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Assigned Driver
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {optimizationResult.assignedDriver.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {optimizationResult.assignedDriver.name}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{optimizationResult.assignedDriver.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{optimizationResult.assignedDriver.rating}/5</span>
                      </div>
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                      optimizationResult.assignedDriver.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {optimizationResult.assignedDriver.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Optimized Route
                {simulationRunning && (
                  <span className="text-sm font-normal text-green-600">
                    (Live Simulation - Step {currentStep + 1}/{optimizationResult.route.length + 1})
                  </span>
                )}
              </h3>
              
              <div className="space-y-4">
                {/* Depot Start */}
                <div className={`flex items-center p-4 rounded-lg border-2 ${
                  currentStep === 0 && simulationRunning 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    🏭
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{DEPOT.name}</h4>
                    <p className="text-sm text-gray-600">{DEPOT.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Starting Point</p>
                    <p className="text-xs text-gray-500">08:00 AM</p>
                  </div>
                </div>

                {/* Route Steps */}
                {optimizationResult.route.map((location, index) => (
                  <div key={location.id} className={`flex items-center p-4 rounded-lg border-2 ${
                    currentStep === index + 1 && simulationRunning 
                      ? 'border-green-500 bg-green-50' 
                      : currentStep > index + 1 && simulationRunning
                      ? 'border-green-300 bg-green-25'
                      : 'border-gray-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 ${
                      currentStep > index + 1 && simulationRunning
                        ? 'bg-green-600'
                        : currentStep === index + 1 && simulationRunning
                        ? 'bg-green-500 animate-pulse'
                        : 'bg-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{location.name}</h4>
                      <p className="text-sm text-gray-600">{location.address}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">
                          Weight: {location.weight}kg
                        </span>
                        <span className="text-xs text-gray-500">
                          Volume: {location.volume}m³
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          location.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : location.priority === 'medium' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {location.priority}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {location.timeWindow.start} - {location.timeWindow.end}
                      </p>
                      {currentStep === index + 1 && simulationRunning && (
                        <p className="text-xs text-green-600 font-medium">
                          ✓ In Progress
                        </p>
                      )}
                      {currentStep > index + 1 && simulationRunning && (
                        <p className="text-xs text-green-600 font-medium">
                          ✓ Completed
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Return to Depot */}
                <div className={`flex items-center p-4 rounded-lg border-2 ${
                  currentStep > optimizationResult.route.length && simulationRunning 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    🏭
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Return to {DEPOT.name}</h4>
                    <p className="text-sm text-gray-600">End of route</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">End Point</p>
                    <p className="text-xs text-gray-500">
                      ~{Math.floor((8 * 60 + optimizationResult.totalTime) / 60)}:
                      {String((8 * 60 + optimizationResult.totalTime) % 60).padStart(2, '0')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Environmental Impact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {optimizationResult.environmentalImpact.co2Emission}g
                  </div>
                  <p className="text-sm text-gray-600">CO₂ Emissions</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {optimizationResult.environmentalImpact.fuelConsumption}L
                  </div>
                  <p className="text-sm text-gray-600">Fuel Consumption</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    ₹{(optimizationResult.totalCost / pickupLocations.reduce((sum, loc) => sum + loc.weight, 0)).toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-600">Cost per KG</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* No Results State */}
        {!optimizationResult && !isOptimizing && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready for Route Optimization
            </h3>
            <p className="text-gray-600 mb-6">
              Click &quot;Optimize Route&quot; to generate the most efficient delivery route for {pickupLocations.length} pickup locations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <strong>Total Weight:</strong> {pickupLocations.reduce((sum, loc) => sum + loc.weight, 0)}kg
              </div>
              <div>
                <strong>Total Volume:</strong> {pickupLocations.reduce((sum, loc) => sum + loc.volume, 0)}m³
              </div>
              <div>
                <strong>Locations:</strong> {pickupLocations.length} pickups
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsDashboard;

