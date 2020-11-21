import { lookup, Lookup } from "geoip-lite";

export interface IIPInfo {
  error?: string;
  data?: Lookup;
  ip?: string;
}

const getIpInfo = function (ip: string): IIPInfo {
  // IPV6 addresses can include IPV4 addresses
  // So req.ip can be '::ffff:86.3.182.58'
  // However geoip-lite returns null for these
  if (ip.includes("::ffff:")) {
    ip = ip.split(":").reverse()[0];
  }
  var lookedUpIP = lookup(ip);
  if (ip === "127.0.0.1" || ip === "::1") {
    return { error: "This won't work on localhost" };
  }
  if (!lookedUpIP) {
    return { error: "Error occured while trying to process the information" };
  }
  return { data: lookedUpIP };
};

export const ip_middleware = (req: Express.Request, _: Express.Response, next: any) => {
  const xForwardedFor = ((req as any).headers["x-forwarded-for"] || "").replace(/:\d+$/, "");
  const ip = xForwardedFor || (req as any).connection.remoteAddress;
  const info = getIpInfo(ip);
  req.ip_address = { data: info.data, error: info.error, ip: ip };
  next();
};
