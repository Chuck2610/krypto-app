
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
    <div style="font-family: 'Segoe UI', sans-serif; padding: 30px; max-width: 800px; color: #000; background: #fff;">
      <h2 style="text-align: center; color: #00bfa5; font-size: 26px; margin-bottom: 20px;">📄 ${titel}</h2>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 30px;">
        <div><strong>📅 Zeitraum:</strong><br>${daten.tage} Tage</div>
        <div><strong>💶 Startkapital:</strong><br>${daten.startkapital.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</div>
        <div><strong>📈 Täglicher Einsatz:</strong><br>${daten.einsatzProzent} %</div>
        <div><strong>📊 Gewinn auf Einsatz:</strong><br>${daten.zins1} %</div>
        <div><strong>🏁 Endbetrag:</strong><br><strong>${daten.endkapital.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</strong></div>
      </div>

      <div style="border-top: 1px solid #ddd; margin: 30px 0;"></div>

      <h3 style="margin-bottom: 10px; font-size: 18px; color: #333;">📈 Kapitalentwicklung</h3>
      <img src="${chartDataURL}" style="width: 100%; margin: 20px 0; border: 1px solid #ccc; border-radius: 8px;" />

      <h3 style="margin: 30px 0 10px; font-size: 18px; color: #333;">📋 Entwicklungstabelle (alle 5 Tage)</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr style="background-color: #00ffc3; color: black;">
            <th style="padding: 8px; text-align: center;">Tag</th>
            <th style="padding: 8px; text-align: right;">Zinssatz (%)</th>
            <th style="padding: 8px; text-align: right;">Kapital (€)</th>
            <th style="padding: 8px; text-align: right;">Einsatz (€)</th>
            <th style="padding: 8px; text-align: right;">Gewinn (€)</th>
          </tr>
        </thead>
        <tbody>
          ${daten.tabelle.filter((r, i) => i % 5 === 0 || i === daten.tabelle.length - 1).map(row => `
            <tr>
              <td style="padding: 6px; text-align: center;">${row.tag}</td>
              <td style="padding: 6px; text-align: right;">${row.zinssatz}</td>
              <td style="padding: 6px; text-align: right;">${row.kapital.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
              <td style="padding: 6px; text-align: right;">${row.einsatz.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
              <td style="padding: 6px; text-align: right;">${row.gewinn.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <footer style="margin-top: 50px; font-size: 12px; text-align: center; color: #888;">
        Bericht erstellt am ${new Date().toLocaleDateString('de-DE')}
      </footer>
    </div>
  `;
  return container;
}
