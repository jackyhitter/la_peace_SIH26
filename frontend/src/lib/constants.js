// frontend/src/lib/constants.js
// These values are seeded for the SIH demo.
// In a production deployment, camera positions and heatmap weights
// come from the backend camera management API.

export const CHANDIGARH_CENTER = [76.7794, 30.7333];
export const DEMO_DAY = "2025-06-14";

export const CAMERA_NODES = [
  { id: "CAM-01", coords: [76.8020, 30.7580], sector: "Sector 1", label: "Sector 1 / Jan Marg (Capitol Complex)", status: "active" },
  { id: "CAM-02", coords: [76.7975, 30.7562], sector: "Sector 2", label: "Sector 2 / Boulevard Road North", status: "active" },
  { id: "CAM-03", coords: [76.8140, 30.7510], sector: "Sector 3", label: "Sector 3 / Sukhna Lake Entry Gate", status: "active" },
  { id: "CAM-04", coords: [76.8090, 30.7485], sector: "Sector 4", label: "Sector 4 / Golf Course Roundabout", status: "active" },
  { id: "CAM-05", coords: [76.8040, 30.7450], sector: "Sector 5", label: "Sector 5 / Lake Club Crossing", status: "active" },
  { id: "CAM-06", coords: [76.7930, 30.7490], sector: "Sector 6", label: "Sector 6 / Secretariat Access Point", status: "active" },
  { id: "CAM-07", coords: [76.7751, 30.7389], sector: "Sector 7", label: "Sector 7 / Udyog Path Crossing", status: "active" },
  { id: "CAM-08", coords: [76.7990, 30.7370], sector: "Sector 8", label: "Sector 8 / Madhya Marg Corridor", status: "active" },
  { id: "CAM-09", coords: [76.7890, 30.7440], sector: "Sector 9", label: "Sector 9 / Matka Chowk Junction", status: "active" },
  { id: "CAM-10", coords: [76.7985, 30.7543], sector: "Sector 10", label: "Sector 10 / Government Museum Chowk", status: "active" },
  { id: "CAM-11", coords: [76.7880, 30.7530], sector: "Sector 11", label: "Sector 11 / Geri Route Entry", status: "active" },
  { id: "CAM-12", coords: [76.7770, 30.7650], sector: "Sector 12", label: "Sector 12 / PGI Main Hospital Gate", status: "active" },
  { id: "CAM-13", coords: [76.7874, 30.7601], sector: "Sector 14", label: "Sector 14 / Panjab University Gate 1", status: "active" },
  { id: "CAM-14", coords: [76.7814, 30.7498], sector: "Sector 15", label: "Sector 15 / Madhya Marg Junction", status: "active" },
  { id: "CAM-15", coords: [76.7840, 30.7460], sector: "Sector 16", label: "Sector 16 / Rose Garden Entrance", status: "active" },
  { id: "CAM-16", coords: [76.7846, 30.7412], sector: "Sector 17", label: "Sector 17 / Plaza North Entrance", status: "active" },
  { id: "CAM-17", coords: [76.7832, 30.7390], sector: "Sector 17", label: "Sector 17 / ISBT Bus Stand Terminal", status: "active" },
  { id: "CAM-18", coords: [76.7900, 30.7360], sector: "Sector 18", label: "Sector 18 / Press Building Chowk", status: "active" },
  { id: "CAM-19", coords: [76.7960, 30.7300], sector: "Sector 19", label: "Sector 19 / Sadar Bazar Access", status: "active" },
  { id: "CAM-20", coords: [76.7852, 30.7294], sector: "Sector 20", label: "Sector 20 / Himalaya Marg Crossing", status: "active" },
  { id: "CAM-21", coords: [76.7790, 30.7315], sector: "Sector 21", label: "Sector 21 / Aroma Light Point", status: "active" },
  { id: "CAM-22", coords: [76.7910, 30.7340], sector: "Sector 22", label: "Sector 22 / Shopping Complex (Kiran)", status: "active" },
  { id: "CAM-23", coords: [76.7680, 30.7375], sector: "Sector 23", label: "Sector 23 / All-Weather Pool Road", status: "active" },
  { id: "CAM-24", coords: [76.7620, 30.7420], sector: "Sector 24", label: "Sector 24 / Batra Cinema Chowk", status: "active" },
  { id: "CAM-25", coords: [76.7560, 30.7515], sector: "Sector 25", label: "Sector 25 / Kumhar Colony Outer Road", status: "active" },
  { id: "CAM-26", coords: [76.8120, 30.7280], sector: "Sector 26", label: "Sector 26 / Grain Market Main Gate", status: "active" },
  { id: "CAM-27", coords: [76.8040, 30.7210], sector: "Sector 27", label: "Sector 27 / Transport Chowk Approach", status: "active" },
  { id: "CAM-28", coords: [76.8100, 30.7180], sector: "Sector 28", label: "Sector 28 / Motor Market Crossing", status: "active" },
  { id: "CAM-29", coords: [76.8010, 30.7100], sector: "Sector 29", label: "Sector 29 / Iron Market Junction", status: "active" },
  { id: "CAM-30", coords: [76.7920, 30.7140], sector: "Sector 30", label: "Sector 30 / Police Lines Outer Wall", status: "active" },
  { id: "CAM-31", coords: [76.7950, 30.7020], sector: "Sector 31", label: "Sector 31 / Air Force Station Gate", status: "fault" },
  { id: "CAM-32", coords: [76.7860, 30.7080], sector: "Sector 32", label: "Sector 32 / GMCH Hospital Chowk", status: "active" },
  { id: "CAM-33", coords: [76.7780, 30.7150], sector: "Sector 33", label: "Sector 33 / Landmark Terraced Garden", status: "active" },
  { id: "CAM-34", coords: [76.7690, 30.7220], sector: "Sector 34", label: "Sector 34 / Sub-City Centre Bank Sq", status: "active" },
  { id: "CAM-35", coords: [76.7640, 30.7250], sector: "Sector 35", label: "Sector 35 / JW Marriott Light Point", status: "active" },
  { id: "CAM-36", coords: [76.7570, 30.7300], sector: "Sector 36", label: "Sector 36 / Fragrance Garden Road", status: "active" },
  { id: "CAM-37", coords: [76.7490, 30.7350], sector: "Sector 37", label: "Sector 37 / Beant Singh Memorial Gate", status: "active" },
  { id: "CAM-38", coords: [76.7420, 30.7410], sector: "Sector 38", label: "Sector 38 / Vivek High School Chowk", status: "active" },
  { id: "CAM-39", coords: [76.7340, 30.7460], sector: "Sector 39", label: "Sector 39 / Grain Market West Gate", status: "active" },
  { id: "CAM-40", coords: [76.7390, 30.7320], sector: "Sector 40", label: "Sector 40 / Community Centre Point", status: "active" },
  { id: "CAM-41", coords: [76.7460, 30.7240], sector: "Sector 41", label: "Sector 41 / Badheri Village Bypass", status: "active" },
  { id: "CAM-42", coords: [76.7530, 30.7180], sector: "Sector 42", label: "Sector 42 / Hockey Stadium Road", status: "active" },
  { id: "CAM-43", coords: [76.7600, 30.7120], sector: "Sector 43", label: "Sector 43 / ISBT New Inter-State Bus", status: "active" },
  { id: "CAM-44", coords: [76.7680, 30.7060], sector: "Sector 44", label: "Sector 44 / Government School Chowk", status: "fault" },
  { id: "CAM-45", coords: [76.7750, 30.7010], sector: "Sector 45", label: "Sector 45 / Burail Barrier Crossing", status: "active" },
  { id: "CAM-46", coords: [76.8145, 30.7102], sector: "Sector 47", label: "Sector 47 / IT Park Access Highway", status: "active" },
];

export const HEATMAP_WEIGHTS = {
  "CAM-01": 0.45, "CAM-02": 0.52, "CAM-03": 0.38, "CAM-04": 0.42, "CAM-05": 0.48,
  "CAM-06": 0.78, "CAM-07": 0.95, "CAM-08": 0.90, "CAM-09": 0.72, "CAM-10": 0.87,
  "CAM-11": 0.65, "CAM-12": 0.88, "CAM-13": 0.55, "CAM-14": 0.60, "CAM-15": 0.62,
  "CAM-16": 0.98, "CAM-17": 0.92, "CAM-18": 0.58, "CAM-19": 0.64, "CAM-20": 0.69,
  "CAM-21": 0.75, "CAM-22": 0.88, "CAM-23": 0.59, "CAM-24": 0.53, "CAM-25": 0.49,
  "CAM-26": 0.44, "CAM-27": 0.46, "CAM-28": 0.61, "CAM-29": 0.67, "CAM-30": 0.72,
  "CAM-31": 0.15, "CAM-32": 0.60, "CAM-33": 0.54, "CAM-34": 0.51, "CAM-35": 0.63,
  "CAM-36": 0.47, "CAM-37": 0.50, "CAM-38": 0.52, "CAM-39": 0.48, "CAM-40": 0.56,
  "CAM-41": 0.58, "CAM-42": 0.62, "CAM-43": 0.65, "CAM-44": 0.10, "CAM-45": 0.55,
  "CAM-46": 0.52,
};
