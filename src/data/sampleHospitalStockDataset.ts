// Realistic 1,000+ records generator for Hospital Stock, Consumption & Demand Telemetry
export interface HospitalStockRecord {
  Date: string;
  Hospital_ID: string;
  Department: string;
  Medicine_Name: string;
  Category: string;
  Opening_Stock: number;
  Stock_Received: number;
  Stock_Consumed: number;
  Closing_Stock: number;
  Reorder_Level: number;
  Unit_Price: number;
  Temperature: number;
  Humidity: number;
  Lead_Time_Days: number;
  Supplier: string;
  Demand: number;
}

export function generateSampleHospitalStockCSV(): string {
  const departments = ['Emergency', 'ICU', 'General Medicine', 'Pediatrics', 'Oncology', 'Cardiology'];
  const hospitals = ['HOSP-01 (Apex Metro)', 'HOSP-02 (Central Civil)', 'HOSP-03 (River Delta)', 'HOSP-04 (Suburban West)', 'HOSP-05 (Memorial North)'];
  
  const medicines = [
    { name: 'Paracetamol 500mg Tablets', category: 'Analgesic', price: 0.45, baseDemand: 340, reorder: 800, coldChain: false },
    { name: 'Amoxicillin 500mg Capsules', category: 'Antibiotic', price: 1.20, baseDemand: 190, reorder: 500, coldChain: false },
    { name: 'Human Insulin Regular 100IU', category: 'Antidiabetic', price: 14.50, baseDemand: 85, reorder: 250, coldChain: true },
    { name: 'Ceftriaxone 1g Injectable', category: 'Antibiotic', price: 4.80, baseDemand: 120, reorder: 350, coldChain: false },
    { name: 'ORS Electrolyte Sachets', category: 'Rehydration', price: 0.30, baseDemand: 420, reorder: 950, coldChain: false },
    { name: 'Azithromycin 250mg Tablets', category: 'Antibiotic', price: 2.10, baseDemand: 140, reorder: 400, coldChain: false },
    { name: 'Ibuprofen 400mg Tablets', category: 'Analgesic', price: 0.60, baseDemand: 220, reorder: 600, coldChain: false },
    { name: 'Metformin 500mg Tablets', category: 'Antidiabetic', price: 0.85, baseDemand: 160, reorder: 450, coldChain: false },
    { name: 'Pantoprazole 40mg Vials', category: 'Gastrointestinal', price: 3.40, baseDemand: 110, reorder: 300, coldChain: false },
    { name: 'Salbutamol Inhaler 100mcg', category: 'Respiratory', price: 6.50, baseDemand: 75, reorder: 200, coldChain: false },
    { name: 'Dextrose 5% IV Infusion 500ml', category: 'IV Fluids', price: 2.25, baseDemand: 310, reorder: 750, coldChain: false },
    { name: 'Ondansetron 4mg Injectable', category: 'Gastrointestinal', price: 2.80, baseDemand: 95, reorder: 280, coldChain: false }
  ];

  const suppliers = [
    'Apollo Medical Depot',
    'Sun Pharma Logistics',
    'Pfizer Health Supply',
    'MedSupply Express',
    'CarePoint Distribution'
  ];

  const headers = [
    'Date',
    'Hospital_ID',
    'Department',
    'Medicine_Name',
    'Category',
    'Opening_Stock',
    'Stock_Received',
    'Stock_Consumed',
    'Closing_Stock',
    'Reorder_Level',
    'Unit_Price',
    'Temperature',
    'Humidity',
    'Lead_Time_Days',
    'Supplier',
    'Demand'
  ];

  const rows: string[] = [];
  rows.push(headers.join(','));

  const startDate = new Date('2025-06-01');
  const totalDays = 90; // 90 days across 12 medicines & facilities = >1080 rows

  let rowCount = 0;

  for (let d = 0; d < totalDays; d++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + d);
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Seasonal factor (higher consumption in monsoonal/flu periods)
    const seasonalFactor = 1.0 + Math.sin(d / 14) * 0.22;

    for (let m = 0; m < medicines.length; m++) {
      const med = medicines[m];
      const hosp = hospitals[m % hospitals.length];
      const dept = departments[(m + d) % departments.length];
      const supp = suppliers[(m * 2 + d) % suppliers.length];

      // Demand calculation (correlated with weekday, seasonality, and category)
      const weekendDampener = isWeekend ? 0.78 : 1.15;
      const noise = ((rowCount * 17) % 31) - 15;
      const actualDemand = Math.max(15, Math.round(med.baseDemand * seasonalFactor * weekendDampener + noise));

      // Stock dynamics
      const openingStock = Math.max(200, Math.round(med.reorder * 1.6 + ((rowCount * 23) % 400) - 200));
      
      // Shipment received every 7-10 days
      const isReplenishmentDay = (d + m) % 8 === 0;
      const stockReceived = isReplenishmentDay ? Math.round(med.reorder * 1.2) : 0;
      
      // Stock consumed is close to demand, capped by available inventory
      const stockConsumed = Math.min(openingStock + stockReceived, Math.round(actualDemand * 0.95 + ((rowCount % 7) - 3)));
      const closingStock = openingStock + stockReceived - stockConsumed;

      // Telemetry
      const temp = med.coldChain 
        ? Number((4.2 + Math.sin(d) * 1.5).toFixed(1))
        : Number((26.5 + Math.cos(d / 5) * 4.0).toFixed(1));
      
      const humidity = Math.round(58 + Math.sin(d / 3) * 18);
      const leadTime = 3 + (m % 5);

      // Add a couple of realistic raw imperfections for cleaning demo
      let dateVal = dateStr;
      let openVal: any = openingStock;
      let consumeVal: any = stockConsumed;
      let deptVal = dept;

      if (rowCount === 42) {
        openVal = ''; // missing value
      } else if (rowCount === 87) {
        consumeVal = -15; // invalid negative
      } else if (rowCount === 150) {
        deptVal = ''; // missing categorical
      }

      const row = [
        dateVal,
        `"${hosp}"`,
        `"${deptVal}"`,
        `"${med.name}"`,
        `"${med.category}"`,
        openVal,
        stockReceived,
        consumeVal,
        closingStock,
        med.reorder,
        med.price.toFixed(2),
        temp,
        humidity,
        leadTime,
        `"${supp}"`,
        actualDemand
      ];

      rows.push(row.join(','));
      rowCount++;

      // Introduce 3 intentional duplicate rows across the 1000+ items to showcase real deduplication
      if (rowCount === 210 || rowCount === 540 || rowCount === 820) {
        rows.push(row.join(',')); // exact duplicate
        rowCount++;
      }
    }
  }

  return rows.join('\n');
}
