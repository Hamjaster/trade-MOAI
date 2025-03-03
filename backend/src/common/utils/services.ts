import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import moment, { Moment } from "moment";
import jwt from "jsonwebtoken";
import { Config } from "./envConfig";

const transport = nodemailer.createTransport(Config.EMAIL_CONFIG);

/* istanbul ignore next */
transport
  .verify()
  .then(() => console.log("Connected to email server"))
  .catch(() =>
    console.log(
      "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
    )
  );

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  console.log("Sending email");
  const msg = { from: "hamzasepal@gmail.com", to, subject, text, html };
  await transport.sendMail(msg);
};

export function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function generateToken(
  data: any,
  expires?: Moment,
  secret = Config.JWT_SECRET
) {
  let payload;
  if (expires) {
    payload = {
      sub: data,
      iat: moment().unix(),
      exp: expires.unix(),
    };
  } else {
    payload = {
      sub: data,
      iat: moment().unix(),
    };
  }
  const tokken = jwt.sign(payload, secret);
  return tokken;
}

export function removeMetadataFromCSV(csvContent : any) {
  // Split the CSV content into lines
  const lines = csvContent.split('\n');
  
  // Remove the first line (metadata)
  lines.shift();
  
  // Join the remaining lines back together
  return lines.join('\n');
}

export const formatDateForAPI = (date: Date): string => {
  const pad = (num: number) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-based
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
export const parseDate = (dateString: string): Date => {
  const [datePart, timePart] = dateString.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);

  return new Date(year, month - 1, day, hours, minutes, seconds);
};


export function fixDatasetErrors(data) {
  /**
   * Fixes errors in the dataset where:
   * - close > high (set close = high)
   * - open < low (set open = low)
   *
   * @param {Array} data - An array of objects containing financial data.
   * @returns {Array} - The corrected dataset.
   */
  return data.map(entry => {
      // Fix close > high
      if (entry.close > entry.high) {
          entry.close = entry.high;
      }

      // Fix open < low
      if (entry.open < entry.low) {
          entry.open = entry.low;
      }

      return entry;
  });
}

// Helper function to generate month-year combinations between dates
export const getMonthsBetweenDates = (startDate: Date, endDate: Date): string[] => {
  const months = [];
  const current = moment(startDate).startOf('month');
  const end = moment(endDate).endOf('month');
  
  while (current.isBefore(end)) {
    months.push(current.format('YYYY-MM'));
    current.add(1, 'month');
  }
  
  return months;
};
