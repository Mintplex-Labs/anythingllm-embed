// Color utilities
export const Colors = {
  blue: "#3b82f6",
  sky: "#0ea5e9",
  cyan: "#06b6d4",
  teal: "#14b8a6",
  emerald: "#10b981",
  green: "#22c55e",
  lime: "#84cc16",
  yellow: "#eab308",
  amber: "#f59e0b",
  orange: "#f97316",
  red: "#ef4444",
  rose: "#f43f5e",
  pink: "#ec4899",
  fuchsia: "#d946ef",
  purple: "#a855f7",
  violet: "#8b5cf6",
  indigo: "#6366f1",
  neutral: "#737373",
  stone: "#78716c",
  gray: "#6b7280",
  slate: "#64748b",
  zinc: "#71717a",
};

export function getColor(color) {
  return Colors[color] || Colors.blue;
}

export const CHART_COLORS = [
  Colors.blue, 
  Colors.emerald, 
  Colors.violet, 
  Colors.amber, 
  Colors.rose, 
  Colors.cyan
];

// Data formatter
export const dataFormatter = (number) => {
  return new Intl.NumberFormat('en-US').format(number).toString();
};

// JSON parser
export function safeJsonParse(jsonString, fallback = null) {
  try {
    return JSON.parse(jsonString);
  } catch (x) {
    console.error("Failed to parse data", x);
  }
  return fallback;
}

// Auto-detect value key from data
export const getValueKey = (data) => {
  if (!data || data.length === 0) return "value";
  const firstItem = data[0];
  
  // Check if 'value' key exists
  if ('value' in firstItem) return 'value';
  
  // Find the first numeric field that isn't 'name'
  for (const [key, val] of Object.entries(firstItem)) {
    if (key !== 'name' && (typeof val === 'number' || !isNaN(Number(val)))) {
      return key;
    }
  }
  
  // Fallback to second key if no numeric field found
  const keys = Object.keys(firstItem);
  return keys.find(k => k !== 'name') || keys[1] || 'value';
};
