import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.AZURE_ENDPOINT;
const key = process.env.AZURE_KEY;

export async function analyzeInvoice(file) {
  const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
  
  // Read the file as an ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  
  const poller = await client.beginAnalyzeDocument("prebuilt-invoice", arrayBuffer);
  const { documents: [result] } = await poller.pollUntilDone();
  
  if (result) {
    const invoice = result.fields;
    return {
      VendorName: invoice.VendorName?.content,
      CustomerName: invoice.CustomerName?.content,
      InvoiceDate: invoice.InvoiceDate?.content,
      DueDate: invoice.DueDate?.content,
      SubTotal: invoice.SubTotal?.content,
      TotalTax: invoice.TotalTax?.content,
      AmountDue: invoice.AmountDue?.content,
    };
  } else {
    throw new Error("Expected at least one invoice in the result.");
  }
}
