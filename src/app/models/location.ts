// State/Region Model
export interface IRegion {
  regions: string;
  regionsMM: string;
  regionsPCode: string;
  totalDistricts: string;
  totalTownships: string;
  totalVillageTractTowns: string;
  totalVillageWards: string;
}

// Wrapper for state/region array
export interface IRegions {
  regionsList: IRegion[];
}

// District Model
export interface IDistrict {
  district: string;
  districtMM: string;
  districtPCode: string;
  stateRegion: string;
  stateRegionMM: string;
  stateRegionPCode: string;
  totalTownships: string;
  regions?: string;
  regionsMM: string;
  regionsPCode: string;
  totalVillageTractTowns: string;
  totalVillageWards: string;
}

// Wrapper for district array
export interface IDistricts {
  districts: IDistrict[];
}

// Township Model
export interface ITownship {
  township: string;
  townshipMM: string;
  townshipPCode: string;
  district: string;
  districtMM: string;
  districtPCode: string;
  regions: string;
  regionsMM: string;
  regionsPCode: string;
  totalVillageTractTowns: string;
  totalVillageWards: string;
}

// Wrapper for township array
export interface ITownships {
  townships: ITownship[];
}

// VillageTractTown Model
export interface IVillageTractTown {
  villageTractTown: string;
  villageTractTownMM: string;
  villageTractTownPCode: string;
  township: string;
  townshipMM: string;
  townshipPCode: string;
  district: string;
  districtMM: string;
  districtPCode: string;
  regions: string;
  regionsMM: string;
  regionsPCode: string;
}

// Wrapper for village tract/town array
export interface IVillageTractTowns {
  villageTractTowns: IVillageTractTown[];
}

// VillageWard Model
export interface IVillageWard {
  villageWard: string;
  villageWardMM: string;
  villageWardPCode: string;
  villageTractTown: string;
  villageTractTownMM: string;
  villageTractTownPCode: string;
  township: string;
  townshipMM: string;
  townshipPCode: string;
  district: string;
  districtMM: string;
  districtPCode: string;
  regions: string;
  regionsMM: string;
  regionsPCode: string;
}

// Wrapper for village ward array
export interface IVillageWards {
  villageWards: IVillageWard[];
}

// Unified Location Model (for all data at once)
export interface ILocation {
  regions: IRegions[];
  districts: IDistrict[];
  townships: ITownship[];
  villageTractTowns: IVillageTractTown[];
  villageWards: IVillageWard[];
}

// Flexible response model (for partial data)
export interface ILocationResponse {
  regions?: IRegions[];
  districts?: IDistrict[];
  townships?: ITownship[];
  villageTractTowns?: IVillageTractTown[];
  villageWards?: IVillageWard[];
}

export interface ICountry {
  label: string;
  value: string;
}
