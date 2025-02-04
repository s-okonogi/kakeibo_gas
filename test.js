function myFunction() {
  const mdl = new Model();

  const data = mdl.getData("支出TRA");
  const category_data = mdl.getData("カテゴリMTA");
  const aggregatedData = aggregateExpenses(data, category_data);

  // 集計結果の表示
  for (const yearMonth in aggregatedData) {
    Logger.log(`${yearMonth}の集計結果:`);
    for (const category in aggregatedData[yearMonth]) {
      Logger.log(`  ${category}: ${aggregatedData[yearMonth][category]}円`);
    }
  }

  outputToSpreadsheet(aggregatedData, category_data);
}

function aggregateExpenses(data, category_data) {
  const monthlyExpenses = {};

  data.forEach((item) => {
    const date = new Date(item.日付);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScriptのgetMonth()は0-11を返すため+1
    const category = item.カテゴリ;
    const amount = item.金額;

    const yearMonth = `${year}-${month}`;

    if (!monthlyExpenses[yearMonth]) {
      monthlyExpenses[yearMonth] = {};
    }

    if (!monthlyExpenses[yearMonth][category]) {
      monthlyExpenses[yearMonth][category] = 0;
    }

    monthlyExpenses[yearMonth][category] += amount;
  });

  // 全カテゴリを含める
  for (const yearMonth in monthlyExpenses) {
    category_data.forEach((category) => {
      if (!monthlyExpenses[yearMonth][category]) {
        monthlyExpenses[yearMonth][category] = 0;
      }
    });
  }

  return monthlyExpenses;
}

// テーブル形式で表示 (Apps ScriptのLoggerではテーブル表示ができないため、Spreadsheetに出力する例)

function outputToSpreadsheet(data, category_data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("集計結果") || ss.insertSheet("集計結果"); // "集計結果"シートを取得、なければ作成

  // ヘッダー行の作成
  const header = ["年月", "カテゴリ", "金額"];
  sheet.appendRow(header);

  // データ行の作成
  for (const yearMonth in data) {
    category_data.forEach((category) => {
      const row = [yearMonth, category, data[yearMonth][category] || 0];
      sheet.appendRow(row);
    });
  }
}
