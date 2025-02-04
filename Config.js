function useProperty(property_name) {
  const propetiesService = PropertiesService;
  const scriptProperties = propetiesService.getScriptProperties();
  const property = scriptProperties.getProperty(property_name);
  return property;
}

function config() {
  // スプレッドシート ID を指定しない（空欄）場合は getActiveSpreadsheet が実行される
  this.spreadsheetId = useProperty("SPREAD_SHEET_ID"); // Spreadsheet ID: Default Database

  // ===========================
  // Setting as you like
  // ===========================
  this.settingAsYouLike = "Sample";

  return this;
}
