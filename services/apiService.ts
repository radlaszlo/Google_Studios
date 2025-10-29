// NOTE: This code is intended to run on a backend server (e.g., Node.js with Express).
// It is NOT safe to run database connection code directly in the browser.
// This file simulates a backend API endpoint that the frontend would call.

import { FormData, ApplicantType } from '../types';
// In a real backend, you would import the dbConfig and a library like 'mssql'.
// import { dbConfig } from '../config/db_config';
// import sql from 'mssql';

export const savePermitApplication = async (formData: FormData): Promise<{ success: boolean; message: string }> => {
    console.log("Simulating saving data to the database...");
    console.log("Database Name: AutorizatieLiberaTrecere");
    
    // In a real application, you wouldn't log the whole form data for security reasons,
    // but for simulation purposes, it's useful.
    console.log("Data to save:", {
        ...formData,
        vehicle: {
            ...formData.vehicle,
            // Avoid logging file content
            registrationDocument: formData.vehicle.registrationDocument ? formData.vehicle.registrationDocument.name : null,
        }
    });

    // IN A REAL BACKEND, THE IMPLEMENTATION WOULD BE LIKE THIS:
    /*
    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        
        // Add all form fields as parameters to prevent SQL injection
        request.input('ApplicantType', sql.NVarChar, formData.applicantType);
        
        // Conditional inputs based on applicant type
        if (formData.applicantType === ApplicantType.NATURAL_PERSON) {
            request.input('NaturalPersonLastName', sql.NVarChar, formData.naturalPerson.lastName);
            request.input('NaturalPersonFirstName', sql.NVarChar, formData.naturalPerson.firstName);
            request.input('NaturalPersonCNP', sql.NVarChar, formData.naturalPerson.cnp);
            request.input('NaturalPersonEmail', sql.NVarChar, formData.naturalPerson.email);
            request.input('NaturalPersonPhone', sql.NVarChar, formData.naturalPerson.phone);
        } else {
            request.input('LegalEntityCompanyName', sql.NVarChar, formData.legalEntity.companyName);
            request.input('LegalEntityTaxId', sql.NVarChar, formData.legalEntity.taxId);
            request.input('LegalEntityOrcNumber', sql.NVarChar, formData.legalEntity.orcNumber);
            request.input('LegalEntityCompanyEmail', sql.NVarChar, formData.legalEntity.companyEmail);
            request.input('LegalEntityCompanyPhone', sql.NVarChar, formData.legalEntity.companyPhone);
            request.input('LegalEntityRepLastName', sql.NVarChar, formData.legalEntity.representativeLastName);
            request.input('LegalEntityRepFirstName', sql.NVarChar, formData.legalEntity.representativeFirstName);
            request.input('LegalEntityRepStatus', sql.NVarChar, formData.legalEntity.representativeStatus);
            request.input('LegalEntityRepEmail', sql.NVarChar, formData.legalEntity.representativeEmail);
            request.input('LegalEntityRepPhone', sql.NVarChar, formData.legalEntity.representativePhone);
        }

        // Address
        request.input('AddressStreet', sql.NVarChar, formData.address.street);
        request.input('AddressNumber', sql.NVarChar, formData.address.number);
        request.input('AddressBuilding', sql.NVarChar, formData.address.building || null);
        request.input('AddressStaircase', sql.NVarChar, formData.address.staircase || null);
        request.input('AddressApartment', sql.NVarChar, formData.address.apartment || null);
        request.input('AddressCity', sql.NVarChar, formData.address.city);
        request.input('AddressCounty', sql.NVarChar, formData.address.county);
        
        // Vehicle
        request.input('VehicleBrand', sql.NVarChar, formData.vehicle.brand);
        request.input('VehicleCategory', sql.NVarChar, formData.vehicle.category);
        request.input('VehicleLicensePlate', sql.NVarChar, formData.vehicle.licensePlate);
        request.input('VehicleMaxWeight', sql.Decimal(10, 2), parseFloat(formData.vehicle.maxWeight));
        request.input('VehicleVIN', sql.NVarChar, formData.vehicle.vin);
        request.input('VehicleRegistrationDocumentName', sql.NVarChar, formData.vehicle.registrationDocument ? formData.vehicle.registrationDocument.name : null);

        // Route
        request.input('RouteShipmentType', sql.NVarChar, formData.route.shipmentType);
        request.input('RouteDescription', sql.NVarChar, formData.route.routeDescription);
        request.input('RouteZone', sql.NVarChar, formData.route.zone);
        request.input('RouteStartDate', sql.Date, new Date(formData.route.startDate));
        request.input('RouteStartTime', sql.Time, formData.route.startTime);
        request.input('RoutePeriod', sql.NVarChar, formData.route.period);

        // Price
        request.input('PermitPrice', sql.Decimal(18, 2), formData.price);

        const query = `
            INSERT INTO PermitApplications (
                ApplicantType, NaturalPersonLastName, NaturalPersonFirstName, NaturalPersonCNP, NaturalPersonEmail, NaturalPersonPhone,
                LegalEntityCompanyName, LegalEntityTaxId, LegalEntityOrcNumber, LegalEntityCompanyEmail, LegalEntityCompanyPhone, 
                LegalEntityRepLastName, LegalEntityRepFirstName, LegalEntityRepStatus, LegalEntityRepEmail, LegalEntityRepPhone,
                AddressStreet, AddressNumber, AddressBuilding, AddressStaircase, AddressApartment, AddressCity, AddressCounty,
                VehicleBrand, VehicleCategory, VehicleLicensePlate, VehicleMaxWeight, VehicleVIN, VehicleRegistrationDocumentName,
                RouteShipmentType, RouteDescription, RouteZone, RouteStartDate, RouteStartTime, RoutePeriod, PermitPrice
            ) VALUES (
                @ApplicantType, @NaturalPersonLastName, @NaturalPersonFirstName, @NaturalPersonCNP, @NaturalPersonEmail, @NaturalPersonPhone,
                @LegalEntityCompanyName, @LegalEntityTaxId, @LegalEntityOrcNumber, @LegalEntityCompanyEmail, @LegalEntityCompanyPhone,
                @LegalEntityRepLastName, @LegalEntityRepFirstName, @LegalEntityRepStatus, @LegalEntityRepEmail, @LegalEntityRepPhone,
                @AddressStreet, @AddressNumber, @AddressBuilding, @AddressStaircase, @AddressApartment, @AddressCity, @AddressCounty,
                @VehicleBrand, @VehicleCategory, @VehicleLicensePlate, @VehicleMaxWeight, @VehicleVIN, @VehicleRegistrationDocumentName,
                @RouteShipmentType, @RouteDescription, @RouteZone, @RouteStartDate, @RouteStartTime, @RoutePeriod, @PermitPrice
            )
        `;

        await request.query(query);
        console.log("Data saved successfully to the database.");
        return { success: true, message: "Application saved successfully." };

    } catch (err) {
        console.error('Database error:', err);
        return { success: false, message: "Failed to save application to the database." };
    } finally {
        await sql.close();
    }
    */

    // For this simulation, we'll just return success after a short delay.
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, message: "Application saved successfully (simulation)." });
        }, 500);
    });
};
