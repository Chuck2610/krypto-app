
function berechne() {
  const einsatz = parseFloat(document.getElementById('einsatz').value);
  const tage = parseInt(document.getElementById('tage').value);
  const zins1 = parseFloat(document.getElementById('zins').value);
  const p = parseFloat(document.getElementById("einsatzProzent").value) / 100;

  if (!einsatz || !tage || !zins1 || !p) {
    document.getElementById('ergebnis').innerHTML =
      "<span style='color: #f87171;'>Bitte alle Felder korrekt ausfüllen.</span>";
    return;
  }

  const labels = [], werte1 = [], tabelle = [];
  let kapital = einsatz;

  for (let i = 0; i <= tage; i++) {
    const einsatzBetrag = kapital * p;
    const gewinn = einsatzBetrag * (zins1 / 100);
    const kapitalNeu = kapital + gewinn;

    werte1.push(kapital.toFixed(2));
    labels.push(i);

    tabelle.push({
      tag: i,
      zinssatz: zins1.toFixed(2),
      kapital: kapital,
      einsatz: einsatzBetrag,
      gewinn: gewinn
    });

    kapital = kapitalNeu;
  }

  const endbetrag = kapital;
  const reingewinn = endbetrag - einsatz;

  document.getElementById("ergebnis").innerHTML =
    `<strong>📊 Endbetrag nach ${tage} Tagen bei ${zins1}% Gewinn auf ${p * 100} % Einsatz:</strong> 
     ${endbetrag.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}<br/>
     <strong>💰 Reingewinn:</strong> 
     ${reingewinn.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`;

  let tableHTML = "<table><thead><tr><th>Tag</th><th>Zinssatz %</th><th>Kapital (€)</th><th>Einsatz (€)</th><th>Gewinn (€)</th></tr></thead><tbody>";
  tabelle.forEach(row => {
    tableHTML += `<tr>
      <td>${row.tag}</td>
      <td>${row.zinssatz}</td>
      <td>${row.kapital.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
      <td>${row.einsatz.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
      <td>${row.gewinn.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
    </tr>`;
  });
  tableHTML += "</tbody></table>";
  document.getElementById("entwicklungsliste").innerHTML = tableHTML;

  // Für PDF-Export speichern
  window.letztesErgebnis = {
    tage,
    startkapital: einsatz,
    einsatzProzent: p * 100,
    zins1,
    endkapital: endbetrag,
    reingewinn: reingewinn,
    tabelleHTML: tableHTML
  };
}

function exportierePDF() {
  const title = document.getElementById("reportTitle").value || "Kapitalentwicklung";
  const daten = window.letztesErgebnis;

  if (!daten) {
    alert("Bitte zuerst die Berechnung durchführen.");
    return;
  }

  const container = document.createElement("div");
  container.innerHTML = `
    <div style="font-family: Arial; padding: 30px; max-width: 800px; color: #000;">
      <h1 style="text-align: center; color: #00bfa5; font-size: 26px;">📄 ${title}</h1>
      <hr style="margin: 20px 0;">
      <p><strong>📅 Zeitraum:</strong> ${daten.tage} Tage</p>
      <p><strong>💶 Startkapital:</strong> ${daten.startkapital.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
      <p><strong>📈 Täglicher Einsatz:</strong> ${daten.einsatzProzent.toFixed(2)}%</p>
      <p><strong>📊 Gewinn auf Einsatz:</strong> ${daten.zins1.toFixed(2)}%</p>
      <p><strong>📊 Endbetrag:</strong> <strong>${daten.endkapital.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</strong></p>
      <p><strong>💰 Reingewinn:</strong> <strong>${daten.reingewinn.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</strong></p>
      <hr style="margin: 30px 0;">
      <h2 style="font-size: 18px; margin-bottom: 10px;">📋 Entwicklungstabelle</h2>
      ${daten.tabelleHTML}
      <footer style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
        Bericht erstellt am ${new Date().toLocaleDateString('de-DE')}
      </footer>
    </div>
  `;

  html2pdf().set({
    margin: 0.5,
    filename: `${title.replace(/\s+/g, "_")}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }).from(container).save();
}
