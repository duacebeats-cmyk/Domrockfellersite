import fs from 'fs';
import path from 'path';

const rawCars = [
  { name: 'Fiat Mobi Like', year: '2024', price: 25000, category: 'Hatch / Econômico', highlight: 'ATÉ R$ 35 MIL' },
  { name: 'Hyundai HB20 Hatch Sense', year: '2025', price: 38000, category: 'Hatch Moderno', highlight: 'SEDANS & HATCHS' },
  { name: 'Mercedes-Benz GLA 200 Advance', year: '2018', price: 54000, category: 'SUV Premium', highlight: 'PREMIUM & LUXO' },
  { name: 'Toyota Corolla XEi 2.0', year: '2023', price: 60000, category: 'Sedan Médio', highlight: 'SEDANS & HATCHS' },
  { name: 'Mercedes-Benz A200 Turbo', year: '2019', price: 72000, category: 'Hatch Premium', highlight: 'PREMIUM & LUXO' },
  { name: 'BMW X4 xDrive 28i', year: '2018', price: 68000, category: 'SUV Coupé Luxo', highlight: 'PREMIUM & LUXO' },
  { name: 'Ford Ka Hatch SE 1.0', year: '2020', price: 22000, category: 'Hatch / Econômico', highlight: 'ATÉ R$ 35 MIL' },
  { name: 'Hyundai HB20 Vision 1.0', year: '2020', price: 25000, category: 'Hatch / Econômico', highlight: 'ATÉ R$ 35 MIL' },
  { name: 'BYD Dolphin Mini 100% Elétrico', year: '2024', price: 55000, category: 'Elétrico Tecnológico', highlight: 'ELÉTRICOS & NOVOS' },
  { name: 'VW Amarok V6 Highline 4x4', year: '2019', price: 70000, category: 'Picape Diesel', highlight: 'SUVs & PICAPES' },
  { name: 'VW Tiguan Allspace R-Line', year: '2020', price: 75000, category: 'SUV 7 Lugares', highlight: 'SUVs & PICAPES' },
  { name: 'VW Virtus Comfortline TSI', year: '2024', price: 53000, category: 'Sedan Compacto', highlight: 'SEDANS & HATCHS' },
  { name: 'RAM Rampage Laramie 4x4', year: '2024/2026', price: 108000, category: 'Picape Luxo', highlight: 'SUVs & PICAPES' },
  { name: 'Chevrolet Onix Plus Premier', year: '2024', price: 43000, category: 'Sedan Turbo', highlight: 'SEDANS & HATCHS' },
  { name: 'BMW 320i M Sport Turbo', year: '2023', price: 120000, category: 'Sedan Luxo', highlight: 'PREMIUM & LUXO' },
  { name: 'Jeep Renegade Longitude Diesel 4x4', year: '2021', price: 45000, category: 'SUV 4x4 Diesel', highlight: 'SUVs & PICAPES' },
  { name: 'BMW X3 xDrive30i', year: '2018', price: 75000, category: 'SUV Luxo', highlight: 'PREMIUM & LUXO' },
  { name: 'Chevrolet Onix Premier Turbo', year: '2025', price: 43000, category: 'Hatch Premium', highlight: 'SEDANS & HATCHS' },
  { name: 'Chevrolet Novo Sonic LTZ', year: '2025/2027', price: 67000, category: 'Sedan Esportivo', highlight: 'SEDANS & HATCHS' },
  { name: 'Chevrolet Onix Hatch LT', year: '2024', price: 32000, category: 'Hatch / Econômico', highlight: 'ATÉ R$ 35 MIL' },
  { name: 'Chevrolet Tracker Premier Turbo', year: '2017', price: 36000, category: 'SUV Compacto', highlight: 'SUVs & PICAPES' },
  { name: 'Nissan Kicks SV CVT', year: '2019', price: 39000, category: 'SUV Compacto', highlight: 'SUVs & PICAPES' },
  { name: 'MINI Cooper S Turbo', year: '2019', price: 43000, category: 'Esportivo Premium', highlight: 'PREMIUM & LUXO' },
  { name: 'Jeep Compass Limited', year: '2021', price: 45000, category: 'SUV Médio', highlight: 'SUVs & PICAPES' },
  { name: 'Chevrolet Spin Premier 7 Lugares', year: '2025', price: 55000, category: 'Minivan Familiar', highlight: 'SEDANS & HATCHS' },
  { name: 'Chevrolet Onix Plus Premier Black', year: '2025', price: 45000, category: 'Sedan Turbo', highlight: 'SEDANS & HATCHS' },
  { name: 'Fiat Toro Ranch 4x4 Diesel', year: '2024', price: 70000, category: 'Picape Diesel', highlight: 'SUVs & PICAPES' },
  { name: 'Fiat Fastback Audace Turbo', year: '2024/2026', price: 52000, category: 'SUV Coupé', highlight: 'SUVs & PICAPES' },
  { name: 'Jeep Renegade Sport Turbo', year: '2025', price: 55000, category: 'SUV Compacto', highlight: 'SUVs & PICAPES' },
  { name: 'VW Fox Comfortline', year: '2016', price: 22000, category: 'Hatch / Econômico', highlight: 'ATÉ R$ 35 MIL' },
  { name: 'Chevrolet Cruze LT Automático', year: '2015', price: 30000, category: 'Sedan Médio', highlight: 'ATÉ R$ 35 MIL' },
  { name: 'Audi A3 Sedan Attraction 1.4 TFSI', year: '2016', price: 35000, category: 'Sedan Premium', highlight: 'PREMIUM & LUXO' },
  { name: 'Fiat Toro Volcano 4x4 Diesel', year: '2018', price: 48000, category: 'Picape Diesel', highlight: 'SUVs & PICAPES' },
  { name: 'BMW X2 sDrive20i Blindada', year: '2019', price: 87000, category: 'SUV Blindado Luxo', highlight: 'PREMIUM & LUXO' },
  { name: 'Mercedes-Benz GLE 400d AMG Line 4MATIC', year: '2021', price: 155000, category: 'SUV Super Luxo', highlight: 'PREMIUM & LUXO' }
];

const dir = path.join(process.cwd(), 'public', 'carros-estoque');
const files = fs.readdirSync(dir).filter(f => (f.endsWith('.jpeg') || f.endsWith('.jpg')) && f.startsWith('WhatsApp'));

// Natural sort
files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

const catalog = rawCars.map((car, idx) => {
  const originalFile = files[idx] || files[0];
  const safeName = car.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const cleanFilename = `carro_${String(idx + 1).padStart(2, '0')}_${safeName}.jpg`;
  
  fs.copyFileSync(path.join(dir, originalFile), path.join(dir, cleanFilename));

  return {
    id: idx + 1,
    name: car.name,
    year: car.year,
    pricePayoff: car.price,
    formattedPrice: 'R$ ' + car.price.toLocaleString('pt-BR'),
    category: car.category,
    highlight: car.highlight,
    imageOriginal: '/carros-estoque/' + originalFile,
    imageClean: '/carros-estoque/' + cleanFilename
  };
});

fs.writeFileSync(path.join(dir, 'catalogo.json'), JSON.stringify(catalog, null, 2), 'utf-8');
console.log('✅ Catálogo de 35 carros gerado com sucesso em public/carros-estoque/catalogo.json!');
