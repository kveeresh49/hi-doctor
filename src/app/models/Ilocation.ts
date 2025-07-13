export interface IRegion {
    regions: string;
    regionsMM: string;
    regionsPCode: string;
    totalDistricts: string;
    totalTownships: string;
    totalVillageTractTowns: string;
    totalVillageWards: string;
}

export interface IRegions {
    regionsList: IRegion[];
}

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


export interface IDistricts {
    districts: IDistrict[];
}

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
export interface ITownships {
    townships: ITownship[];
}

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

export interface IVillageTractTowns {
    villageTractTowns: IVillageTractTown[];
}

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

export interface IVillageWards {
    villageWards: IVillageWard[];
}

export interface ILocation {
    regions: IRegions[];
    districts: IDistrict[];
    townships: ITownship[];
    villageTractTowns: IVillageTractTown[];
    villageWards: IVillageWard[];
}

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


export interface IDivisions {
    code: string;
    name: string;
}

export interface ICompany {
    companyId: string;
    companyName: string;
    logo: string;
    username: string;
    password: string;
    email: string;
    role: string;
}

export interface IEmployee {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: IRole;
    qualification: string;
    address: string;
    state: IRegions[]; // This seems to be an old property as per data, replaced by empWorkState
    district: IDistrict[]; // This seems to be an old property as per data, replaced by empWorkDistrict
    city?: ITownship[]; // This seems to be an old property as per data, replaced by empWorkCity
    division?: IDivisions[];
    resume?: string;
    profilePic: string;
    status: string;
    employeeType: string;
    password: string;
    empWorkDistrict: IDistrict[];
    empWorkCity: ITownship[];
    empWorkState: IRegion[]; // Changed from IRegions[] to IRegion[] based on data structure
    empWorkStateAdmin: boolean;
    empWorkDistrictAdmin: boolean;
    empWorkCityAdmin: boolean;
    reporteesRolesList: IRole[];
    // Added missing properties based on provided employeeDataList content
    experience: string;
    companyId: string;
    company: any; // Type as 'any' or define a specific interface if 'company' has a structure
}

export interface IRole {
    id: string;
    role: string;
}