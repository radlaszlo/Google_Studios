
import { FormData, ApplicantType, LegalEntityData, NaturalPersonData } from '../types';

// These are loaded from CDN in index.html
declare const jspdf: any;
declare const QRCode: any;

const generateQrCodeDataURL = (text: string): Promise<string> => {
  return new Promise((resolve) => {
    const qrCodeContainer = document.createElement('div');
    new QRCode(qrCodeContainer, {
      text: text,
      width: 128,
      height: 128,
      correctLevel: QRCode.CorrectLevel.H
    });
    
    // The QR code is generated as a canvas, we need to get its data URL
    setTimeout(() => {
        const canvas = qrCodeContainer.querySelector('canvas');
        if (canvas) {
            resolve(canvas.toDataURL('image/png'));
        } else {
            resolve(''); // fallback
        }
    }, 100); // Small delay to ensure canvas is drawn
  });
};

// Helper functions for date calculation
const isLastDayOfMonth = (d: Date): boolean => {
    // Use UTC dates to avoid timezone issues
    const testDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
    return testDate.getUTCDate() === 1;
};

const calculateEndDate = (startDateStr: string, period: 'daily' | 'monthly' | 'semi-annually' | 'annually' | ''): Date | null => {
    if (!startDateStr || !period || period === 'daily') return null;

    // Treat date string as UTC to avoid timezone shifts
    const startDate = new Date(startDateStr + 'T00:00:00Z');
    if (isNaN(startDate.getTime())) return null;

    let monthsToAdd = 0;
    switch (period) {
        case 'monthly': monthsToAdd = 1; break;
        case 'semi-annually': monthsToAdd = 6; break;
        case 'annually': monthsToAdd = 12; break;
    }

    const endDate = new Date(startDate);
    // Use UTC methods for consistency
    if (isLastDayOfMonth(startDate)) {
        endDate.setUTCMonth(endDate.getUTCMonth() + monthsToAdd + 1);
        endDate.setUTCDate(0); 
    } else {
        endDate.setUTCMonth(endDate.getUTCMonth() + monthsToAdd);
        endDate.setUTCDate(endDate.getUTCDate() - 1);
    }
    return endDate;
};


export const generatePermitPdf = async (formData: FormData, t: (key: string) => string) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();

  const isNatural = formData.applicantType === ApplicantType.NATURAL_PERSON;
  const applicant = isNatural ? formData.naturalPerson : formData.legalEntity;
  const vehicle = formData.vehicle;
  const route = formData.route;
  
  // Title
  doc.setFontSize(22);
  doc.text(t('app_title'), 105, 20, { align: 'center' });

  // QR Code Data
  const endDate = calculateEndDate(route.startDate, route.period);
  const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : route.startDate;
  const validityString = route.period === 'daily' ? `${route.startDate}` : `${route.startDate} - ${formattedEndDate}`;

  // FIX: Use type assertions to safely access properties on the 'applicant' union type, resolving errors where properties like 'lastName' did not exist on all types in the union.
  const qrCodeContent = JSON.stringify({
    applicant: isNatural ? `${(applicant as NaturalPersonData).lastName} ${(applicant as NaturalPersonData).firstName}` : (applicant as LegalEntityData).companyName,
    vehicle: `${vehicle.brand} - ${vehicle.licensePlate}`,
    route: route.routeDescription,
    price: `${formData.price} RON`,
    issueDate: new Date().toLocaleDateString(),
    validity: validityString,
  }, null, 2);

  const qrCodeDataUrl = await generateQrCodeDataURL(qrCodeContent);
  if(qrCodeDataUrl) {
    doc.addImage(qrCodeDataUrl, 'PNG', 150, 30, 50, 50);
  }

  // Applicant Data
  doc.setFontSize(16);
  doc.text(t('step1_title'), 20, 40);
  doc.setFontSize(12);
  if (isNatural) {
    const p = applicant as FormData['naturalPerson'];
    doc.text(`${t('last_name')}: ${p.lastName}`, 20, 50);
    doc.text(`${t('first_name')}: ${p.firstName}`, 20, 57);
    doc.text(`${t('cnp')}: ${p.cnp}`, 20, 64);
    doc.text(`${t('email')}: ${p.email}`, 20, 71);
  } else {
    const e = applicant as FormData['legalEntity'];
    doc.text(`${t('company_name')}: ${e.companyName}`, 20, 50);
    doc.text(`${t('tax_id')}: ${e.taxId}`, 20, 57);
    doc.text(`${t('company_email')}: ${e.companyEmail}`, 20, 64);
  }

  // Vehicle and Route Data
  doc.setFontSize(16);
  doc.text(t('step2_title'), 20, 90);
  doc.setFontSize(12);
  doc.text(`${t('brand')}: ${vehicle.brand}`, 20, 100);
  doc.text(`${t('license_plate')}: ${vehicle.licensePlate}`, 20, 107);
  doc.text(`${t('max_weight')}: ${vehicle.maxWeight} t`, 20, 114);
  doc.text(`${t('route_description')}: ${route.routeDescription}`, 20, 121);
  doc.text(`${t('zone')}: ${route.zone}`, 20, 128);

  // Validity and Price
  doc.setFontSize(16);
  doc.text(t('pdf_validity_fee_section'), 20, 145);
  doc.setFontSize(12);
  doc.text(`${t('start_date')}: ${route.startDate} ${route.startTime}`, 20, 155);
  doc.text(`${t('period')}: ${t(route.period)}`, 20, 162);
  doc.text(`${t('pdf_valid_range')}: ${validityString}`, 20, 169);
  doc.setFontSize(14);
  doc.setTextColor(255, 0, 0); // Red color
  doc.text(`${t('permit_price')} ${formData.price} RON`, 20, 179);
  doc.setTextColor(0, 0, 0);


  // Footer
  doc.setFontSize(10);
  doc.text(`${t('pdf_issue_date')}: ${new Date().toLocaleString()}`, 105, 280, { align: 'center' });
  
  doc.save("athaladasi_engedely.pdf");
};