
export enum ApplicantType {
  NATURAL_PERSON = 'natural_person',
  LEGAL_ENTITY = 'legal_entity',
}

export interface NaturalPersonData {
  lastName: string;
  firstName: string;
  cnp: string;
  email: string;
  phone: string;
}

export interface LegalEntityData {
  companyName: string;
  taxId: string;
  orcNumber: string;
  companyEmail: string;
  companyPhone: string;
  representativeLastName: string;
  representativeFirstName: string;
  representativeStatus: string;
  representativeEmail: string;
  representativePhone: string;
}

export interface AddressData {
  street: string;
  number: string;
  building: string;
  staircase: string;
  apartment: string;
  city: string;
  county: string;
}

export interface VehicleData {
    brand: string;
    category: string;
    licensePlate: string;
    maxWeight: string;
    vin: string;
    registrationDocument: File | null;
}

export interface RouteData {
    shipmentType: string;
    routeDescription: string;
    zone: 'A' | 'B' | '';
    startDate: string;
    startTime: string;
    period: 'daily' | 'monthly' | 'semi-annually' | 'annually' | '';
}


export interface FormData {
  applicantType: ApplicantType;
  naturalPerson: NaturalPersonData;
  legalEntity: LegalEntityData;
  address: AddressData;
  step1Agreements: {
    dataCorrect: boolean;
    communication: boolean;
  };
  vehicle: VehicleData;
  route: RouteData;
  price: number;
  step2Agreement: {
    dataCorrect: boolean;
  },
  step3Agreement: {
    dataCorrect: boolean;
  }
}
