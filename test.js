// {ガソリン・洗車=交通費, 日用品・不定期=日用品, 日用品・毎月=日用品, 電車・ECT・その他交通系=交通費, 外食・その他=食費, 自炊=食費}
function getCategoryMap(categoryData) {
  return categoryData.reduce((map, item) => {
    map[item.詳細カテゴリ] = item.カテゴリ;
    return map;
  }, {});
}

function getAllCategories(categoryData) {
  return [...new Set(categoryData.map(item => item.カテゴリ))];
}

function getAllCategoriesDetail(categoryData) {
  return [...new Set(categoryData.map(item => item.詳細カテゴリ))];
}

function generateMonths(startY, startM, endY, endM) {
  const months = new Set();
  for (let y = startY; y <= endY; y++) {
    const fromM = y === startY ? startM : 1;
    const toM = y === endY ? endM : 12;
    for (let m = fromM; m <= toM; m++) {
      months.add(`${y}-${String(m).padStart(2, "0")}`);
    }
  }
  return months;
}

function processData(data, categoryMap, monthlyCategorySums, months) {
  for (const row of data) {
    const date = new Date(row.タイムスタンプ);
    const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    months.add(month);
    const baseCat = categoryMap[row.詳細カテゴリ] || row.詳細カテゴリ;
    monthlyCategorySums[month] = monthlyCategorySums[month] || {};
    monthlyCategorySums[month][baseCat] = (monthlyCategorySums[month][baseCat] || 0) + row.支出金額;
  }
}

function processDataDetail(data, monthlyCategorySums, months) {
  for (const row of data) {
    const date = new Date(row.タイムスタンプ);
    const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    months.add(month);
    const baseCat = row.詳細カテゴリ;
    monthlyCategorySums[month] = monthlyCategorySums[month] || {};
    monthlyCategorySums[month][baseCat] = (monthlyCategorySums[month][baseCat] || 0) + row.支出金額;
  }
}

function initializeMonthlySums(monthlyCategorySums, months, allCategories) {
  for (const m of months) {
    monthlyCategorySums[m] = monthlyCategorySums[m] || {};
    for (const cat of allCategories) {
      if (!monthlyCategorySums[m][cat]) monthlyCategorySums[m][cat] = 0;
    }
  }
}

function buildHtmlTable(monthlyCategorySums, months, allCategories) {
  const sortedMonths = [...months].sort();
  const sortedCategories = [...allCategories].sort();
  const rows = [];
  rows.push('<table><thead><tr><th>月</th><th>カテゴリ</th><th>合計</th></tr></thead><tbody>');
  for (const m of sortedMonths) {
    for (const cat of sortedCategories) {
      rows.push(`<tr><td>${m}</td><td>${cat}</td><td>${monthlyCategorySums[m][cat]}</td></tr>`);
    }
  }
  rows.push('</tbody></table>');
  return rows.join('');
}

function tukibetu_category_big() {
  const mdl = new Model();
  const data = mdl.getData("支出TRA");
  const categoryData = mdl.getData("カテゴリ詳細MTA");
  const categoryMap = getCategoryMap(categoryData);
  const allCategories = getAllCategories(categoryData);
  const monthlyCategorySums = {};
  const months = generateMonths(2025, 1, 2025, 5);

  processData(data, categoryMap, monthlyCategorySums, months);
  initializeMonthlySums(monthlyCategorySums, months, allCategories);
  const html = buildHtmlTable(monthlyCategorySums, months, allCategories);
  //return html;
  Logger.log(monthlyCategorySums);
  return monthlyCategorySums;
}

function tukibetu_category_small() {
  const mdl = new Model();
  const data = mdl.getData("支出TRA");
  const categoryData = mdl.getData("カテゴリ詳細MTA");
  const allCategoriesDetail = getAllCategoriesDetail(categoryData);
  const monthlyCategoryDetailSums = {};
  const months = generateMonths(2025, 1, 2025, 5);

  processDataDetail(data, monthlyCategoryDetailSums, months);
  initializeMonthlySums(monthlyCategoryDetailSums, months, allCategoriesDetail);
  const html = buildHtmlTable(monthlyCategoryDetailSums, months, allCategoriesDetail);
  //return html;
  Logger.log(monthlyCategoryDetailSums);
  return monthlyCategoryDetailSums;
}

function save_sheet() {
  const monthlyCategorySums = myFunction();
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("MonthlyData");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("MonthlyData");
  }
  sheet.clearContents();

  const sortedMonths = Object.keys(monthlyCategorySums).sort();
  const sortedCategories = Object.keys(monthlyCategorySums[sortedMonths[0]]).sort();

  sortedMonths.forEach((m, colIndex) => {
    sheet.getRange(1, colIndex + 2).setValue(m);
  });

  sortedCategories.forEach((cat, rowIndex) => {
    sheet.getRange(rowIndex + 2, 1).setValue(cat);
    sortedMonths.forEach((m, colIndex) => {
      sheet.getRange(rowIndex + 2, colIndex + 2).setValue(monthlyCategorySums[m][cat]);
    });
  });
}