// Advanced Logistics Optimization Engine for Reclothify
export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  weight: number; // in kg
  volume: number; // in cubic meters
  priority: 'high' | 'medium' | 'low';
  timeWindow: {
    start: string;
    end: string;
  };
}

export interface Vehicle {
  id: string;
  type: 'bike' | 'auto' | 'tempo' | 'truck' | 'van';
  name: string;
  capacity: {
    weight: number; // in kg
    volume: number; // in cubic meters
  };
  costPerKm: number;
  fuelEfficiency: number; // km per liter
  co2EmissionPerKm: number; // grams
  available: boolean;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  currentLocation: {
    lat: number;
    lng: number;
  };
  status: 'available' | 'busy' | 'offline';
  vehicleId: string;
}

export interface RouteOptimizationResult {
  route: Location[];
  totalDistance: number;
  totalCost: number;
  totalTime: number; // in minutes
  efficiency: number; // percentage
  selectedVehicle: Vehicle;
  assignedDriver: Driver;
  environmentalImpact: {
    co2Emission: number;
    fuelConsumption: number;
  };
}

// Vehicle database with Indian logistics specifications
export const VEHICLES: Vehicle[] = [
  {
    id: 'bike-1',
    type: 'bike',
    name: 'Delivery Bike',
    capacity: { weight: 20, volume: 0.5 },
    costPerKm: 3,
    fuelEfficiency: 45,
    co2EmissionPerKm: 50,
    available: true
  },
  {
    id: 'auto-1',
    type: 'auto',
    name: 'Auto Rickshaw',
    capacity: { weight: 50, volume: 1.2 },
    costPerKm: 8,
    fuelEfficiency: 25,
    co2EmissionPerKm: 80,
    available: true
  },
  {
    id: 'tempo-1',
    type: 'tempo',
    name: 'Tempo Traveller',
    capacity: { weight: 500, volume: 8 },
    costPerKm: 15,
    fuelEfficiency: 12,
    co2EmissionPerKm: 180,
    available: true
  },
  {
    id: 'van-1',
    type: 'van',
    name: 'Cargo Van',
    capacity: { weight: 300, volume: 5 },
    costPerKm: 12,
    fuelEfficiency: 15,
    co2EmissionPerKm: 150,
    available: true
  },
  {
    id: 'truck-1',
    type: 'truck',
    name: 'Pickup Truck',
    capacity: { weight: 1000, volume: 15 },
    costPerKm: 25,
    fuelEfficiency: 8,
    co2EmissionPerKm: 300,
    available: true
  }
];

// Sample drivers database
export const DRIVERS: Driver[] = [
  {
    id: 'driver-1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    rating: 4.8,
    currentLocation: { lat: 13.0827, lng: 80.2707 },
    status: 'available',
    vehicleId: 'tempo-1'
  },
  {
    id: 'driver-2',
    name: 'Amit Singh',
    phone: '+91 87654 32109',
    rating: 4.6,
    currentLocation: { lat: 13.0878, lng: 80.2785 },
    status: 'available',
    vehicleId: 'van-1'
  },
  {
    id: 'driver-3',
    name: 'Suresh Reddy',
    phone: '+91 76543 21098',
    rating: 4.9,
    currentLocation: { lat: 13.0799, lng: 80.2743 },
    status: 'available',
    vehicleId: 'auto-1'
  }
];

// Haversine formula to calculate distance between two points
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Vehicle selection algorithm based on load and distance
export function selectOptimalVehicle(
  totalWeight: number,
  totalVolume: number,
  totalDistance: number
): Vehicle {
  const suitableVehicles = VEHICLES.filter(vehicle => 
    vehicle.available &&
    vehicle.capacity.weight >= totalWeight &&
    vehicle.capacity.volume >= totalVolume
  );

  if (suitableVehicles.length === 0) {
    throw new Error('No suitable vehicle available for this load');
  }

  // Calculate efficiency score for each vehicle
  const vehicleScores = suitableVehicles.map(vehicle => {
    const costEfficiency = 1 / (vehicle.costPerKm * totalDistance);
    const capacityUtilization = (totalWeight / vehicle.capacity.weight + totalVolume / vehicle.capacity.volume) / 2;
    const fuelEfficiency = vehicle.fuelEfficiency / 100; // Normalize
    const environmentalScore = 1 / (vehicle.co2EmissionPerKm / 1000); // Normalize
    
    const score = (costEfficiency * 0.3 + capacityUtilization * 0.3 + fuelEfficiency * 0.2 + environmentalScore * 0.2);
    
    return { vehicle, score };
  });

  // Sort by score and return the best vehicle
  vehicleScores.sort((a, b) => b.score - a.score);
  return vehicleScores[0].vehicle;
}

// Advanced route optimization using nearest neighbor with 2-opt improvement
export function optimizeRoute(locations: Location[], depot: Location): Location[] {
  if (locations.length <= 1) return locations;

  // Start with nearest neighbor algorithm
  const unvisited = [...locations];
  const route: Location[] = [];
  let current = depot;

  while (unvisited.length > 0) {
    let nearest = unvisited[0];
    let nearestDistance = calculateDistance(current.lat, current.lng, nearest.lat, nearest.lng);

    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(current.lat, current.lng, unvisited[i].lat, unvisited[i].lng);
      if (distance < nearestDistance) {
        nearest = unvisited[i];
        nearestDistance = distance;
      }
    }

    route.push(nearest);
    current = nearest;
    unvisited.splice(unvisited.indexOf(nearest), 1);
  }

  // Apply 2-opt improvement
  return improve2Opt(route);
}

function improve2Opt(route: Location[]): Location[] {
  let improved = true;
  let bestRoute = [...route];
  let bestDistance = calculateRouteDistance(bestRoute);

  while (improved) {
    improved = false;
    for (let i = 1; i < route.length - 2; i++) {
      for (let j = i + 1; j < route.length; j++) {
        if (j - i === 1) continue; // Skip adjacent edges
        
        const newRoute = [...route];
        // Reverse the order of cities between i and j
        const segment = newRoute.slice(i, j + 1).reverse();
        newRoute.splice(i, j - i + 1, ...segment);
        
        const newDistance = calculateRouteDistance(newRoute);
        if (newDistance < bestDistance) {
          bestRoute = newRoute;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }
    route = bestRoute;
  }

  return bestRoute;
}

function calculateRouteDistance(route: Location[]): number {
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += calculateDistance(
      route[i].lat, route[i].lng,
      route[i + 1].lat, route[i + 1].lng
    );
  }
  return totalDistance;
}

// Main logistics optimization function
export function optimizeLogistics(
  pickupLocations: Location[],
  depot: Location
): RouteOptimizationResult {
  // Calculate total load
  const totalWeight = pickupLocations.reduce((sum, loc) => sum + loc.weight, 0);
  const totalVolume = pickupLocations.reduce((sum, loc) => sum + loc.volume, 0);

  // Optimize route
  const optimizedRoute = optimizeRoute(pickupLocations, depot);
  
  // Calculate total distance including return to depot
  const fullRoute = [depot, ...optimizedRoute, depot];
  const totalDistance = calculateRouteDistance(fullRoute);

  // Select optimal vehicle
  const selectedVehicle = selectOptimalVehicle(totalWeight, totalVolume, totalDistance);

  // Find available driver
  const assignedDriver = DRIVERS.find(driver => 
    driver.status === 'available' && driver.vehicleId === selectedVehicle.id
  ) || DRIVERS[0];

  // Calculate costs and metrics
  const totalCost = totalDistance * selectedVehicle.costPerKm;
  const totalTime = (totalDistance / 30) * 60; // Assuming 30 km/h average speed, convert to minutes
  const fuelConsumption = totalDistance / selectedVehicle.fuelEfficiency;
  const co2Emission = totalDistance * selectedVehicle.co2EmissionPerKm;

  // Calculate efficiency (capacity utilization + cost efficiency)
  const capacityUtilization = Math.min(
    (totalWeight / selectedVehicle.capacity.weight + totalVolume / selectedVehicle.capacity.volume) / 2,
    1
  );
  const efficiency = capacityUtilization * 100;

  return {
    route: optimizedRoute,
    totalDistance: Math.round(totalDistance * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    totalTime: Math.round(totalTime),
    efficiency: Math.round(efficiency * 100) / 100,
    selectedVehicle,
    assignedDriver,
    environmentalImpact: {
      co2Emission: Math.round(co2Emission),
      fuelConsumption: Math.round(fuelConsumption * 100) / 100
    }
  };
}

// Generate sample pickup locations in Chennai
export function generateSamplePickups(): Location[] {
  return [
    {
      id: 'pickup-1',
      name: 'T. Nagar Pickup',
      address: 'Pondy Bazaar, T. Nagar, Chennai',
      lat: 13.0418,
      lng: 80.2341,
      weight: 15,
      volume: 0.8,
      priority: 'high',
      timeWindow: { start: '09:00', end: '12:00' }
    },
    {
      id: 'pickup-2',
      name: 'Anna Nagar Collection',
      address: 'Anna Nagar, Chennai',
      lat: 13.0850,
      lng: 80.2101,
      weight: 22,
      volume: 1.2,
      priority: 'medium',
      timeWindow: { start: '10:00', end: '14:00' }
    },
    {
      id: 'pickup-3',
      name: 'Adyar Donation Center',
      address: 'Adyar, Chennai',
      lat: 13.0067,
      lng: 80.2206,
      weight: 8,
      volume: 0.5,
      priority: 'low',
      timeWindow: { start: '11:00', end: '16:00' }
    },
    {
      id: 'pickup-4',
      name: 'Velachery Hub',
      address: 'Velachery, Chennai',
      lat: 12.9750,
      lng: 80.2230,
      weight: 18,
      volume: 1.0,
      priority: 'high',
      timeWindow: { start: '09:30', end: '13:00' }
    },
    {
      id: 'pickup-5',
      name: 'Mylapore Station',
      address: 'Mylapore, Chennai',
      lat: 13.0339,
      lng: 80.2619,
      weight: 12,
      volume: 0.7,
      priority: 'medium',
      timeWindow: { start: '10:30', end: '15:00' }
    },
    {
      id: 'pickup-6',
      name: 'Sholinganallur Tech Park',
      address: 'Sholinganallur, Chennai',
      lat: 12.9000,
      lng: 80.2280,
      weight: 25,
      volume: 1.5,
      priority: 'high',
      timeWindow: { start: '08:00', end: '11:00' }
    }
  ];
}

export const DEPOT: Location = {
  id: 'depot',
  name: 'Reclothify Logistics Hub',
  address: 'OMR, Chennai',
  lat: 13.0827,
  lng: 80.2707,
  weight: 0,
  volume: 0,
  priority: 'high',
  timeWindow: { start: '08:00', end: '20:00' }
};

