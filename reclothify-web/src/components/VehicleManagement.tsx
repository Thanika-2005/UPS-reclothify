'use client';

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  User, 
  Phone, 
  Star, 
  MapPin, 
  Fuel, 
  Weight, 
  Clock,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';
import { VEHICLES, DRIVERS, Vehicle, Driver } from '../lib/logistics';

interface VehicleStatus {
  id: string;
  status: 'active' | 'idle' | 'maintenance';
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  currentLoad: {
    weight: number;
    volume: number;
  };
  tripProgress: number; // 0-100
  estimatedArrival: string;
}

const VehicleManagement: React.FC = () => {
  const [vehicles] = useState<Vehicle[]>(VEHICLES);
  const [drivers] = useState<Driver[]>(DRIVERS);
  const [vehicleStatuses, setVehicleStatuses] = useState<VehicleStatus[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  useEffect(() => {
    // Initialize vehicle statuses
    const initialStatuses: VehicleStatus[] = vehicles.map((vehicle, index) => ({
      id: vehicle.id,
      status: index === 0 ? 'active' : index === 1 ? 'idle' : 'maintenance',
      currentLocation: {
        lat: 13.0827 + (index * 0.01),
        lng: 80.2707 + (index * 0.01),
        address: `Location ${index + 1}, Chennai`
      },
      currentLoad: {
        weight: Math.floor(Math.random() * vehicle.capacity.weight * 0.8),
        volume: Math.floor(Math.random() * vehicle.capacity.volume * 0.8 * 100) / 100
      },
      tripProgress: Math.floor(Math.random() * 100),
      estimatedArrival: new Date(Date.now() + Math.random() * 120 * 60000).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
    setVehicleStatuses(initialStatuses);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setVehicleStatuses(prev => prev.map(status => ({
        ...status,
        tripProgress: status.status === 'active' ? Math.min(100, status.tripProgress + Math.random() * 2) : status.tripProgress,
        currentLoad: {
          ...status.currentLoad,
          weight: status.status === 'active' 
            ? Math.max(0, status.currentLoad.weight - Math.random() * 2)
            : status.currentLoad.weight
        }
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [vehicles]);

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

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      idle: 'bg-yellow-100 text-yellow-800',
      maintenance: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: <Activity className="h-4 w-4" />,
      idle: <Clock className="h-4 w-4" />,
      maintenance: <XCircle className="h-4 w-4" />
    };
    return icons[status as keyof typeof icons] || <Clock className="h-4 w-4" />;
  };

  const getDriverForVehicle = (vehicleId: string) => {
    return drivers.find(driver => driver.vehicleId === vehicleId);
  };

  const getLoadPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚛 Vehicle Fleet Management
          </h1>
          <p className="text-gray-600">
            Real-time tracking and management of your logistics fleet
          </p>
        </div>

        {/* Fleet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
                <p className="text-2xl font-bold text-green-600">
                  {vehicleStatuses.filter(v => v.status === 'active').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Vehicles</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {vehicleStatuses.filter(v => v.status === 'idle').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Maintenance</p>
                <p className="text-2xl font-bold text-red-600">
                  {vehicleStatuses.filter(v => v.status === 'maintenance').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Fleet Vehicles</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {vehicles.map((vehicle) => {
              const status = vehicleStatuses.find(s => s.id === vehicle.id);
              const driver = getDriverForVehicle(vehicle.id);
              
              if (!status) return null;

              return (
                <div 
                  key={vehicle.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedVehicle === vehicle.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">
                        {getVehicleIcon(vehicle.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vehicle.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ID: {vehicle.id} • Type: {vehicle.type}
                        </p>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(status.status)}`}>
                          {getStatusIcon(status.status)}
                          <span className="ml-1 capitalize">{status.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      {/* Load Status */}
                      <div className="text-center">
                        <p className="text-gray-600">Load</p>
                        <div className="flex items-center space-x-2">
                          <Weight className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {status.currentLoad.weight}kg / {vehicle.capacity.weight}kg
                          </span>
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getLoadPercentage(status.currentLoad.weight, vehicle.capacity.weight)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Fuel Efficiency */}
                      <div className="text-center">
                        <p className="text-gray-600">Efficiency</p>
                        <div className="flex items-center space-x-1">
                          <Fuel className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{vehicle.fuelEfficiency} km/L</span>
                        </div>
                      </div>

                      {/* Cost */}
                      <div className="text-center">
                        <p className="text-gray-600">Cost/km</p>
                        <span className="font-medium">₹{vehicle.costPerKm}</span>
                      </div>

                      {/* Status Indicator */}
                      <div className="text-center">
                        {status.status === 'active' && (
                          <>
                            <p className="text-gray-600">Progress</p>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${status.tripProgress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{Math.round(status.tripProgress)}%</span>
                            </div>
                          </>
                        )}
                        {status.status === 'idle' && (
                          <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                        )}
                        {status.status === 'maintenance' && (
                          <XCircle className="h-8 w-8 text-red-600 mx-auto" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedVehicle === vehicle.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Driver Information */}
                        {driver && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Assigned Driver
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {driver.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{driver.name}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                      <Phone className="h-3 w-3" />
                                      <span>{driver.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-3 w-3 text-yellow-500" />
                                      <span>{driver.rating}/5</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Current Location */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Current Location
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-2">{status.currentLocation.address}</p>
                            <p className="text-xs text-gray-500">
                              Lat: {status.currentLocation.lat.toFixed(4)}, 
                              Lng: {status.currentLocation.lng.toFixed(4)}
                            </p>
                            {status.status === 'active' && (
                              <p className="text-sm font-medium text-green-600 mt-2">
                                ETA: {status.estimatedArrival}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Vehicle Specifications */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Specifications
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Max Weight:</span>
                              <span className="font-medium">{vehicle.capacity.weight}kg</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Max Volume:</span>
                              <span className="font-medium">{vehicle.capacity.volume}m³</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Fuel Efficiency:</span>
                              <span className="font-medium">{vehicle.fuelEfficiency} km/L</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">CO₂ Emission:</span>
                              <span className="font-medium">{vehicle.co2EmissionPerKm}g/km</span>
                            </div>
                          </div>
                        </div>

                        {/* Real-time Metrics */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Real-time Metrics</h4>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Weight Utilization</span>
                                <span className="font-medium">
                                  {getLoadPercentage(status.currentLoad.weight, vehicle.capacity.weight)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${getLoadPercentage(status.currentLoad.weight, vehicle.capacity.weight)}%` }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Volume Utilization</span>
                                <span className="font-medium">
                                  {getLoadPercentage(status.currentLoad.volume, vehicle.capacity.volume)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${getLoadPercentage(status.currentLoad.volume, vehicle.capacity.volume)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;

