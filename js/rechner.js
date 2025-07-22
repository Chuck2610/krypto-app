
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

  const ctx = document.getElementById('chart').getContext('2d');
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Kapitalentwicklung`,
        data: werte1,
        borderColor: '#00e6b8',
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: ctx => `Kapital: ${parseFloat(ctx.raw).toLocaleString('de-DE', {
              style: 'currency',
              currency: 'EUR'
            })}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });

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
    tabelle
  };
}

function generiereExportTemplate(daten, chartDataURL, titel) {
  const container = document.createElement('div');
  container.innerHTML = `
    <div style="font-family: Arial; padding: 25px; max-width: 800px; color: #000; background: #fff;">
      <h2 style="text-align: center;">${titel}</h2>
      <p><strong>📅 Zeitraum:</strong> ${daten.tage} Tage</p>
      <p><strong>💶 Startkapital:</strong> ${daten.startkapital.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
      <p><strong>📈 Täglicher Einsatz:</strong> ${daten.einsatzProzent} %</p>
      <p><strong>📊 Zinssatz auf Einsatz:</strong> ${daten.zins1} %</p>
      <p><strong>🏁 Endbetrag:</strong> ${daten.endkapital.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
      <div style="page-break-after: always;"></div>
      <h3>📈 Kapitalentwicklung</h3>
      <img src="${chartDataURL}" style="width: 100%; margin: 20px 0;" />
      <h3>📋 Entwicklungstabelle (alle 5 Tage)</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="text-align: center;">Tag</th>
            <th>Zinssatz (%)</th>
            <th>Kapital (€)</th>
            <th>Einsatz (€)</th>
            <th>Gewinn (€)</th>
          </tr>
        </thead>
        <tbody>
          ${daten.tabelle.filter((r, i) => i % 5 === 0 || i === daten.tabelle.length - 1).map(row => `
            <tr>
              <td style="text-align: center;">${row.tag}</td>
              <td style="text-align: right;">${row.zinssatz}</td>
              <td style="text-align: right;">${row.kapital.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
              <td style="text-align: right;">${row.einsatz.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
              <td style="text-align: right;">${row.gewinn.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      <footer style="margin-top: 40px; font-size: 12px; color: #555; text-align: center;">
        © 2025 Zinseszins-Rechner – Erstellt am ${new Date().toLocaleDateString('de-DE')}
      </footer>
    </div>
  `;
  return container;
}

function exportierePDF() {
  const title = document.getElementById("reportTitle").value || "Kapitalentwicklung";
  const chartCanvas = document.getElementById("chart");
  const chartImgURL = chartCanvas.toDataURL();

  if (!window.letztesErgebnis) {
    alert("Bitte zuerst die Berechnung durchführen.");
    return;
  }

  const element = generiereExportTemplate(window.letztesErgebnis, chartImgURL, title);

  html2pdf().set({
    margin: 0.5,
    filename: `${title.replace(/\s+/g, "_")}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }).from(element).save();
}
