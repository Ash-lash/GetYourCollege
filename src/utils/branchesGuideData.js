export const branchesGuideData = [
  {
    id: 'computer-science',
    short: 'CS',
    name: 'Computer Science Engineering',
    desc: 'Software development, AI/ML, cloud computing, and data science',
    longDesc: 'Computer Science Engineering is the most sought-after engineering discipline in India, offering the highest starting salaries and abundant job opportunities. The field encompasses software development, data science, artificial intelligence, cloud computing, cybersecurity, and system design. With the rise of product companies, startups, and Global Capability Centers (GCCs), CS graduates have access to world-class compensation packages.',
    avgSalary: '8 - 20 LPA',
    jobs: '50,000+',
    theme: {
      text: '#4f46e5',
      bg: 'rgba(79, 70, 229, 0.08)',
      border: 'rgba(79, 70, 229, 0.2)',
      grad: ['#6366f1', '#8b5cf6'],
      accentLight: 'rgba(99,102,241,0.08)',
      accentColor: '#6366f1'
    },
    sectors: ['IT Services', 'Product Companies', 'Fintech', 'E-commerce', 'Enterprise SaaS', 'Startups'],
    salaryRanges: [
      { exp: 'Fresher (0-2 years)', range: '6 - 25 LPA', stats: 'Median: 12 LPA | Top 10%: 45 LPA' },
      { exp: 'Mid-Level (3-7 years)', range: '15 - 50 LPA', stats: 'Median: 25 LPA | Top 10%: 80 LPA' },
      { exp: 'Senior (8+ years)', range: '40 - 120+ LPA', stats: 'Median: 60 LPA | Top 10%: 1.5 Cr+' }
    ],
    industries: [
      {
        name: 'IT Services',
        growth: 'Growth: 8% YoY',
        market: 'Market: $250B by 2026',
        desc: "India's IT services sector is the world's largest, employing over 5 million professionals. Companies like TCS, Infosys, and Wipro offer stable careers with global exposure. While starting salaries are lower than product companies, these firms provide excellent training programs, work-life balance, and opportunities for international assignments.",
        roles: [
          {
            title: 'Software Developer',
            desc: 'Build and maintain enterprise applications using Java, .NET, Python across various domains.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '8-14 LPA' },
              { tier: 'Tier 2', chance: 'High chance', salary: '5-10 LPA' },
              { tier: 'Tier 3', chance: 'High chance', salary: '3.5-6 LPA' }
            ]
          },
          {
            title: 'Data Engineer',
            desc: 'Design and maintain data pipelines, ETL processes, and data warehouses using Spark, Airflow.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '10-18 LPA' },
              { tier: 'Tier 2', chance: 'High chance', salary: '7-12 LPA' },
              { tier: 'Tier 3', chance: 'Medium chance', salary: '5-8 LPA' }
            ]
          }
        ],
        companies: [
          { shortName: 'TCS', name: 'TCS', location: 'Chennai, Bangalore, Mumbai' },
          { shortName: 'INF', name: 'Infosys', location: 'Bangalore, Pune, Chennai' },
          { shortName: 'WIP', name: 'Wipro', location: 'Bangalore, Hyderabad, Chennai' },
          { shortName: 'CTS', name: 'Cognizant', location: 'Chennai, Coimbatore, Pune' }
        ],
        colleges: [
          { tier: 'Tier 1', examples: 'IIT Madras, NIT Trichy, Anna University (CEG), PSG Tech' },
          { tier: 'Tier 2', examples: 'SSN College, VIT Vellore, SRM University, CIT Coimbatore' },
          { tier: 'Tier 3', examples: 'State-affiliated private engineering colleges' }
        ]
      },
      {
        name: 'Product & Tech Giants',
        growth: 'Growth: 15% YoY',
        market: 'Market: $50B+ in India',
        desc: 'Product companies and Tech Giants (Google, Microsoft, Amazon) offer the highest compensation in the Indian tech industry. These roles are highly competitive, requiring strong Data Structures & Algorithms (DSA) skills and system design knowledge.',
        roles: [
          {
            title: 'Software Development Engineer (SDE)',
            desc: 'Build highly scalable and responsive web/mobile products used by millions of global users.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '25-80 LPA' },
              { tier: 'Tier 2', chance: 'Medium chance', salary: '18-35 LPA' },
              { tier: 'Tier 3', chance: 'Low chance', salary: '12-22 LPA' }
            ]
          },
          {
            title: 'Machine Learning Engineer',
            desc: 'Build and deploy machine learning models at scale, working on AI products, NLP, or computer vision.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '30-90 LPA' },
              { tier: 'Tier 2', chance: 'Low chance', salary: '20-45 LPA' },
              { tier: 'Tier 3', chance: 'Not available', salary: 'N/A' }
            ]
          }
        ],
        companies: [
          { shortName: 'GGL', name: 'Google', location: 'Bangalore, Hyderabad' },
          { shortName: 'MSF', name: 'Microsoft', location: 'Bangalore, Hyderabad, Noida' },
          { shortName: 'AMZ', name: 'Amazon', location: 'Bangalore, Chennai, Hyderabad' },
          { shortName: 'ZOH', name: 'Zoho Corporation', location: 'Chennai, Tenkasi' }
        ],
        colleges: [
          { tier: 'Tier 1', examples: 'IITs, NIT Trichy, IIIT Hyderabad, CEG Campus, PSG Tech' },
          { tier: 'Tier 2', examples: 'SSN College, VIT Vellore, SRM Ramapuram, CIT' },
          { tier: 'Tier 3', examples: 'Requires exceptional competitive coding profile (CodeChef, LeetCode)' }
        ]
      }
    ]
  },
  {
    id: 'mechanical-engineering',
    short: 'ME',
    name: 'Mechanical Engineering',
    desc: 'Design, manufacturing, thermal systems, and automotive engineering',
    longDesc: 'Mechanical Engineering is one of the oldest and most versatile engineering branches. It focuses on the design, analysis, manufacturing, and maintenance of mechanical systems. Today, the field blends core physics with automation, CAD/CAM designing, robotics, and energy systems, making it crucial for automotive, aerospace, and heavy industries.',
    avgSalary: '6 - 12 LPA',
    jobs: '15,000+',
    theme: {
      text: '#ea580c',
      bg: 'rgba(234, 88, 12, 0.08)',
      border: 'rgba(234, 88, 12, 0.2)',
      grad: ['#f97316', '#ef4444'],
      accentLight: 'rgba(249,115,22,0.08)',
      accentColor: '#f97316'
    },
    sectors: ['Automotive', 'Aerospace', 'Manufacturing', 'Robotics & Automation', 'Power & Energy'],
    salaryRanges: [
      { exp: 'Fresher (0-2 years)', range: '4.5 - 10 LPA', stats: 'Median: 6 LPA | Top 10%: 15 LPA' },
      { exp: 'Mid-Level (3-7 years)', range: '10 - 22 LPA', stats: 'Median: 14 LPA | Top 10%: 35 LPA' },
      { exp: 'Senior (8+ years)', range: '22 - 60+ LPA', stats: 'Median: 35 LPA | Top 10%: 80 LPA+' }
    ],
    industries: [
      {
        name: 'Automotive & Core R&D',
        growth: 'Growth: 10% YoY',
        market: 'Market: EV Market $100B by 2030',
        desc: 'Core automotive OEMs and Tier-1 suppliers hire mechanical engineers for product design, structural analysis, CFD simulation, and powertrain engineering. The shift toward Electric Vehicles (EVs) has created high demand for battery thermal management experts.',
        roles: [
          {
            title: 'Design Engineer (CAD/CAE)',
            desc: 'Use software like CATIA, SolidWorks, and ANSYS to design and simulate vehicle/industrial components.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '8-15 LPA' },
              { tier: 'Tier 2', chance: 'High chance', salary: '5-9 LPA' },
              { tier: 'Tier 3', chance: 'Medium chance', salary: '3.6-5.5 LPA' }
            ]
          },
          {
            title: 'Thermal Management Specialist',
            desc: 'Analyze heat dissipation in ICE and EV battery systems using thermal simulations.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '10-18 LPA' },
              { tier: 'Tier 2', chance: 'Medium chance', salary: '6-11 LPA' },
              { tier: 'Tier 3', chance: 'Low chance', salary: '4-7 LPA' }
            ]
          }
        ],
        companies: [
          { shortName: 'M&M', name: 'Mahindra & Mahindra', location: 'Chennai, Pune' },
          { shortName: 'TML', name: 'Tata Motors', location: 'Pune, Jamshedpur' },
          { shortName: 'HYU', name: 'Hyundai India', location: 'Chennai' },
          { shortName: 'RNT', name: 'Renault Nissan', location: 'Chennai' }
        ],
        colleges: [
          { tier: 'Tier 1', examples: 'IIT Madras, NIT Trichy, Anna University (CEG), PSG College of Technology' },
          { tier: 'Tier 2', examples: 'SSN College, CIT Coimbatore, Thiagarajar College of Engineering (TCE)' },
          { tier: 'Tier 3', examples: 'State private engineering colleges' }
        ]
      }
    ]
  },
  {
    id: 'electronics-communication',
    short: 'EC',
    name: 'Electronics & Communication Engineering',
    desc: 'Embedded systems, VLSI, signal processing, and telecommunications',
    longDesc: 'Electronics & Communication Engineering bridges the gap between hardware and software. ECE engineers design and develop microprocessors, semiconductor chips, embedded systems, IoT devices, and communication networks. With India\'s push into semiconductor manufacturing (India Semiconductor Mission) and 5G/6G deployments, ECE is experiencing a massive resurgence.',
    avgSalary: '6 - 14 LPA',
    jobs: '18,000+',
    theme: {
      text: '#0d9488',
      bg: 'rgba(13, 148, 136, 0.08)',
      border: 'rgba(13, 148, 136, 0.2)',
      grad: ['#0f766e', '#06b6d4'],
      accentLight: 'rgba(13,148,136,0.08)',
      accentColor: '#0d9488'
    },
    sectors: ['Semiconductors & VLSI', 'Embedded Systems', 'Telecom & Networking', 'IoT & Consumer Electronics'],
    salaryRanges: [
      { exp: 'Fresher (0-2 years)', range: '5.5 - 18 LPA', stats: 'Median: 8.5 LPA | Top 10%: 30 LPA' },
      { exp: 'Mid-Level (3-7 years)', range: '14 - 36 LPA', stats: 'Median: 20 LPA | Top 10%: 55 LPA' },
      { exp: 'Senior (8+ years)', range: '35 - 90+ LPA', stats: 'Median: 48 LPA | Top 10%: 1.2 Cr+' }
    ],
    industries: [
      {
        name: 'Semiconductors & VLSI',
        growth: 'Growth: 25% YoY (India Semiconductor Mission)',
        market: 'Market: $64B India Semiconductor Market by 2026',
        desc: 'Global semiconductor design companies are expanding heavily in India. VLSI (Very Large Scale Integration) design engineers work on chip design, verification, and physical layout using advanced EDA tools.',
        roles: [
          {
            title: 'ASIC/VLSI Design Engineer',
            desc: 'Design integrated circuits, microchips, and system-on-chips (SoC) using Verilog/VHDL.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '15-28 LPA' },
              { tier: 'Tier 2', chance: 'Medium chance', salary: '8-15 LPA' },
              { tier: 'Tier 3', chance: 'Low chance', salary: '5-9 LPA' }
            ]
          },
          {
            title: 'Embedded Software Engineer',
            desc: 'Write low-level firmware and device drivers for microcontrollers and embedded OS (RTOS).',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '12-20 LPA' },
              { tier: 'Tier 2', chance: 'High chance', salary: '7-12 LPA' },
              { tier: 'Tier 3', chance: 'Medium chance', salary: '4.5-7.5 LPA' }
            ]
          }
        ],
        companies: [
          { shortName: 'QCM', name: 'Qualcomm', location: 'Bangalore, Chennai, Hyderabad' },
          { shortName: 'INTC', name: 'Intel', location: 'Bangalore' },
          { shortName: 'TXN', name: 'Texas Instruments', location: 'Bangalore' },
          { shortName: 'AMD', name: 'AMD', location: 'Bangalore, Hyderabad' }
        ],
        colleges: [
          { tier: 'Tier 1', examples: 'IITs, NIT Trichy, CEG Campus, PSG College of Technology' },
          { tier: 'Tier 2', examples: 'SSN College, VIT Vellore, Coimbatore Institute of Technology (CIT)' },
          { tier: 'Tier 3', examples: 'Requires specialized VLSI/Embedded training certifications' }
        ]
      }
    ]
  },
  {
    id: 'electrical-engineering',
    short: 'EE',
    name: 'Electrical Engineering',
    desc: 'Power systems, electrical machines, and grid infrastructure',
    longDesc: 'Electrical Engineering drives the power that runs our world. It focuses on the generation, transmission, distribution, and utilization of electrical energy. Modern electrical engineering integrates renewable energy (solar, wind), smart grids, high-voltage systems, and EV battery/motor control systems.',
    avgSalary: '5 - 10 LPA',
    jobs: '12,000+',
    theme: {
      text: '#d97706',
      bg: 'rgba(217, 119, 6, 0.08)',
      border: 'rgba(217, 119, 6, 0.2)',
      grad: ['#d97706', '#facc15'],
      accentLight: 'rgba(217,119,6,0.08)',
      accentColor: '#d97706'
    },
    sectors: ['Power Utilities', 'Renewable Energy', 'Smart Grid Infrastructure', 'Electrical Machinery'],
    salaryRanges: [
      { exp: 'Fresher (0-2 years)', range: '4.5 - 9 LPA', stats: 'Median: 5.5 LPA | Top 10%: 12 LPA' },
      { exp: 'Mid-Level (3-7 years)', range: '9 - 18 LPA', stats: 'Median: 12 LPA | Top 10%: 28 LPA' },
      { exp: 'Senior (8+ years)', range: '18 - 45+ LPA', stats: 'Median: 26 LPA | Top 10%: 65 LPA+' }
    ],
    industries: [
      {
        name: 'Renewable Energy & Power Systems',
        growth: 'Growth: 12% YoY',
        market: 'Target: 500GW Non-Fossil Capacity by 2030',
        desc: 'With India rushing to adopt green energy, power companies and grid operators hire electrical engineers to design solar/wind power layouts, manage smart grid distribution, and develop power electronic converters.',
        roles: [
          {
            title: 'Power Systems Engineer',
            desc: 'Design and simulate power transmission grids, substation layouts, and load distribution.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '8-14 LPA' },
              { tier: 'Tier 2', chance: 'High chance', salary: '5-9 LPA' },
              { tier: 'Tier 3', chance: 'Medium chance', salary: '3.6-5.5 LPA' }
            ]
          },
          {
            title: 'Power Electronics Engineer',
            desc: 'Design inverters, converters, and battery chargers for EVs and renewable integrations.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '10-16 LPA' },
              { tier: 'Tier 2', chance: 'Medium chance', salary: '6-11 LPA' },
              { tier: 'Tier 3', chance: 'Low chance', salary: '4-7 LPA' }
            ]
          }
        ],
        companies: [
          { shortName: 'L&T', name: 'Larsen & Toubro', location: 'Chennai, Mumbai' },
          { shortName: 'ABB', name: 'ABB India', location: 'Bangalore, Chennai' },
          { shortName: 'PGC', name: 'Power Grid Corp', location: 'Pan-India' },
          { shortName: 'SIEM', name: 'Siemens India', location: 'Mumbai, Bangalore' }
        ],
        colleges: [
          { tier: 'Tier 1', examples: 'IIT Madras, NIT Trichy, CEG Campus, PSG College of Technology' },
          { tier: 'Tier 2', examples: 'Thiagarajar College of Engineering, CIT, SSN College' },
          { tier: 'Tier 3', examples: 'State private engineering colleges' }
        ]
      }
    ]
  },
  {
    id: 'civil-engineering',
    short: 'CE',
    name: 'Civil Engineering',
    desc: 'Construction, structural design, infrastructure, and urban planning',
    longDesc: 'Civil Engineering shapes the physical environment around us. It encompasses the design, construction, and maintenance of structures like buildings, bridges, dams, highways, airports, and water treatment systems. Modern civil engineering incorporates sustainable construction materials, smart city planning, and BIM (Building Information Modeling) technologies.',
    avgSalary: '4 - 9 LPA',
    jobs: '8,000+',
    theme: {
      text: '#059669',
      bg: 'rgba(5, 150, 105, 0.08)',
      border: 'rgba(5, 150, 105, 0.2)',
      grad: ['#059669', '#10b981'],
      accentLight: 'rgba(5,150,105,0.08)',
      accentColor: '#059669'
    },
    sectors: ['Real Estate & Construction', 'Infrastructure & Highways', 'Structural Design Consultancy', 'Government Infrastructure (PWD, NHAI)'],
    salaryRanges: [
      { exp: 'Fresher (0-2 years)', range: '3.6 - 7.5 LPA', stats: 'Median: 4.8 LPA | Top 10%: 10 LPA' },
      { exp: 'Mid-Level (3-7 years)', range: '7.5 - 16 LPA', stats: 'Median: 10 LPA | Top 10%: 24 LPA' },
      { exp: 'Senior (8+ years)', range: '16 - 40+ LPA', stats: 'Median: 22 LPA | Top 10%: 55 LPA+' }
    ],
    industries: [
      {
        name: 'Infrastructure & Construction',
        growth: 'Growth: 15% YoY (Govt Infrastructure Capex)',
        market: 'Market: Indian Construction Market $1.4T by 2028',
        desc: 'Infrastructure majors and structural design firms hire civil engineers for site execution, project management, quantity surveying, and structural modeling using software like STAAD Pro and Revit.',
        roles: [
          {
            title: 'Structural Engineer',
            desc: 'Design and analyze load-bearing structures to ensure safety, durability, and code compliance.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '7-12 LPA' },
              { tier: 'Tier 2', chance: 'High chance', salary: '4.8-8 LPA' },
              { tier: 'Tier 3', chance: 'Medium chance', salary: '3.5-5 LPA' }
            ]
          },
          {
            title: 'Planning & Project Engineer',
            desc: 'Coordinate schedules, manage resources, and monitor construction quality on-site.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '8-14 LPA' },
              { tier: 'Tier 2', chance: 'Medium chance', salary: '5-9 LPA' },
              { tier: 'Tier 3', chance: 'Low chance', salary: '3.6-5.5 LPA' }
            ]
          }
        ],
        companies: [
          { shortName: 'L&T', name: 'L&T Construction', location: 'Chennai, Delhi, Mumbai' },
          { shortName: 'SHP', name: 'Shapoorji Pallonji', location: 'Mumbai, Bangalore' },
          { shortName: 'HCC', name: 'HCC', location: 'Mumbai' },
          { shortName: 'AFR', name: 'Afcons Infrastructure', location: 'Mumbai, Chennai' }
        ],
        colleges: [
          { tier: 'Tier 1', examples: 'IIT Madras, NIT Trichy, Anna University (CEG)' },
          { tier: 'Tier 2', examples: 'Government College of Technology (GCT), TCE, CIT' },
          { tier: 'Tier 3', examples: 'State private engineering colleges' }
        ]
      }
    ]
  },
  {
    id: 'chemical-engineering',
    short: 'CH',
    name: 'Chemical Engineering',
    desc: 'Process engineering, petrochemicals, pharmaceuticals, and materials',
    longDesc: 'Chemical Engineering applies physical and life sciences with mathematics to convert raw materials into valuable products. Chemical engineers design large-scale manufacturing processes, manage chemical reactions, refine petroleum products, formulate pharmaceuticals, and develop sustainable materials and waste treatment solutions.',
    avgSalary: '5 - 12 LPA',
    jobs: '5,000+',
    theme: {
      text: '#e11d48',
      bg: 'rgba(225, 29, 72, 0.08)',
      border: 'rgba(225, 29, 72, 0.2)',
      grad: ['#e11d48', '#f43f5e'],
      accentLight: 'rgba(225,29,72,0.08)',
      accentColor: '#e11d48'
    },
    sectors: ['Petrochemicals & Refineries', 'Pharmaceuticals & Biotech', 'Specialty Chemicals', 'FMCG & Food Processing'],
    salaryRanges: [
      { exp: 'Fresher (0-2 years)', range: '4.5 - 10 LPA', stats: 'Median: 6 LPA | Top 10%: 15 LPA' },
      { exp: 'Mid-Level (3-7 years)', range: '10 - 20 LPA', stats: 'Median: 13 LPA | Top 10%: 32 LPA' },
      { exp: 'Senior (8+ years)', range: '20 - 50+ LPA', stats: 'Median: 30 LPA | Top 10%: 70 LPA+' }
    ],
    industries: [
      {
        name: 'Process & Refineries',
        growth: 'Growth: 7% YoY',
        market: 'Market: Specialty Chemicals $50B by 2025',
        desc: 'Petrochemical giants and pharmaceutical plants hire chemical engineers for plant operation, process optimization (using Aspen Plus), chemical safety, and reactor design.',
        roles: [
          {
            title: 'Process Engineer',
            desc: 'Design, optimize, and troubleshoot manufacturing and chemical process systems.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '9-16 LPA' },
              { tier: 'Tier 2', chance: 'High chance', salary: '6-10 LPA' },
              { tier: 'Tier 3', chance: 'Medium chance', salary: '4-6.5 LPA' }
            ]
          },
          {
            title: 'Plant Operations Manager',
            desc: 'Supervise daily plant production, ensure safety protocols, and optimize resource efficiency.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '10-18 LPA' },
              { tier: 'Tier 2', chance: 'Medium chance', salary: '7-12 LPA' },
              { tier: 'Tier 3', chance: 'Low chance', salary: '4.5-7 LPA' }
            ]
          }
        ],
        companies: [
          { shortName: 'RIL', name: 'Reliance Industries', location: 'Jamnagar, Mumbai' },
          { shortName: 'IOC', name: 'Indian Oil Corp (IOCL)', location: 'Chennai, Vadodara' },
          { shortName: 'BPCL', name: 'BPCL', location: 'Kochi, Mumbai' },
          { shortName: 'DRRD', name: 'Dr. Reddy\'s Labs', location: 'Hyderabad, Vizag' }
        ],
        colleges: [
          { tier: 'Tier 1', examples: 'IIT Madras, NIT Trichy, ACTech (Anna University)' },
          { tier: 'Tier 2', examples: 'Coimbatore Institute of Technology (CIT), Annamalai University' },
          { tier: 'Tier 3', examples: 'Requires specialized process simulation software certifications' }
        ]
      }
    ]
  },
  {
    id: 'aerospace-engineering',
    short: 'AE',
    name: 'Aerospace Engineering',
    desc: 'Aircraft design, propulsion systems, space technology, and defense',
    longDesc: 'Aerospace Engineering deals with the design, development, and testing of aircraft, rockets, satellites, and spacecraft. It encompasses both aeronautical flight within the atmosphere and astronautical flight in outer space. The boom in the private space tech sector in India and rising defense exports are fueling strong demand.',
    avgSalary: '7 - 15 LPA',
    jobs: '3,000+',
    theme: {
      text: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.08)',
      border: 'rgba(2, 132, 199, 0.2)',
      grad: ['#0284c7', '#38bdf8'],
      accentLight: 'rgba(2,132,199,0.08)',
      accentColor: '#0284c7'
    },
    sectors: ['Aviation & Commercial Flight', 'Space Exploration & Satellites', 'Defense R&D', 'Unmanned Aerial Vehicles (Drones)'],
    salaryRanges: [
      { exp: 'Fresher (0-2 years)', range: '6 - 15 LPA', stats: 'Median: 8 LPA | Top 10%: 22 LPA' },
      { exp: 'Mid-Level (3-7 years)', range: '14 - 28 LPA', stats: 'Median: 18 LPA | Top 10%: 40 LPA' },
      { exp: 'Senior (8+ years)', range: '28 - 70+ LPA', stats: 'Median: 42 LPA | Top 10%: 95 LPA+' }
    ],
    industries: [
      {
        name: 'Space Tech & Defense R&D',
        growth: 'Growth: 30% YoY (Private Space Sector)',
        market: 'Market: Indian Space Economy $13B by 2025',
        desc: 'Government defense labs (DRDO, HAL) and rising private space startups hire aerospace engineers to work on aerodynamics, launch vehicles, thermal shields, and structure simulations.',
        roles: [
          {
            title: 'Aerodynamics Engineer',
            desc: 'Analyze fluid flow over aircraft/missile surfaces using Computational Fluid Dynamics (CFD).',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '10-18 LPA' },
              { tier: 'Tier 2', chance: 'Medium chance', salary: '6-11 LPA' },
              { tier: 'Tier 3', chance: 'Low chance', salary: '4-7 LPA' }
            ]
          },
          {
            title: 'Propulsion Systems Engineer',
            desc: 'Design and test turbine blades, rocket engines, fuel injection systems, and thrusters.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '12-22 LPA' },
              { tier: 'Tier 2', chance: 'Medium chance', salary: '7-14 LPA' },
              { tier: 'Tier 3', chance: 'Not available', salary: 'N/A' }
            ]
          }
        ],
        companies: [
          { shortName: 'ISRO', name: 'ISRO / Antrix', location: 'Bangalore, Trivandrum' },
          { shortName: 'HAL', name: 'Hindustan Aeronautics (HAL)', location: 'Bangalore, Kanpur' },
          { shortName: 'DRDO', name: 'DRDO Labs', location: 'Hyderabad, Bangalore' },
          { shortName: 'SKY', name: 'Skyroot Aerospace', location: 'Hyderabad' }
        ],
        colleges: [
          { tier: 'Tier 1', examples: 'IIT Madras, IIT Kanpur, IIST Trivandrum (Direct ISRO pipeline)' },
          { tier: 'Tier 2', examples: 'MIT Campus (Anna University), Kumaraguru College of Technology' },
          { tier: 'Tier 3', examples: 'Requires strong postgraduate (M.Tech) degrees for core R&D' }
        ]
      }
    ]
  },
  {
    id: 'biotechnology',
    short: 'BT',
    name: 'Biotechnology',
    desc: 'Bioinformatics, genetic engineering, pharma research, and healthcare',
    longDesc: 'Biotechnology combines biological sciences with engineering principles to develop products for healthcare, medicine, agriculture, and environmental conservation. Biotech engineers work on vaccines, genetic modifications, clinical diagnostics, and food processing systems.',
    avgSalary: '4 - 10 LPA',
    jobs: '4,000+',
    theme: {
      text: '#db2777',
      bg: 'rgba(219, 39, 119, 0.08)',
      border: 'rgba(219, 39, 119, 0.2)',
      grad: ['#db2777', '#f472b6'],
      accentLight: 'rgba(219,39,119,0.08)',
      accentColor: '#db2777'
    },
    sectors: ['Pharmaceuticals & Therapeutics', 'Clinical Research & Diagnostics', 'Agricultural Biotechnology', 'Bioinformatics & Data Analytics'],
    salaryRanges: [
      { exp: 'Fresher (0-2 years)', range: '3.6 - 7.5 LPA', stats: 'Median: 4.8 LPA | Top 10%: 10 LPA' },
      { exp: 'Mid-Level (3-7 years)', range: '7.5 - 15 LPA', stats: 'Median: 10 LPA | Top 10%: 22 LPA' },
      { exp: 'Senior (8+ years)', range: '15 - 35+ LPA', stats: 'Median: 20 LPA | Top 10%: 45 LPA+' }
    ],
    industries: [
      {
        name: 'Biopharma & Therapeutics',
        growth: 'Growth: 15% YoY',
        market: 'Market: India Biotech Sector $150B by 2025',
        desc: 'Biopharma companies hire biotechnology graduates for clinical trials, drug validation, fermentation controls, and bio-process engineering to scale up vaccine and antibody productions.',
        roles: [
          {
            title: 'Bio-process Engineer',
            desc: 'Design and optimize bioreactors for scaling biological cultures and protein extraction.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '7-12 LPA' },
              { tier: 'Tier 2', chance: 'High chance', salary: '4.8-8 LPA' },
              { tier: 'Tier 3', chance: 'Medium chance', salary: '3.5-5 LPA' }
            ]
          },
          {
            title: 'Bioinformatics Analyst',
            desc: 'Analyze genetic sequences, protein structures, and clinical data using computational tools.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '8-14 LPA' },
              { tier: 'Tier 2', chance: 'Medium chance', salary: '5-9 LPA' },
              { tier: 'Tier 3', chance: 'Low chance', salary: '3.6-5.5 LPA' }
            ]
          }
        ],
        companies: [
          { shortName: 'BOC', name: 'Biocon', location: 'Bangalore' },
          { shortName: 'SII', name: 'Serum Institute of India', location: 'Pune' },
          { shortName: 'SYNG', name: 'Syngene International', location: 'Bangalore' },
          { shortName: 'NOVO', name: 'Novozymes', location: 'Bangalore' }
        ],
        colleges: [
          { tier: 'Tier 1', examples: 'IIT Madras, ACTech (Anna University), NIT Trichy' },
          { tier: 'Tier 2', examples: 'PSG Tech, KCG College of Technology, Rajalakshmi Engineering College' },
          { tier: 'Tier 3', examples: 'State private engineering colleges' }
        ]
      }
    ]
  },
  {
    id: 'automobile-engineering',
    short: 'AU',
    name: 'Automobile Engineering',
    desc: 'Vehicle design, EV technology, powertrain, and manufacturing',
    longDesc: 'Automobile Engineering is a branch of mechanical engineering focusing on design, development, production, and testing of cars, trucks, bikes, and other transportation systems. With the global revolution in Electric Vehicles (EVs) and Autonomous Driving, the modern automotive engineer works extensively with sensors, battery packs, microcontrollers, and electrical drivetrains.',
    avgSalary: '5 - 12 LPA',
    jobs: '10,000+',
    theme: {
      text: '#7c3aed',
      bg: 'rgba(124, 58, 237, 0.08)',
      border: 'rgba(124, 58, 237, 0.2)',
      grad: ['#7c3aed', '#a78bfa'],
      accentLight: 'rgba(124,58,237,0.08)',
      accentColor: '#7c3aed'
    },
    sectors: ['Passenger Vehicles (ICE & EV)', 'Two-Wheeler Giants', 'EV Battery & Motor R&D', 'Auto Components Manufacturing'],
    salaryRanges: [
      { exp: 'Fresher (0-2 years)', range: '4.5 - 11 LPA', stats: 'Median: 5.8 LPA | Top 10%: 15 LPA' },
      { exp: 'Mid-Level (3-7 years)', range: '11 - 22 LPA', stats: 'Median: 13.5 LPA | Top 10%: 32 LPA' },
      { exp: 'Senior (8+ years)', range: '22 - 55+ LPA', stats: 'Median: 28 LPA | Top 10%: 75 LPA+' }
    ],
    industries: [
      {
        name: 'Electric Vehicle & OEM Sector',
        growth: 'Growth: 40% YoY (EV segment)',
        market: 'Market: Indian EV sector $100B by 2030',
        desc: 'Automotive giants and EV startups are hiring engineers rapidly to design EV chassis, integrate electrical drivetrains, program battery management systems (BMS), and optimize vehicle aerodynamics.',
        roles: [
          {
            title: 'EV Drivetrain Engineer',
            desc: 'Design and integrate electric motors, gearboxes, and power distribution modules.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '9-16 LPA' },
              { tier: 'Tier 2', chance: 'High chance', salary: '5.5-10 LPA' },
              { tier: 'Tier 3', chance: 'Medium chance', salary: '4-6.5 LPA' }
            ]
          },
          {
            title: 'Vehicle Dynamics Engineer',
            desc: 'Analyze ride comfort, steering responses, and handling properties using ADAMS or MATLAB.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '8-14 LPA' },
              { tier: 'Tier 2', chance: 'Medium chance', salary: '5-9 LPA' },
              { tier: 'Tier 3', chance: 'Low chance', salary: '3.6-5.5 LPA' }
            ]
          }
        ],
        companies: [
          { shortName: 'OLA', name: 'Ola Electric', location: 'Bangalore, Hosur' },
          { shortName: 'ATH', name: 'Ather Energy', location: 'Bangalore, Hosur' },
          { shortName: 'TVS', name: 'TVS Motor Company', location: 'Hosur, Chennai' },
          { shortName: 'TAT', name: 'Tata Motors EV', location: 'Pune' }
        ],
        colleges: [
          { tier: 'Tier 1', examples: 'IIT Madras, IIT Bombay, PSG College of Technology, MIT Campus' },
          { tier: 'Tier 2', examples: 'Sri Venkateswara College of Engineering (SVCE), KCG College, CIT' },
          { tier: 'Tier 3', examples: 'Requires additional hands-on EV courses/projects' }
        ]
      }
    ]
  },
  {
    id: 'instrumentation-engineering',
    short: 'IN',
    name: 'Instrumentation Engineering',
    desc: 'Control systems, automation, sensors, and process industries',
    longDesc: 'Instrumentation Engineering focuses on the measurement and control of process variables within industrial systems. Instrumentation engineers design sensors, transmitters, actuators, and controllers (like PLC and DCS) that automate factories, chemical refineries, power plants, and robotic assemblies.',
    avgSalary: '5 - 11 LPA',
    jobs: '6,000+',
    theme: {
      text: '#b45309',
      bg: 'rgba(180, 83, 9, 0.08)',
      border: 'rgba(180, 83, 9, 0.2)',
      grad: ['#b45309', '#fbbf24'],
      accentLight: 'rgba(180,83,9,0.08)',
      accentColor: '#b45309'
    },
    sectors: ['Industrial Automation', 'Oil & Gas Refineries', 'Power Plants & Steel Mills', 'Sensors & IoT Manufacturing'],
    salaryRanges: [
      { exp: 'Fresher (0-2 years)', range: '4.5 - 9.5 LPA', stats: 'Median: 5.5 LPA | Top 10%: 12 LPA' },
      { exp: 'Mid-Level (3-7 years)', range: '9.5 - 18 LPA', stats: 'Median: 12 LPA | Top 10%: 28 LPA' },
      { exp: 'Senior (8+ years)', range: '18 - 45+ LPA', stats: 'Median: 25 LPA | Top 10%: 60 LPA+' }
    ],
    industries: [
      {
        name: 'Industrial Automation & Controls',
        growth: 'Growth: 9% YoY',
        market: 'Market: Industrial Automation $15B by 2026',
        desc: 'Process industries and system integrators hire instrumentation engineers to program PLC, SCADA, and DCS systems, configure field instruments (flowmeters, pressure sensors), and establish industrial communication networks.',
        roles: [
          {
            title: 'Automation & Controls Engineer',
            desc: 'Program and commission PLC, SCADA, and DCS logic for process plant automations.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '8-14 LPA' },
              { tier: 'Tier 2', chance: 'High chance', salary: '5-9 LPA' },
              { tier: 'Tier 3', chance: 'Medium chance', salary: '3.6-5.5 LPA' }
            ]
          },
          {
            title: 'Instrumentation & Calibration Engineer',
            desc: 'Select, install, and calibrate industrial sensors, actuators, and control valves.',
            tiers: [
              { tier: 'Tier 1', chance: 'High chance', salary: '7-11 LPA' },
              { tier: 'Tier 2', chance: 'Medium chance', salary: '4.5-8 LPA' },
              { tier: 'Tier 3', chance: 'Low chance', salary: '3.5-5 LPA' }
            ]
          }
        ],
        companies: [
          { shortName: 'HON', name: 'Honeywell Automation', location: 'Pune, Bangalore' },
          { shortName: 'YOK', name: 'Yokogawa India', location: 'Bangalore, Chennai' },
          { shortName: 'EMR', name: 'Emerson Process', location: 'Mumbai, Pune' },
          { shortName: 'SIEM', name: 'Siemens Automation', location: 'Mumbai, Bangalore' }
        ],
        colleges: [
          { tier: 'Tier 1', examples: 'IIT Kharagpur, NIT Trichy, MIT Campus (Anna University)' },
          { tier: 'Tier 2', examples: 'St. Joseph\'s College of Engineering, PSG College, CIT' },
          { tier: 'Tier 3', examples: 'Requires certification in PLC/SCADA programming' }
        ]
      }
    ]
  }
];
