export function renderChemicalFormula(formula, options = {}) {
  const { decorated = false } = options;

  if (!formula) return "";

  const html = formula.replace(/([A-Za-z\)])(\d+)/g, (_, symbol, num) => {
    return `${symbol}<sub>${num}</sub>`;
  });

  if (!decorated) {
    return `<span class="chem-formula" dir="ltr">${html}</span>`;
  }

  return `<span class="chem-formula chem-formula--decorated" dir="ltr">${html}</span>`;
}

export function explainFormula(formula, options = {}) {
  const { mode = "subscript" } = options;

  if (mode === "subscript") {
    if (formula === "H2O") {
      return `
        <div class="explain-block">
          <div class="explain-block__formula">${renderChemicalFormula("H2O", { decorated: true })}</div>
          <ul class="explain-list">
            <li><strong>H</strong> = מימן</li>
            <li><strong>₂</strong> = יש שני אטומי מימן</li>
            <li><strong>O</strong> = אטום חמצן אחד</li>
          </ul>
          <p class="explain-note">הציון התחתי משפיע רק על האטום שלפניו.</p>
        </div>
      `;
    }

    return `
      <div class="explain-block">
        <div class="explain-block__formula">${renderChemicalFormula(formula, { decorated: true })}</div>
        <p>ציון תחתי הוא המספר שמופיע אחרי הסימול הכימי, והוא אומר כמה אטומים מאותו סוג יש במולקולה אחת.</p>
      </div>
    `;
  }

  if (mode === "coefficient") {
    if (formula === "2H2O") {
      return `
        <div class="explain-block">
          <div class="explain-block__formula">${renderChemicalFormula("2H2O", { decorated: true })}</div>
          <ul class="explain-list">
            <li><strong>2</strong> = שתי מולקולות מים</li>
            <li>בכל מולקולה יש <strong>H₂O</strong></li>
            <li>סה"כ: 4 אטומי מימן ו-2 אטומי חמצן</li>
          </ul>
          <div class="molecule-copies">
            <div class="copy">${renderChemicalFormula("H2O")}</div>
            <div class="copy">${renderChemicalFormula("H2O")}</div>
          </div>
          <p class="explain-note">המקדם מכפיל את כל מה שאחריו.</p>
        </div>
      `;
    }

    return `
      <div class="explain-block">
        <div class="explain-block__formula">${renderChemicalFormula(formula, { decorated: true })}</div>
        <p>מקדם הוא המספר שמופיע לפני הנוסחה הכימית, והוא אומר כמה מולקולות יש.</p>
      </div>
    `;
  }

  return `<div class="explain-block">${renderChemicalFormula(formula)}</div>`;
}