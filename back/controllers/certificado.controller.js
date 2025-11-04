import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();


export const generarCertificado = (req, res) => {
  console.log(req.body);
  const {
    nombreCompleto,
    certificacion,
    fecha,
    ciudad = "Aguascalientes",
    instructor = "Ing. Obed Alejandro Loera Quiroz",
    ceo = "Universidad Autonoma de Aguascalientes"
  } = req.body;

  const logoPath = path.join(__dirname, "public/img/logo.png");
  const firmaInstructorPath = path.join(__dirname, "public/img/firma_instructor.png");
  const firmaCEOPath = path.join(__dirname, "public/img/firma_ceo.png");

  try {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Certificado_${certificacion}.pdf`
    );

    doc.pipe(res);

    // === BORDE EXTERIOR ===
    doc
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .strokeColor("#003366")
      .lineWidth(4)
      .stroke();

    // === LOGO ===
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width / 2 - 60, 50, { width: 120 });
    }

    // === ENCABEZADO ===
    doc.moveDown(4);
    doc.font("Helvetica-Bold").fontSize(24).fillColor("#003366");
    doc.text("Pamilon Tech Certifications", { align: "center" });

    doc.moveDown();
    doc.fontSize(16).fillColor("#000000");
    doc.text("Otorga el presente", { align: "center" });

    // === NOMBRE DEL USUARIO ===
    doc.moveDown(2);
    doc.font("Helvetica-Bold").fontSize(28).fillColor("#111111");
    doc.text(nombreCompleto, { align: "center" });

    doc.moveDown();
    doc.font("Helvetica").fontSize(16);
    doc.text("Por haber aprobado satisfactoriamente la certificación:", { align: "center" });
    doc.moveDown(1);
    doc.font("Helvetica-Bold").fontSize(20).fillColor("#003366");
    doc.text(certificacion, { align: "center" });

    // === FECHA Y CIUDAD ===
    doc.moveDown(2);
    doc.font("Helvetica").fontSize(14);
    doc.text(`Fecha de emisión: ${fecha}`, { align: "center" });
    doc.text(`Ciudad: ${ciudad}`, { align: "center" });

    // === FRASE ===
    doc.moveDown(2);
    doc.font("Helvetica-Oblique").fontSize(12).fillColor("#333");
    doc.text("“Certifica tu talento, impulsa tu futuro.”", { align: "center" });

    // === FIRMAS ===
    const yFirma = doc.page.height - 180;
    const xIzq = 100;
    const xDer = doc.page.width - 250;

    doc.moveTo(xIzq, yFirma).lineTo(xIzq + 150, yFirma).stroke();
    doc.moveTo(xDer, yFirma).lineTo(xDer + 150, yFirma).stroke();

    if (fs.existsSync(firmaInstructorPath)) {
      doc.image(firmaInstructorPath, xIzq, yFirma - 60, { width: 150 });
    }
    if (fs.existsSync(firmaCEOPath)) {
      doc.image(firmaCEOPath, xDer, yFirma - 60, { width: 150 });
    }

    doc.font("Helvetica-Bold").fontSize(12);
    doc.text(instructor, xIzq, yFirma + 10, { width: 150, align: "center" });
    doc.text(ceo, xDer, yFirma + 10, { width: 150, align: "center" });

    doc.font("Helvetica").fontSize(10);
    doc.text("Instructor", xIzq, yFirma + 25, { width: 150, align: "center" });
    doc.text("CEO - Pamilon Tech Certifications", xDer, yFirma + 25, { width: 150, align: "center" });

    doc.end();
  } catch (err) {
    console.error("❌ Error generando PDF:", err);
    res.status(500).json({ error: "No se pudo generar el certificado" });
  }
};
