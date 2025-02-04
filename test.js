function doGet(e){
  const template = HtmlService.createTemplateFromFile("monthly_high");
  const html_output = template.evaluate();
  html_output.setTitle("月間支出高");
  return html_output;
}


function myFunction() {
  const mdl = new Model();

  const data = mdl.getData("支出トラン");

  Logger.log(data);
  Logger.log("=============");
  Logger.log(data[0]["日付"]);
  Logger.log(data[0]["カテゴリ"]);
  Logger.log(data[0]["金額"]);
}
