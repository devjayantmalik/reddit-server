export const __prod__ = process.env.NODE_ENV === "production";
export const __port__ = process.env.PORT || 4000;
export const __winston_log_level__ = process.env.LOG_LEVEL || "silly";
export const __session_secret__ = process.env.SESSION_SECRET || "e071c1340ce30fa3144d";
