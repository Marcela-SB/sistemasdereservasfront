export type RoomT = {
    id: string;
    name: string;
    roomNumber: string | null;
    capacity: number;
    chairQuantity: number;
    computerQuantity: number;
    airConditioning: boolean;
    isAirConditioningWorking: boolean;
    projector: boolean;
    isProjectorWorking: boolean;
    bigTables: boolean;
    sinks: boolean;
  };
  