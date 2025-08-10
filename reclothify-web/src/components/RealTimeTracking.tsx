'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Truck, 
  CheckCircle,
  AlertCircle,
  Route,
  Timer,
  Activity
} from 'lucide-react';

interface TrackingEvent {
  id: string;
  timestamp: Date;
  type: 'pickup' | 'delivery' | 'departure' | 'arrival' | 'delay';
  location: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'delayed';
}

interface LiveTrip {
  id: string;
  driverName: string;
  vehicleType: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  progress: number;
  estimatedArrival: Date;
  speed: number; // km/h
  distance: {
    remaining: number;
    total: number;
  };
  events: TrackingEvent[];
}

const RealTimeTracking: React.FC = () => {
  const [liveTrips, setLiveTrips] = useState<LiveTrip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with sample live trips
    const initialTrips: LiveTrip[] = [
      {
        id: 'trip-001',
        driverName: 'Rajesh Kumar',
        vehicleType: 'Tempo',
        currentLocation: {
          lat: 13.0827,
          lng: 80.2707,
          address: 'OMR Road, Chennai'
        },
        destination: {
          lat: 13.0418,
          lng: 80.2341,
          address: 'T. Nagar, Chennai'
        },
        progress: 45,
        estimatedArrival: new Date(Date.now() + 25 * 60000),
        speed: 28,
        distance: {
          remaining: 8.5,
          total: 15.2
        },
        events: [
          {
            id: 'event-1',
            timestamp: new Date(Date.now() - 30 * 60000),
            type: 'departure',
            location: 'Reclothify Hub',
            description: 'Started journey from logistics hub',
            status: 'completed'
          },
          {
            id: 'event-2',
            timestamp: new Date(Date.now() - 15 * 60000),
            type: 'pickup',
            location: 'Anna Nagar',
            description: 'Collected 22kg clothing donation',
            status: 'completed'
          },
          {
            id: 'event-3',
            timestamp: new Date(),
            type: 'pickup',
            location: 'Adyar',
            description: 'Picking up 8kg clothing items',
            status: 'in-progress'
          }
        ]
      },
      {
        id: 'trip-002',
        driverName: 'Amit Singh',
        vehicleType: 'Van',
        currentLocation: {
          lat: 13.0850,
          lng: 80.2101,
          address: 'Anna Nagar, Chennai'
        },
        destination: {
          lat: 12.9750,
          lng: 80.2230,
          address: 'Velachery, Chennai'
        },
        progress: 78,
        estimatedArrival: new Date(Date.now() + 12 * 60000),
        speed: 32,
        distance: {
          remaining: 3.2,
          total: 14.8
        },
        events: [
          {
            id: 'event-4',
            timestamp: new Date(Date.now() - 45 * 60000),
            type: 'departure',
            location: 'Reclothify Hub',
            description: 'Started delivery route',
            status: 'completed'
          },
          {
            id: 'event-5',
            timestamp: new Date(Date.now() - 20 * 60000),
            type: 'delivery',
            location: 'Mylapore',
            description: 'Delivered 15kg to distribution center',
            status: 'completed'
          },
          {
            id: 'event-6',
            timestamp: new Date(Date.now() - 5 * 60000),
            type: 'delay',
            location: 'Traffic Signal',
            description: 'Delayed due to traffic congestion',
            status: 'delayed'
          }
        ]
      }
    ];
    setLiveTrips(initialTrips);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setLiveTrips(prevTrips => 
        prevTrips.map(trip => ({
          ...trip,
          progress: Math.min(100, trip.progress + Math.random() * 2),
          speed: Math.max(15, Math.min(50, trip.speed + (Math.random() - 0.5) * 5)),
          distance: {
            ...trip.distance,
            remaining: Math.max(0, trip.distance.remaining - Math.random() * 0.5)
          },
          estimatedArrival: new Date(trip.estimatedArrival.getTime() + (Math.random() - 0.5) * 60000)
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getVehicleIcon = (type: string) => {
    const icons = {
      Bike: '🏍️',
      Auto: '🛺',
      Tempo: '🚐',
      Van: '🚌',
      Truck: '🚛'
    };
    return icons[type as keyof typeof icons] || '🚐';
  };

  const getEventIcon = (type: string, status: string) => {
    if (status === 'completed') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status === 'delayed') return <AlertCircle className="h-4 w-4 text-red-600" />;
    if (status === 'in-progress') return <Activity className="h-4 w-4 text-blue-600 animate-pulse" />;
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  const getEventColor = (status: string) => {
    const colors = {
      completed: 'bg-green-50 border-green-200',
      'in-progress': 'bg-blue-50 border-blue-200',
      pending: 'bg-gray-50 border-gray-200',
      delayed: 'bg-red-50 border-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-50 border-gray-200';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📍 Real-Time Vehicle Tracking
          </h1>
          <p className="text-gray-600">
            Live monitoring of all active deliveries and pickups
          </p>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Trips</p>
                <p className="text-2xl font-bold text-blue-600">{liveTrips.length}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Speed</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(liveTrips.reduce((acc, trip) => acc + trip.speed, 0) / liveTrips.length)} km/h
                </p>
              </div>
              <Navigation className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Distance</p>
                <p className="text-2xl font-bold text-purple-600">
                  {liveTrips.reduce((acc, trip) => acc + trip.distance.total, 0).toFixed(1)} km
                </p>
              </div>
              <Route className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg ETA</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatDuration(
                    liveTrips.reduce((acc, trip) => 
                      acc + (trip.estimatedArrival.getTime() - Date.now()) / 60000, 0
                    ) / liveTrips.length
                  )}
                </p>
              </div>
              <Timer className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Live Trips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {liveTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Trip Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getVehicleIcon(trip.vehicleType)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {trip.driverName}
                      </h3>
                      <p className="text-sm text-gray-600">{trip.vehicleType} • {trip.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">ETA</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatTime(trip.estimatedArrival)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(trip.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500 relative"
                      style={{ width: `${trip.progress}%` }}
                    >
                      <div className="absolute right-0 top-0 h-3 w-3 bg-blue-800 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Trip Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-600">Speed</p>
                    <p className="font-semibold text-gray-900">{Math.round(trip.speed)} km/h</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Remaining</p>
                    <p className="font-semibold text-gray-900">{trip.distance.remaining.toFixed(1)} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total</p>
                    <p className="font-semibold text-gray-900">{trip.distance.total} km</p>
                  </div>
                </div>
              </div>

              {/* Current Location */}
              <div className="p-4 bg-blue-50">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-900">Current Location</p>
                </div>
                <p className="text-sm text-blue-700 mt-1">{trip.currentLocation.address}</p>
              </div>

              {/* Destination */}
              <div className="p-4 bg-green-50">
                <div className="flex items-center space-x-2">
                  <Navigation className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium text-green-900">Destination</p>
                </div>
                <p className="text-sm text-green-700 mt-1">{trip.destination.address}</p>
              </div>

              {/* Recent Events */}
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h4>
                <div className="space-y-3">
                  {trip.events.slice(-3).reverse().map((event) => (
                    <div 
                      key={event.id} 
                      className={`flex items-start space-x-3 p-3 rounded-lg border ${getEventColor(event.status)}`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getEventIcon(event.type, event.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {event.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {event.location} • {formatTime(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Indicator */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Tracking Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Map View</h3>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive map with real-time vehicle positions</p>
              <p className="text-sm text-gray-500 mt-2">
                Integration with Google Maps or Mapbox for live tracking visualization
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeTracking;

