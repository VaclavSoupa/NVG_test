class EffectivenessProfileNormsDistribution {

	static var DistributionLookup = [
      	//2016/2018 v1 norms
        ['AllCompany_A_16TO18_Avg',          3939217, 46, 10, 14, 30], // TOTAL: General Industry
        ['G10_A_16TO18_Avg',                   49482, 47, 10, 15, 27], // INDUSTRY: Oil and Gas
        ['G15_A_16TO18_Avg',                  168471, 48, 10, 13, 29], // INDUSTRY: Natural Materials
        ['G20_A_16TO18_Avg',                  419979, 45, 10, 13, 32], // INDUSTRY: Health and Life Sciences
        ['G25_A_16TO18_Avg',                 1019298, 45, 10, 14, 31], // INDUSTRY: Industrials
        ['G30_A_16TO18_Avg',                  625182, 48,  9, 14, 29], // INDUSTRY: Consumer Goods
        ['G35_A_16TO18_Avg',                  336816, 48,  9, 14, 29], // INDUSTRY: Consumer Services
        ['G40_A_16TO18_Avg',                  776972, 49, 10, 13, 28], // INDUSTRY: Financials
        ['G45_A_16TO18_Avg',                  127005, 48,  9, 15, 28], // INDUSTRY: Utilities
        ['G50_A_16TO18_Avg',                  271615, 49,  9, 14, 28], // INDUSTRY: Communications
        ['G55_A_16TO18_Avg',                   97012, 41, 10, 15, 34], // INDUSTRY: Public Sector and NFP
        ['G99_A_16TO18_Avg',                   24603, 46, 11, 14, 30], // INDUSTRY: Unclassified
        ['X9000_A_16TO18_Avg',               1628216, 46, 10, 13, 30], // INDUSTRY: Manufacturing
        ['X9001_A_16TO18_Avg',                231474, 46, 10, 13, 32], // INDUSTRY: Automobiles and Automobile Parts
        ['G150_A_16TO18_Avg',                 136468, 45, 10, 15, 30], // INDUSTRY: Natural Resources
        ['G151_A_16TO18_Avg',                  32003, 50, 10, 12, 28], // INDUSTRY: Chemicals
        ['G200_A_16TO18_Avg',                 206662, 45, 11, 13, 31], // INDUSTRY: Life Sciences
        ['G201_A_16TO18_Avg',                 213317, 44,  8, 14, 33], // INDUSTRY: Healthcare
        ['G250_A_16TO18_Avg',                 138127, 57,  8, 12, 22], // INDUSTRY: Construction and Materials
        ['G251_A_16TO18_Avg',                 359665, 43, 10, 14, 33], // INDUSTRY: Industrial Goods
        ['G252_A_16TO18_Avg',                 237788, 44, 11, 14, 31], // INDUSTRY: High Technology
        ['G253_A_16TO18_Avg',                  48036, 40,  9, 14, 37], // INDUSTRY: Transportation
        ['G254_A_16TO18_Avg',                 168616, 44, 10, 14, 33], // INDUSTRY: Services
        ['G300_A_16TO18_Avg',                 142475, 49,  8, 14, 29], // INDUSTRY: Fast Moving Consumer Goods
        ['G301_A_16TO18_Avg',                 464611, 44, 10, 15, 32], // INDUSTRY: Consumer Durables
        ['G350_A_16TO18_Avg',                 272486, 47, 11, 13, 29], // INDUSTRY: Retail
        ['G351_A_16TO18_Avg',                  63726, 48,  8, 15, 30], // INDUSTRY: Leisure and Hospitality
        ['G400_A_16TO18_Avg',                 614201, 48, 11, 13, 29], // INDUSTRY: Banks
        ['G401_A_16TO18_Avg',                  76318, 47, 11, 13, 29], // INDUSTRY: Insurance
        ['G402_A_16TO18_Avg',                  83550, 50,  9, 13, 28], // INDUSTRY: Financial Services
        ['G500_A_16TO18_Avg',                 160774, 50,  9, 13, 28], // INDUSTRY: Telecommunications
        ['G550_A_16TO18_Avg',                  23386, 41, 10, 14, 36], // INDUSTRY: Public Sector
        ['G551_A_16TO18_Avg',                  64860, 45,  8, 15, 32], // INDUSTRY: Education
        ['G552_A_16TO18_Avg',                   8766, 39, 11, 16, 35], // INDUSTRY: Not-for-Profit
        ['G1003_A_16TO18_Avg',                 20741, 48,  7, 18, 27], // INDUSTRY: Oil Field Services
        ['G2000_A_16TO18_Avg',                179461, 49, 12, 12, 27], // INDUSTRY: Pharmaceuticals
        ['G2002_A_16TO18_Avg',                 12620, 38,  9, 14, 39], // INDUSTRY: Medical equipment and supplies
        ['G2500_A_16TO18_Avg',                 82049, 56,  8, 13, 23], // INDUSTRY: Construction
        ['G2501_A_16TO18_Avg',                 56078, 57,  9, 12, 22], // INDUSTRY: Building Materials
        ['G2511_A_16TO18_Avg',                156596, 53, 11, 10, 25], // INDUSTRY: Automobiles
        ['G2512_A_16TO18_Avg',                 73888, 42,  8, 14, 36], // INDUSTRY: Automobile Parts
        ['G2513_A_16TO18_Avg',                 12218, 41,  9, 16, 33], // INDUSTRY: Industrial Machinery
        ['G2515_A_16TO18_Avg',                 74744, 38, 10, 14, 38], // INDUSTRY: Diversified Industrials
        ['G2521_A_16TO18_Avg',                167426, 41, 11, 14, 34], // INDUSTRY: Technology, Hardware and Equipment
        ['G2522_A_16TO18_Avg',                 18021, 48,  9, 16, 27], // INDUSTRY: Software
        ['G2534_A_16TO18_Avg',                 19380, 45,  9, 14, 32], // INDUSTRY: Transportation Infrastructure
        ['G2541_A_16TO18_Avg',                 51251, 45, 11, 13, 31], // INDUSTRY: Business Services
        ['G2549_A_16TO18_Avg',                 73524, 42,  9, 13, 35], // INDUSTRY: Other Professional Services
        ['G3000_A_16TO18_Avg',                 90654, 50,  8, 14, 29], // INDUSTRY: Food and Drink
        ['G3503_A_16TO18_Avg',                 47071, 48, 12, 13, 27], // INDUSTRY: Apparel Retailers
        ['G3510_A_16TO18_Avg',                 14606, 52,  6, 15, 27], // INDUSTRY: Hotels, Resorts and Cruise Lines
        ['G3512_A_16TO18_Avg',                 37336, 50,  8, 12, 29], // INDUSTRY: Leisure Facilities
        ['G4000_A_16TO18_Avg',                447565, 49, 14, 10, 28], // INDUSTRY: Universal Banks
        ['G4002_A_16TO18_Avg',                100832, 52,  9, 13, 26], // INDUSTRY: Retail/Corporate/Commercial Banks
        ['G4020_A_16TO18_Avg',                 10189, 64,  9,  8, 19], // INDUSTRY: Real Estate
        ['G4022_A_16TO18_Avg',                 38978, 49, 10, 13, 27], // INDUSTRY: Asset Management
        ['G4029_A_16TO18_Avg',                 28197, 49,  8, 14, 28], // INDUSTRY: Other Financial Services
        ['G4500_A_16TO18_Avg',                 53446, 48, 10, 17, 26], // INDUSTRY: Electricity and Gas
        ['G5001_A_16TO18_Avg',                160774, 50,  9, 13, 28], // INDUSTRY: Integrated Telecommunications
        ['G5501_A_16TO18_Avg',                  7279, 41, 10, 13, 36], // INDUSTRY: National Government Agencies
        ['G5503_A_16TO18_Avg',                  8546, 47,  9, 15, 29], // INDUSTRY: Local/State/Regional Government
        ['G5520_A_16TO18_Avg',                  1748, 36, 10, 17, 37], // INDUSTRY: Membership Organizations
        ['G5521_A_16TO18_Avg',                  2799, 38, 11, 15, 36], // INDUSTRY: Charitable and Religious Organizations and NGOs
        ['AFRIC_A_16TO18_Avg',                 51650, 46, 10, 13, 31], // REGION: Africa
        ['AFRICE_A_16TO18_Avg',                10730, 53,  8, 14, 25], // REGION: Eastern Africa
        ['AFRICN_A_16TO18_Avg',                21966, 42, 11, 14, 33], // REGION: Northern Africa
        ['AFRICS_A_16TO18_Avg',                13302, 46, 11, 12, 31], // REGION: Southern Africa
        ['AFRICSSAH_A_16TO18_Avg',             29428, 48,  9, 13, 29], // REGION: Sub-Saharan Africa
        ['AFRICW_A_16TO18_Avg',                 4195, 46,  8, 18, 29], // REGION: Western Africa
        ['ASIA_A_16TO18_Avg',                1210969, 50,  9, 13, 29], // REGION: Asia
        ['ASIAC_A_16TO18_Avg',                  4839, 58,  6, 17, 19], // REGION: Central Asia
        ['ASIAE_A_16TO18_Avg',                797413, 40,  9, 13, 37], // REGION: Eastern Asia
        ['ASIAPAC_A_16TO18_Avg',             1276884, 50,  9, 13, 29], // REGION: Asia/Pacific
        ['ASIAS_A_16TO18_Avg',                 90147, 64,  8, 11, 17], // REGION: Southern Asia
        ['ASIASE_A_16TO18_Avg',               183715, 56,  7, 14, 23], // REGION: South-Eastern Asia
        ['ASIAW_A_16TO18_Avg',                131094, 53, 11, 12, 25], // REGION: Western Asia
        ['EURO_A_16TO18_Avg',                1189303, 41, 11, 15, 33], // REGION: Europe
        ['EUROBALT_A_16TO18_Avg',               8207, 37,  6, 26, 31], // REGION: Baltic
        ['EUROBRIT_A_16TO18_Avg',             305899, 41, 11, 14, 34], // REGION: British and Irish Isles
        ['EUROE_A_16TO18_Avg',                316316, 43,  8, 18, 31], // REGION: Eastern Europe
        ['EURON_A_16TO18_Avg',                395631, 41, 11, 14, 34], // REGION: Northern Europe
        ['EUROS_A_16TO18_Avg',                248720, 42, 14, 11, 33], // REGION: Southern Europe
        ['EUROSCAN_A_16TO18_Avg',              80717, 42, 12, 15, 31], // REGION: Scandinavia
        ['EUROW_A_16TO18_Avg',                224981, 39, 12, 16, 33], // REGION: Western Europe
        ['LATC_A_16TO18_Avg',                 342796, 56, 13, 10, 22], // REGION: Latin America and the Caribbean
        ['LATCCAR_A_16TO18_Avg',                3341, 46, 13, 11, 30], // REGION: Caribbean
        ['LATCCENT_A_16TO18_Avg',              87454, 56, 12, 11, 21], // REGION: Central America
        ['LATCSAMER_A_16TO18_Avg',            250687, 56, 14,  8, 22], // REGION: South America
        ['MIDE_A_16TO18_Avg',                  84646, 55,  9, 11, 24], // REGION: Middle East
        ['MIDEA_A_16TO18_Avg',                153934, 51, 10, 12, 27], // REGION: Middle East/Africa
        ['MIDEGCC_A_16TO18_Avg',               76989, 56,  9, 11, 24], // REGION: Gulf Cooperation Council (GCC)
        ['MIDENA_A_16TO18_Avg',               106801, 53,  9, 12, 26], // REGION: Middle East/North Africa
        ['NORAM_A_16TO18_Avg',                886059, 51, 11, 12, 26], // REGION: North America
        ['OCEAN_A_16TO18_Avg',                 64550, 45, 12, 13, 30], // REGION: Oceania
        ['OCEANANZ_A_16TO18_Avg',              63549, 44, 12, 13, 31], // REGION: Australia and New Zealand
        ['ARE_A_16TO18_Avg',                   32474, 62,  8, 11, 20], // COUNTRY: United Arab Emirates
        ['ARG_A_16TO18_Avg',                   34158, 51, 13,  8, 27], // COUNTRY: Argentina
        ['AUS_A_16TO18_Avg',                   57745, 44, 12, 13, 31], // COUNTRY: Australia
        ['AUT_A_16TO18_Avg',                    6274, 51, 10, 16, 23], // COUNTRY: Austria
        ['BEL_A_16TO18_Avg',                   15139, 39, 14, 14, 32], // COUNTRY: Belgium
        ['BGR_A_16TO18_Avg',                    9803, 47,  7, 20, 27], // COUNTRY: Bulgaria
        ['BRA_A_16TO18_Avg',                  155023, 54, 16,  8, 22], // COUNTRY: Brazil
        ['CAN_A_16TO18_Avg',                   78456, 50, 12, 12, 26], // COUNTRY: Canada
        ['CHE_A_16TO18_Avg',                   38592, 44, 15, 15, 26], // COUNTRY: Switzerland
        ['CHL_A_16TO18_Avg',                   28129, 57, 14,  7, 22], // COUNTRY: Chile
        ['CHN_A_16TO18_Avg',                  177216, 53,  9, 13, 26], // COUNTRY: China
        ['COL_A_16TO18_Avg',                    9239, 63, 12,  8, 17], // COUNTRY: Colombia
        ['CRI_A_16TO18_Avg',                    3551, 61, 13,  8, 18], // COUNTRY: Costa Rica
        ['CZE_A_16TO18_Avg',                   19002, 35,  7, 25, 34], // COUNTRY: Czech Republic (Czechia)
        ['DEU_A_16TO18_Avg',                   67009, 41, 12, 17, 30], // COUNTRY: Germany
        ['DNK_A_16TO18_Avg',                    8194, 42, 15, 13, 30], // COUNTRY: Denmark
        ['EGY_A_16TO18_Avg',                   15225, 44, 11, 12, 33], // COUNTRY: Egypt
        ['ESP_A_16TO18_Avg',                  138991, 44, 15, 10, 31], // COUNTRY: Spain
        ['FIN_A_16TO18_Avg',                   22303, 47, 11, 17, 25], // COUNTRY: Finland
        ['FRA_A_16TO18_Avg',                   69070, 38, 13, 14, 35], // COUNTRY: France
        ['GBR_A_16TO18_Avg',                  292985, 41, 11, 14, 34], // COUNTRY: United Kingdom
        ['GRC_A_16TO18_Avg',                   14012, 49, 17, 10, 25], // COUNTRY: Greece
        ['HKG_A_16TO18_Avg',                   37528, 38,  9, 16, 37], // COUNTRY: Hong Kong Special Administrative Region of China
        ['HUN_A_16TO18_Avg',                   13040, 39, 10, 16, 34], // COUNTRY: Hungary
        ['IDN_A_16TO18_Avg',                   28813, 66,  8, 13, 14], // COUNTRY: Indonesia
        ['IND_A_16TO18_Avg',                   77170, 64,  8, 11, 17], // COUNTRY: India
        ['IRL_A_16TO18_Avg',                   11782, 41, 10, 15, 34], // COUNTRY: Ireland
        ['ISR_A_16TO18_Avg',                   16594, 47, 16, 12, 25], // COUNTRY: Israel
        ['ITA_A_16TO18_Avg',                   23641, 38, 15, 10, 36], // COUNTRY: Italy
        ['JOR_A_16TO18_Avg',                    5207, 53, 11, 11, 25], // COUNTRY: Jordan
        ['JPN_A_16TO18_Avg',                  558888, 26, 12, 13, 49], // COUNTRY: Japan
        ['KAZ_A_16TO18_Avg',                    4740, 56,  6, 18, 19], // COUNTRY: Kazakhstan
        ['KOR_A_16TO18_Avg',                    9785, 40, 11, 14, 35], // COUNTRY: Korea, South
        ['MEX_A_16TO18_Avg',                   80223, 56, 11, 11, 22], // COUNTRY: Mexico
        ['MUS_A_16TO18_Avg',                    5783, 51,  7, 12, 31], // COUNTRY: Mauritius
        ['MYS_A_16TO18_Avg',                   52020, 53,  7, 16, 25], // COUNTRY: Malaysia
        ['NLD_A_16TO18_Avg',                   21348, 40, 14, 13, 33], // COUNTRY: Netherlands
        ['NOR_A_16TO18_Avg',                   20815, 50, 13, 13, 24], // COUNTRY: Norway
        ['NZL_A_16TO18_Avg',                    5395, 47, 11, 13, 29], // COUNTRY: New Zealand
        ['PAN_A_16TO18_Avg',                    1271, 49, 15, 13, 23], // COUNTRY: Panama
        ['PER_A_16TO18_Avg',                   12615, 64, 10,  9, 18], // COUNTRY: Peru
        ['PHL_A_16TO18_Avg',                   16594, 65,  6, 11, 17], // COUNTRY: Philippines
        ['POL_A_16TO18_Avg',                   76228, 35,  7, 19, 39], // COUNTRY: Poland
        ['PRT_A_16TO18_Avg',                   43290, 41, 13, 12, 34], // COUNTRY: Portugal
        ['QAT_A_16TO18_Avg',                    3168, 66,  7, 11, 17], // COUNTRY: Qatar
        ['ROU_A_16TO18_Avg',                   14722, 52,  5, 19, 24], // COUNTRY: Romania
        ['RUS_A_16TO18_Avg',                  120161, 53,  9, 16, 22], // COUNTRY: Russian Federation
        ['SAU_A_16TO18_Avg',                   27635, 56,  8, 11, 24], // COUNTRY: Saudi Arabia
        ['SGP_A_16TO18_Avg',                   21818, 45,  9, 14, 31], // COUNTRY: Singapore
        ['SRB_A_16TO18_Avg',                    8496, 56,  9, 12, 23], // COUNTRY: Serbia
        ['SVK_A_16TO18_Avg',                    5432, 41,  9, 21, 29], // COUNTRY: Slovakia
        ['SWE_A_16TO18_Avg',                   26849, 41, 12, 14, 33], // COUNTRY: Sweden
        ['THA_A_16TO18_Avg',                   36063, 54,  9, 15, 22], // COUNTRY: Thailand
        ['TUR_A_16TO18_Avg',                   28441, 47, 13, 12, 28], // COUNTRY: Turkey
        ['TWN_A_16TO18_Avg',                   10499, 52, 10, 13, 25], // COUNTRY: Taiwan (Province of China)
        ['UKR_A_16TO18_Avg',                   50179, 49,  9, 19, 23], // COUNTRY: Ukraine
        ['USA_A_16TO18_Avg',                  806205, 51, 12, 12, 26], // COUNTRY: United States of America
        ['VNM_A_16TO18_Avg',                   22055, 62,  9, 11, 18], // COUNTRY: Vietnam
        ['ZAF_A_16TO18_Avg',                   13062, 49, 11, 12, 29], // COUNTRY: South Africa
        ['HP_A_16TO18_Avg',                   485138, 58, 10, 11, 21], // TOTAL: High Performing
        ['ESP_G40_A_16TO18_Avg',               77908, 46, 15,  9, 29], // COUNTRY x INDUSTRY: Spain Financials
        ['GBR_G25_A_16TO18_Avg',               75543, 39, 11, 14, 36], // COUNTRY x INDUSTRY: United Kingdom Industrials
        ['GBR_G30_A_16TO18_Avg',               19960, 38, 10, 15, 36], // COUNTRY x INDUSTRY: United Kingdom Consumer Goods
        ['GBR_G35_A_16TO18_Avg',               80066, 40, 11, 14, 35], // COUNTRY x INDUSTRY: United Kingdom Consumer Services
        ['GBR_G40_A_16TO18_Avg',               82136, 42, 13, 13, 33], // COUNTRY x INDUSTRY: United Kingdom Financials
        ['GBR_X9000_A_16TO18_Avg',             50933, 41, 11, 14, 35], // COUNTRY x INDUSTRY: United Kingdom Manufacturing
        ['JPN_G25_A_16TO18_Avg',              218500, 24, 12, 11, 53], // COUNTRY x INDUSTRY: Japan Industrials
        ['JPN_X9000_A_16TO18_Avg',            506038, 24, 12, 11, 52], // COUNTRY x INDUSTRY: Japan Manufacturing
        ['USA_G40_A_16TO18_Avg',              116049, 55, 12, 10, 23], // COUNTRY x INDUSTRY: United States of America Financials
        ['USA_X9000_A_16TO18_Avg',            202934, 50, 12, 11, 26], // COUNTRY x INDUSTRY: United States of America Manufacturing
        ['USA_X9001_A_16TO18_Avg',             77490, 39, 13, 12, 36], // COUNTRY x INDUSTRY: United States of America Automobiles and Automobile Parts
        ['ASIA_G40_A_16TO18_Avg',              93723, 52,  9, 13, 26], // REGION x INDUSTRY: Asia Financials
        ['EURO_G40_A_16TO18_Avg',             366915, 42, 12, 14, 32], // REGION x INDUSTRY: Europe Financials
        ['EURO_X9000_A_16TO18_Avg',           369078, 42, 11, 15, 33], // REGION x INDUSTRY: Europe Manufacturing
        ['NORAM_X9000_A_16TO18_Avg',          232315, 51, 12, 11, 26], // REGION x INDUSTRY: North America Manufacturing
        ['NORAM_X9001_A_16TO18_Avg',           90884, 47, 11, 11, 31], // REGION x INDUSTRY: North America Automobiles and Automobile Parts
        ['GBR_G251_A_16TO18_Avg',              10265, 41, 10, 13, 36], // COUNTRY x INDUSTRY: United Kingdom Industrial Goods
        ['GBR_G252_A_16TO18_Avg',              13242, 36, 12, 15, 37], // COUNTRY x INDUSTRY: United Kingdom High Technology
        ['GBR_G254_A_16TO18_Avg',              10113, 32, 12, 15, 41], // COUNTRY x INDUSTRY: United Kingdom Services
        ['GBR_G350_A_16TO18_Avg',              55618, 41, 12, 13, 34], // COUNTRY x INDUSTRY: United Kingdom Retail
        ['GBR_G402_A_16TO18_Avg',              10606, 44, 11, 13, 32], // COUNTRY x INDUSTRY: United Kingdom Financial Services
        ['JPN_G251_A_16TO18_Avg',              95034, 25, 12, 12, 51], // COUNTRY x INDUSTRY: Japan Industrial Goods
        ['USA_G350_A_16TO18_Avg',             136022, 54, 11, 11, 24], // COUNTRY x INDUSTRY: United States of America Retail
        ['USA_G402_A_16TO18_Avg',              31832, 57, 10, 10, 23], // COUNTRY x INDUSTRY: United States of America Financial Services
        ['ASIAPAC_G400_A_16TO18_Avg',          69854, 48, 12, 12, 28], // REGION x INDUSTRY: Asia/Pacific Banks
        ['EURO_G350_A_16TO18_Avg',             71884, 39, 13, 13, 35], // REGION x INDUSTRY: Europe Retail
        ['EURO_G400_A_16TO18_Avg',            313695, 43, 13, 14, 30], // REGION x INDUSTRY: Europe Banks
        ['MIDE_G400_A_16TO18_Avg',             24555, 49,  9, 12, 30], // REGION x INDUSTRY: Middle East Banks
        ['MIDEGCC_G400_A_16TO18_Avg',          22464, 51,  8, 12, 29], // REGION x INDUSTRY: Gulf Cooperation Council (GCC) Banks
        ['MIDENA_G400_A_16TO18_Avg',           35528, 46,  9, 12, 33] // REGION x INDUSTRY: Middle East/North Africa Banks
	];
	
	static function GetByNormId (norm_id) {
		for (var i=0; i<DistributionLookup.length; ++i) {
          	var item = DistributionLookup[i];
			if (norm_id == item[0]) {
				return {
					ValidN: item[1],
					Effective: item[2],
					Frustrated: item[3],
					Detached: item[4],
					Ineffective: item[5]
				}
			}
		}
	}
}