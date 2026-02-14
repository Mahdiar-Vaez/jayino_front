export interface ParkingStatus {
  insideCount: number;
  capacity: number;
  available: number;
}

export interface RevenueStats {
  today: number;
  month: number;
  year: number;
}
 export type parkingStatsType = {
  available: number;
  capacity: number;
  insideCount: number;
  exitToday:number
} ;