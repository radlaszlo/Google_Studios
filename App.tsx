import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { FormData, NaturalPersonData, LegalEntityData, AddressData, VehicleData, RouteData } from './types';
import { ApplicantType } from './types';
import { translations } from './constants';
import { SunIcon, MoonIcon, CheckIcon, AppLogo, HU_Flag, RO_Flag, GB_Flag, DE_Flag } from './components/Icons';
import { generatePermitPdf } from './services/pdfService';


// Helper Components defined outside to prevent re-renders
// #region Helper Components

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  min?: string;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, value, onChange, type = 'text', required = true, min }) => {
  const isValid = !required || value.trim() !== '';
  return (
    <div className="relative w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        min={min}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
          isValid ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500'
        }`}
      />
      {isValid && required && <CheckIcon className="absolute right-3 top-9 h-5 w-5 text-green-500" />}
    </div>
  );
};

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({ id, label, value, onChange, children, required = true }) => {
    const isValid = !required || value.trim() !== '';
    return (
        <div className="relative w-full">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <select
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    isValid ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500'
                }`}
            >
                {children}
            </select>
            {isValid && required && <CheckIcon className="absolute right-3 top-9 h-5 w-5 text-green-500" />}
        </div>
    );
};

interface CheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange }) => (
    <div className="flex items-center">
        <input
            id={id}
            name={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor={id} className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
            {label}
        </label>
    </div>
);

// #endregion Helper Components

// FIX: Created ObjectKeys utility type to ensure handleFormChange is only called with keys corresponding to object values in FormData, preventing spread operator errors on primitives.
type ObjectKeys<T> = { [K in keyof T]: T[K] extends object ? K : never }[keyof T];

const App: React.FC = () => {
    // #region State Management
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('theme');
        return (savedTheme === 'dark' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? 'dark' : 'light';
    });
    const [language, setLanguage] = useState<'hu' | 'ro' | 'en' | 'de'>(() => (localStorage.getItem('language') as any) || 'hu');
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');


    const initialFormData: FormData = {
        applicantType: ApplicantType.NATURAL_PERSON,
        naturalPerson: { lastName: '', firstName: '', cnp: '', email: '', phone: '' },
        legalEntity: { companyName: '', taxId: '', orcNumber: '', companyEmail: '', companyPhone: '', representativeLastName: '', representativeFirstName: '', representativeStatus: '', representativeEmail: '', representativePhone: '' },
        address: { street: '', number: '', building: '', staircase: '', apartment: '', city: '', county: '' },
        step1Agreements: { dataCorrect: false, communication: false },
        vehicle: { brand: '', category: '', licensePlate: '', maxWeight: '', vin: '', registrationDocument: null },
        route: { shipmentType: '', routeDescription: '', zone: '', startDate: '', startTime: '', period: '' },
        price: 150, // Example price
        step2Agreement: { dataCorrect: false },
        step3Agreement: { dataCorrect: false },
    };

    const [formData, setFormData] = useState<FormData>(() => {
        const savedData = sessionStorage.getItem('formData');
        return savedData ? JSON.parse(savedData) : initialFormData;
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    useEffect(() => {
        sessionStorage.setItem('formData', JSON.stringify(formData));
    }, [formData]);

    const t = useCallback((key: string): string => {
        return (translations[language] as any)[key] || key;
    }, [language]);
    
    // #endregion

    // #region Navigation & Form Logic
    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const resetForm = () => {
        setFormData(initialFormData);
        setCurrentStep(1);
        setPaymentStatus('idle');
    };

    const handleFormChange = <T extends ObjectKeys<FormData>>(section: T, data: Partial<FormData[T]>) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], ...data }
        }));
    };

    const handleInputChange = (section: keyof FormData, subkey: keyof any) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        handleFormChange(section as any, { [subkey]: e.target.value });
    };

    const handleCheckboxChange = (section: keyof FormData, subkey: keyof any) => (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFormChange(section as any, { [subkey]: e.target.checked });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFormChange('vehicle', { registrationDocument: e.target.files[0] });
        }
    };
    
    const calculatePrice = useCallback(() => {
        // This is a placeholder for the real price calculation logic
        // FIX: Removed `maxWeight` from `formData.route` destructuring as it is part of `formData.vehicle`.
        const { zone, period } = formData.route;
        let basePrice = 50;
        if (zone === 'A') basePrice += 20;
        if (zone === 'B') basePrice += 10;
        
        const weight = parseFloat(formData.vehicle.maxWeight);
        if(!isNaN(weight) && weight > 10) basePrice += (weight-10)*5;
        
        switch (period) {
            case 'monthly': basePrice *= 20; break;
            case 'semi-annually': basePrice *= 100; break;
            case 'annually': basePrice *= 180; break;
            default: break; // daily
        }
        setFormData(prev => ({...prev, price: Math.round(basePrice)}));
    }, [formData.route, formData.vehicle.maxWeight]);

    useEffect(() => {
        calculatePrice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.route.zone, formData.route.period, formData.vehicle.maxWeight]);


    // #endregion

    // #region Step Validation
    
    const isStep1Valid = useMemo(() => {
        const { applicantType, naturalPerson, legalEntity, address, step1Agreements } = formData;
        
        const requiredAddressFields: (keyof AddressData)[] = ['street', 'number', 'city', 'county'];
        const addressFieldsValid = requiredAddressFields.every(key => {
            const value = address[key];
            return typeof value === 'string' && value.trim() !== '';
        });

        if (!addressFieldsValid || !step1Agreements.dataCorrect) return false;

        if (applicantType === ApplicantType.NATURAL_PERSON) {
            return Object.values(naturalPerson).every(v => typeof v === 'string' && v.trim() !== '');
        } else {
            return Object.values(legalEntity).every(v => typeof v === 'string' && v.trim() !== '');
        }
    }, [formData]);

    const isStep2Valid = useMemo(() => {
        const { vehicle, route, step2Agreement } = formData;
        const vehicleFields = ['brand', 'category', 'licensePlate', 'maxWeight', 'vin'].every(key => vehicle[key as keyof VehicleData]?.toString().trim() !== '');
        const routeFields = Object.values(route).every(v => v.toString().trim() !== '');
        return vehicleFields && vehicle.registrationDocument !== null && routeFields && step2Agreement.dataCorrect;
    }, [formData]);

    const isStep3Valid = useMemo(() => formData.step3Agreement.dataCorrect, [formData.step3Agreement.dataCorrect]);
    
    // #endregion

    // #region Render Components
    
    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1 formData={formData} setFormData={setFormData} t={t} nextStep={nextStep} isValid={isStep1Valid} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} />;
            case 2: return <Step2 formData={formData} t={t} nextStep={nextStep} prevStep={prevStep} isValid={isStep2Valid} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} handleFileChange={handleFileChange} />;
            case 3: return <Step3 formData={formData} t={t} nextStep={nextStep} prevStep={prevStep} isValid={isStep3Valid} handleCheckboxChange={handleCheckboxChange} />;
            case 4: return <Step4 t={t} nextStep={nextStep} resetForm={resetForm} paymentStatus={paymentStatus} setPaymentStatus={setPaymentStatus} />;
            case 5: return <Step5 t={t} formData={formData} />;
            default: return <div>Error</div>;
        }
    };
    
    return (
        <div className="bg-gray-100 dark:bg-[#0F1A16] min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans">
            {/* Header */}
            <header className="bg-white dark:bg-[#18261F] shadow-md sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                         <div className="flex items-center space-x-4">
                            <AppLogo className="h-14 w-14 text-gray-800 dark:text-gray-200" />
                            <div>
                                <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t('header_title')}</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{t('header_subtitle')}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Language Switcher */}
                            <div className="flex items-center space-x-2">
                                {(['hu', 'ro', 'en', 'de'] as const).map(lang => (
                                    <button key={lang} onClick={() => setLanguage(lang)} className={`w-8 h-6 rounded-sm overflow-hidden transition-transform duration-200 transform hover:scale-110 ${language === lang ? 'ring-2 ring-offset-2 ring-green-500 dark:ring-offset-gray-800' : ''}`}>
                                        {lang === 'hu' && <HU_Flag className="w-full h-full" />}
                                        {lang === 'ro' && <RO_Flag className="w-full h-full" />}
                                        {lang === 'en' && <GB_Flag className="w-full h-full" />}
                                        {lang === 'de' && <DE_Flag className="w-full h-full" />}
                                    </button>
                                ))}
                            </div>
                            {/* Theme Toggle */}
                            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-center mb-4">{t('app_title')}</h1>
                {/* Step Indicator */}
                <div className="w-full max-w-2xl mx-auto mb-8">
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((step, index) => (
                            <React.Fragment key={step}>
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${currentStep >= step ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200'}`}>
                                        {currentStep > step ? <CheckIcon className="w-6 h-6"/> : step}
                                    </div>
                                </div>
                                {index < 4 && <div className={`flex-auto border-t-4 transition-colors duration-500 ${currentStep > step ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'}`}></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white dark:bg-[#18261F] rounded-lg shadow-xl p-6 sm:p-8 max-w-4xl mx-auto">
                    {renderStep()}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-[#18261F] mt-auto py-4 shadow-inner">
                <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
                    <p>&copy; {t('footer_text')}</p>
                </div>
            </footer>
        </div>
    );
};


// Step Components defined outside App to prevent re-renders on App state changes
// #region Step Components

// FIX: Added `setFormData` to the props to resolve an assignment error and allow direct state updates from the child component.
const Step1 = ({ formData, setFormData, t, nextStep, isValid, handleInputChange, handleCheckboxChange } : { formData: FormData, setFormData: React.Dispatch<React.SetStateAction<FormData>>, t: (key: string) => string, nextStep: () => void, isValid: boolean, handleInputChange: any, handleCheckboxChange: any }) => {
    
    const clearFields = () => {
        // This is a simplified clear, a full implementation would use setFormData to reset step 1 fields
        console.log("Clearing fields for Step 1");
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">{t('step1_title')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* FIX: Replaced incorrect usage of `handleInputChange` with a direct state update using `setFormData` for the top-level `applicantType` property. */}
                 <SelectField id="applicantType" label={t('applicant_type')} value={formData.applicantType} onChange={(e) => setFormData(prev => ({...prev, applicantType: e.target.value as ApplicantType}))}>
                    <option value={ApplicantType.NATURAL_PERSON}>{t('natural_person')}</option>
                    <option value={ApplicantType.LEGAL_ENTITY}>{t('legal_entity')}</option>
                </SelectField>
            </div>
            
            {formData.applicantType === ApplicantType.NATURAL_PERSON ? (
                <div className="p-4 border rounded-md dark:border-gray-600 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField id="lastName" label={t('last_name')} value={formData.naturalPerson.lastName} onChange={handleInputChange('naturalPerson', 'lastName')} />
                        <InputField id="firstName" label={t('first_name')} value={formData.naturalPerson.firstName} onChange={handleInputChange('naturalPerson', 'firstName')} />
                        <InputField id="cnp" label={t('cnp')} value={formData.naturalPerson.cnp} onChange={handleInputChange('naturalPerson', 'cnp')} />
                        <InputField id="email" label={t('email')} type="email" value={formData.naturalPerson.email} onChange={handleInputChange('naturalPerson', 'email')} />
                        <InputField id="phone" label={t('phone')} type="tel" value={formData.naturalPerson.phone} onChange={handleInputChange('naturalPerson', 'phone')} />
                    </div>
                </div>
            ) : (
                <div className="p-4 border rounded-md dark:border-gray-600 space-y-4">
                     <h3 className="text-lg font-medium">{t('company_data')}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField id="companyName" label={t('company_name')} value={formData.legalEntity.companyName} onChange={handleInputChange('legalEntity', 'companyName')} />
                        <InputField id="taxId" label={t('tax_id')} value={formData.legalEntity.taxId} onChange={handleInputChange('legalEntity', 'taxId')} />
                        <InputField id="orcNumber" label={t('orc_number')} value={formData.legalEntity.orcNumber} onChange={handleInputChange('legalEntity', 'orcNumber')} />
                        <InputField id="companyEmail" label={t('company_email')} type="email" value={formData.legalEntity.companyEmail} onChange={handleInputChange('legalEntity', 'companyEmail')} />
                        <InputField id="companyPhone" label={t('company_phone')} type="tel" value={formData.legalEntity.companyPhone} onChange={handleInputChange('legalEntity', 'companyPhone')} />
                     </div>
                     <h3 className="text-lg font-medium pt-4">{t('rep_data')}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField id="repLastName" label={t('rep_last_name')} value={formData.legalEntity.representativeLastName} onChange={handleInputChange('legalEntity', 'representativeLastName')} />
                        <InputField id="repFirstName" label={t('rep_first_name')} value={formData.legalEntity.representativeFirstName} onChange={handleInputChange('legalEntity', 'representativeFirstName')} />
                        <InputField id="repStatus" label={t('rep_status')} value={formData.legalEntity.representativeStatus} onChange={handleInputChange('legalEntity', 'representativeStatus')} />
                        <InputField id="repEmail" label={t('rep_email')} type="email" value={formData.legalEntity.representativeEmail} onChange={handleInputChange('legalEntity', 'representativeEmail')} />
                        <InputField id="repPhone" label={t('rep_phone')} type="tel" value={formData.legalEntity.representativePhone} onChange={handleInputChange('legalEntity', 'representativePhone')} />
                    </div>
                </div>
            )}
            
            <div className="p-4 border rounded-md dark:border-gray-600 space-y-4">
                <h3 className="text-lg font-medium">{t('address_section')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField id="street" label={t('street')} value={formData.address.street} onChange={handleInputChange('address', 'street')} />
                    <InputField id="number" label={t('number')} value={formData.address.number} onChange={handleInputChange('address', 'number')} />
                    <InputField id="building" label={t('building')} value={formData.address.building} onChange={handleInputChange('address', 'building')} required={false} />
                    <InputField id="staircase" label={t('staircase')} value={formData.address.staircase} onChange={handleInputChange('address', 'staircase')} required={false}/>
                    <InputField id="apartment" label={t('apartment')} value={formData.address.apartment} onChange={handleInputChange('address', 'apartment')} required={false}/>
                    <InputField id="city" label={t('city')} value={formData.address.city} onChange={handleInputChange('address', 'city')} />
                    <InputField id="county" label={t('county')} value={formData.address.county} onChange={handleInputChange('address', 'county')} />
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <Checkbox id="dataCorrect1" label={t('data_correct_agreement')} checked={formData.step1Agreements.dataCorrect} onChange={handleCheckboxChange('step1Agreements', 'dataCorrect')} />
                <Checkbox id="communication" label={t('communication_agreement')} checked={formData.step1Agreements.communication} onChange={handleCheckboxChange('step1Agreements', 'communication')} />
            </div>

            <div className="flex justify-between items-center pt-6">
                <div className="w-1/3"></div> {/* Spacer */}
                <div className="w-1/3 flex justify-center">
                     <button onClick={clearFields} className="px-6 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
                        {t('clear_fields')}
                    </button>
                </div>
                <div className="w-1/3 flex justify-end">
                    <button onClick={nextStep} disabled={!isValid} className={`px-6 py-2 rounded-md font-semibold text-white transition-colors ${isValid ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 cursor-not-allowed'}`}>
                        {t('next')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Step2 = ({ formData, t, nextStep, prevStep, isValid, handleInputChange, handleCheckboxChange, handleFileChange }: { formData: FormData, t: (key: string) => string, nextStep: () => void, prevStep: () => void, isValid: boolean, handleInputChange: any, handleCheckboxChange: any, handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {

    const clearFields = () => { console.log("Clearing fields for Step 2"); };
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">{t('step2_title')}</h2>
            
            <div className="p-4 border rounded-md dark:border-gray-600 space-y-4">
                <h3 className="text-lg font-medium">{t('vehicle_data')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField id="brand" label={t('brand')} value={formData.vehicle.brand} onChange={handleInputChange('vehicle', 'brand')} />
                    <InputField id="category" label={t('category')} value={formData.vehicle.category} onChange={handleInputChange('vehicle', 'category')} />
                    <InputField id="licensePlate" label={t('license_plate')} value={formData.vehicle.licensePlate} onChange={handleInputChange('vehicle', 'licensePlate')} />
                    <InputField id="maxWeight" label={t('max_weight')} type="number" value={formData.vehicle.maxWeight} onChange={handleInputChange('vehicle', 'maxWeight')} />
                    <InputField id="vin" label={t('vin')} value={formData.vehicle.vin} onChange={handleInputChange('vehicle', 'vin')} />
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('registration_document')}</label>
                        <label htmlFor="file-upload" className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${formData.vehicle.registrationDocument ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                            {t('upload')}
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                        </label>
                        {formData.vehicle.registrationDocument && <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">{formData.vehicle.registrationDocument.name}</span>}
                    </div>
                </div>
            </div>
            
             <div className="p-4 border rounded-md dark:border-gray-600 space-y-4">
                <h3 className="text-lg font-medium">{t('shipment_type_section')}</h3>
                <InputField id="shipmentType" label={t('shipment_type')} value={formData.route.shipmentType} onChange={handleInputChange('route', 'shipmentType')} />
            </div>

            <div className="p-4 border rounded-md dark:border-gray-600 space-y-4">
                <h3 className="text-lg font-medium">{t('route_section')}</h3>
                 <InputField id="routeDescription" label={t('route_description')} value={formData.route.routeDescription} onChange={handleInputChange('route', 'routeDescription')} />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <SelectField id="zone" label={t('zone')} value={formData.route.zone} onChange={handleInputChange('route', 'zone')}>
                        <option value="">{t('select_zone')}</option>
                        <option value="A">{t('zone_a')}</option>
                        <option value="B">{t('zone_b')}</option>
                    </SelectField>
                     <a href="https://www.google.com/maps/place/Odorheiu+Secuiesc" target="_blank" rel="noopener noreferrer" className="px-4 py-2 h-10 text-center rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        {t('city_map_button')}
                    </a>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField id="startDate" label={t('start_date')} type="date" value={formData.route.startDate} onChange={handleInputChange('route', 'startDate')} min={today} />
                    <InputField id="startTime" label={t('start_time')} type="time" value={formData.route.startTime} onChange={handleInputChange('route', 'startTime')} />
                     <SelectField id="period" label={t('period')} value={formData.route.period} onChange={handleInputChange('route', 'period')}>
                        <option value="">{t('select_period')}</option>
                        <option value="daily">{t('daily')}</option>
                        <option value="monthly">{t('monthly')}</option>
                        <option value="semi-annually">{t('semi_annually')}</option>
                        <option value="annually">{t('annually')}</option>
                    </SelectField>
                </div>
                <p className="text-red-500 font-bold text-lg">{t('permit_price')} {formData.price} RON</p>
            </div>
            
            <div className="space-y-4 pt-4">
                <Checkbox id="dataCorrect2" label={t('data_correct_agreement')} checked={formData.step2Agreement.dataCorrect} onChange={handleCheckboxChange('step2Agreement', 'dataCorrect')} />
            </div>

            <div className="flex justify-between items-center pt-6">
                <button onClick={prevStep} className="px-6 py-2 rounded-md font-semibold text-white bg-gray-500 hover:bg-gray-600 transition-colors">
                    {t('back')}
                </button>
                <button onClick={clearFields} className="px-6 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
                    {t('clear_fields')}
                </button>
                <button onClick={nextStep} disabled={!isValid} className={`px-6 py-2 rounded-md font-semibold text-white transition-colors ${isValid ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 cursor-not-allowed'}`}>
                    {t('next')}
                </button>
            </div>
        </div>
    )
};

const SummaryRow: React.FC<{label: string, value?: string | number | null}> = ({label, value}) => (
    value ? <div className="py-2 px-4 flex justify-between odd:bg-gray-100 dark:odd:bg-gray-700"><dt className="font-medium text-gray-600 dark:text-gray-300">{label}:</dt><dd className="text-gray-900 dark:text-gray-100">{value}</dd></div> : null
);


const Step3 = ({ formData, t, nextStep, prevStep, isValid, handleCheckboxChange }: { formData: FormData, t: (key: string) => string, nextStep: () => void, prevStep: () => void, isValid: boolean, handleCheckboxChange: any }) => {
    const isNatural = formData.applicantType === ApplicantType.NATURAL_PERSON;
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">{t('step3_title')}</h2>
            <p>{t('summary_description')}</p>
            <div className="space-y-4 border rounded-md dark:border-gray-600 p-4">
                <dl className="divide-y divide-gray-200 dark:divide-gray-600">
                    <SummaryRow label={t('applicant_type')} value={isNatural ? t('natural_person') : t('legal_entity')} />
                    {isNatural ? (
                        <>
                           <SummaryRow label={t('last_name')} value={formData.naturalPerson.lastName} />
                           <SummaryRow label={t('first_name')} value={formData.naturalPerson.firstName} />
                           <SummaryRow label={t('cnp')} value={formData.naturalPerson.cnp} />
                           <SummaryRow label={t('email')} value={formData.naturalPerson.email} />
                        </>
                    ) : (
                        <>
                           <SummaryRow label={t('company_name')} value={formData.legalEntity.companyName} />
                           <SummaryRow label={t('tax_id')} value={formData.legalEntity.taxId} />
                           <SummaryRow label={t('rep_last_name')} value={formData.legalEntity.representativeLastName} />
                        </>
                    )}
                    <SummaryRow label={t('street')} value={`${formData.address.street} ${formData.address.number}`} />
                    <SummaryRow label={t('city')} value={formData.address.city} />

                    <SummaryRow label={t('brand')} value={formData.vehicle.brand} />
                    <SummaryRow label={t('license_plate')} value={formData.vehicle.licensePlate} />
                    <SummaryRow label={t('max_weight')} value={`${formData.vehicle.maxWeight} t`} />
                    <SummaryRow label={t('route_description')} value={formData.route.routeDescription} />
                    <SummaryRow label={t('period')} value={t(formData.route.period)} />
                    <SummaryRow label={t('permit_price')} value={`${formData.price} RON`} />
                </dl>
            </div>

            <div className="space-y-4 pt-4">
                <Checkbox id="dataCorrect3" label={t('data_correct_agreement')} checked={formData.step3Agreement.dataCorrect} onChange={handleCheckboxChange('step3Agreement', 'dataCorrect')} />
            </div>
            <div className="flex justify-between items-center pt-6">
                <button onClick={prevStep} className="px-6 py-2 rounded-md font-semibold text-white bg-gray-500 hover:bg-gray-600 transition-colors">
                    {t('back')}
                </button>
                 <button onClick={nextStep} disabled={!isValid} className={`px-6 py-2 rounded-md font-semibold text-white transition-colors ${isValid ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 cursor-not-allowed'}`}>
                    {t('next')}
                </button>
            </div>
        </div>
    );
};

const Step4 = ({ t, nextStep, resetForm, paymentStatus, setPaymentStatus }: { t: (key: string) => string, nextStep: () => void, resetForm: () => void, paymentStatus: 'idle' | 'processing' | 'success' | 'failed', setPaymentStatus: React.Dispatch<React.SetStateAction<'idle' | 'processing' | 'success' | 'failed'>> }) => {
    
    const handlePayment = (success: boolean) => {
        setPaymentStatus('processing');
        // Here you would call an actual payment API and your backend to save data.
        // We simulate it with a timeout.
        setTimeout(() => {
            if (success) {
                // Mock API call to save data
                // apiService.savePermit(formData).then(...)
                setPaymentStatus('success');
                setTimeout(() => nextStep(), 1500);
            } else {
                setPaymentStatus('failed');
            }
        }, 2000);
    };

    return (
        <div className="text-center space-y-6 py-8">
            <h2 className="text-2xl font-semibold">{t('step4_title')}</h2>
            
            {paymentStatus === 'idle' && (
                <div className="flex justify-center space-x-4">
                    <button onClick={() => handlePayment(true)} className="px-6 py-3 rounded-md font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors">
                        {t('simulate_success')}
                    </button>
                     <button onClick={() => handlePayment(false)} className="px-6 py-3 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
                        {t('simulate_failure')}
                    </button>
                </div>
            )}

            {paymentStatus === 'processing' && (
                <div>
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                     <p className="mt-4 text-lg">{t('payment_processing')}</p>
                </div>
            )}
             {paymentStatus === 'success' && (
                <div>
                    <CheckIcon className="h-16 w-16 text-green-500 mx-auto" />
                    <p className="mt-4 text-xl font-semibold text-green-500">{t('payment_successful')}</p>
                </div>
            )}

            {paymentStatus === 'failed' && (
                <div>
                    <p className="text-xl font-semibold text-red-500">{t('payment_failed')}</p>
                    <p className="mt-2">{t('payment_failed_message')}</p>
                     <button onClick={resetForm} className="mt-6 px-6 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        {t('start_over')}
                    </button>
                </div>
            )}
        </div>
    );
};

const Step5 = ({ t, formData }: { t: (key: string) => string, formData: FormData }) => {
    
    const handleDownload = () => {
        generatePermitPdf(formData, t);
    };

    return (
         <div className="text-center space-y-6 py-8">
            <h2 className="text-2xl font-semibold">{t('step5_title')}</h2>
            <CheckIcon className="h-16 w-16 text-green-500 mx-auto" />
            <p className="text-xl font-semibold text-green-500">{t('permit_generation_success')}</p>
            <p className="max-w-md mx-auto">{t('permit_info')}</p>
             <button onClick={handleDownload} className="px-8 py-3 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors text-lg">
                {t('download_permit')}
            </button>
        </div>
    );
};


// #endregion Step Components


export default App;